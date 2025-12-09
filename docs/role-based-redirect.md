# Hệ thống Role-Based Redirect

## Mô tả
Hệ thống tự động redirect user đến trang tương ứng sau khi đăng nhập dựa trên role của họ.

## Các Role và Route tương ứng

| Role | Route | Mô tả |
|------|-------|-------|
| `ROLE_ADMIN` | `/admin` | Trang quản trị cho Admin |
| `ROLE_STAFF` | `/staff` | Trang quản lý nội dung cho Staff |
| `ROLE_USER` | `/dashboard` | Trang dashboard cho User thường |

## Thứ tự ưu tiên

Khi user có nhiều role, hệ thống sẽ redirect theo thứ tự ưu tiên sau:
1. `ROLE_ADMIN` (cao nhất)
2. `ROLE_STAFF`
3. `ROLE_USER`
4. Route mặc định `/` (nếu không có role nào được nhận diện)

## Cách hoạt động

### 1. Sau khi đăng nhập thành công

Trong file `auth-slider.tsx`, sau khi user đăng nhập thành công:

```typescript
// Giải mã JWT token để lấy authorities
const tokenParts = token.split('.');
const payload = JSON.parse(atob(tokenParts[1]));
const authorities = payload.auth || '';

// Redirect dựa trên role
redirectUserByRole(authorities);
```

### 2. Hàm `redirectUserByRole`

```typescript
const redirectUserByRole = (authorities: string) => {
  const targetRoute = getRouteByAuthorities(authorities);
  navigate(targetRoute);
};
```

### 3. Utility function `getRouteByAuthorities`

File: `src/main/webapp/app/shared/utils/role-routes.ts`

```typescript
export const getRouteByAuthorities = (authorities: string): string => {
  // Tìm role có ưu tiên cao nhất
  for (const role of ROLE_PRIORITY) {
    if (authorities.includes(role)) {
      return ROLE_ROUTES[role];
    }
  }
  return '/'; // Route mặc định
};
```

## Các utility functions hữu ích

### `hasRole(authorities, role)`
Kiểm tra xem user có role cụ thể không:
```typescript
import { hasRole, USER_ROLES } from 'app/shared/utils/role-routes';

if (hasRole(authorities, USER_ROLES.ADMIN)) {
  // User là admin
}
```

### `hasAnyRole(authorities, roles)`
Kiểm tra xem user có ít nhất một trong các role:
```typescript
import { hasAnyRole, USER_ROLES } from 'app/shared/utils/role-routes';

if (hasAnyRole(authorities, [USER_ROLES.ADMIN, USER_ROLES.STAFF])) {
  // User là admin hoặc staff
}
```

### `getHighestRole(authorities)`
Lấy role cao nhất của user:
```typescript
import { getHighestRole } from 'app/shared/utils/role-routes';

const highestRole = getHighestRole(authorities);
console.log('Highest role:', highestRole);
```

## Cách thêm role mới

1. Thêm role vào constants trong `role-routes.ts`:
```typescript
export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  STAFF: 'ROLE_STAFF',
  USER: 'ROLE_USER',
  TEACHER: 'ROLE_TEACHER', // Role mới
} as const;
```

2. Thêm route tương ứng:
```typescript
export const ROLE_ROUTES = {
  [USER_ROLES.ADMIN]: '/admin',
  [USER_ROLES.STAFF]: '/staff',
  [USER_ROLES.TEACHER]: '/teacher', // Route mới
  [USER_ROLES.USER]: '/dashboard',
} as const;
```

3. Cập nhật thứ tự ưu tiên:
```typescript
export const ROLE_PRIORITY = [
  USER_ROLES.ADMIN,
  USER_ROLES.STAFF,
  USER_ROLES.TEACHER, // Thêm vào đây
  USER_ROLES.USER
] as const;
```

4. Tạo route trong `routes.tsx`:
```typescript
<Route
  path="teacher"
  element={
    <PrivateRoute hasAnyAuthorities={['ROLE_TEACHER', 'ROLE_ADMIN']}>
      <DashboardLayout />
    </PrivateRoute>
  }
>
  <Route index element={<TeacherOverview />} />
  {/* Các route con khác */}
</Route>
```

## Logging và Debug

Hệ thống tự động log các thông tin sau vào console:
- User authorities
- Role được tìm thấy
- Route sẽ redirect đến

Để debug, mở Developer Console và xem logs khi đăng nhập.

## Xử lý lỗi

- Nếu không có authorities: redirect về `/`
- Nếu không nhận diện được role: redirect về `/`
- Nếu token không hợp lệ: hiển thị lỗi và giữ ở trang login

## Testing

### Test case 1: Admin login
```
Input: authorities = "ROLE_ADMIN,ROLE_USER"
Expected: Redirect to /admin
```

### Test case 2: Staff login
```
Input: authorities = "ROLE_STAFF,ROLE_USER"
Expected: Redirect to /staff
```

### Test case 3: User login
```
Input: authorities = "ROLE_USER"
Expected: Redirect to /dashboard
```

### Test case 4: No role
```
Input: authorities = ""
Expected: Redirect to /
```

## Security

- Mỗi route đều được bảo vệ bởi `PrivateRoute` component
- Backend sẽ verify role trước khi cho phép truy cập
- Token được lưu trong localStorage
- Token được gửi kèm trong mọi request thông qua interceptor

