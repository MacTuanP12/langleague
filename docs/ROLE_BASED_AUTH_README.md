# Role-Based Authentication & Redirect System

## 📋 Tổng quan

Hệ thống tự động redirect user đến trang tương ứng sau khi đăng nhập dựa trên role của họ trong JWT token.

## 🚀 Cách hoạt động

### Quy trình đăng nhập

```
User Login → JWT Token → Decode Token → Extract Roles → Redirect to Role-based Route
```

### Flow chi tiết

1. **User nhập thông tin đăng nhập** (email, password, captcha)
2. **Backend xác thực** và trả về JWT token chứa thông tin role
3. **Frontend decode token** để lấy authorities (roles)
4. **Hệ thống xác định route** dựa trên role có ưu tiên cao nhất
5. **Navigate đến trang** tương ứng

## 📁 Cấu trúc File

```
src/main/webapp/app/
├── modules/account/
│   └── auth-slider.tsx              # Login component với role-based redirect
├── shared/
│   └── utils/
│       ├── role-routes.ts           # Core utilities cho role management
│       └── role-routes.examples.tsx # Examples sử dụng utilities
└── routes.tsx                        # Route definitions với PrivateRoute guards

docs/
└── role-based-redirect.md           # Documentation chi tiết

src/test/webapp/app/shared/utils/
└── role-routes.spec.ts              # Unit tests
```

## 🎯 Roles & Routes

| Priority | Role | Route | Description |
|----------|------|-------|-------------|
| 1 | `ROLE_ADMIN` | `/admin` | Quản trị viên - Toàn quyền truy cập |
| 2 | `ROLE_STAFF` | `/staff` | Nhân viên - Quản lý nội dung |
| 3 | `ROLE_USER` | `/dashboard` | User thường - Học tập |
| - | None/Unknown | `/` | Trang chủ mặc định |

## 💻 Code Implementation

### 1. Login Handler (auth-slider.tsx)

```typescript
const handleLoginSubmit = async (values: any) => {
  // ... authentication logic ...
  
  // Decode JWT token
  const tokenParts = token.split('.');
  const payload = JSON.parse(atob(tokenParts[1]));
  const authorities = payload.auth || '';

  // Redirect based on role
  redirectUserByRole(authorities);
};

const redirectUserByRole = (authorities: string) => {
  const targetRoute = getRouteByAuthorities(authorities);
  navigate(targetRoute);
};
```

### 2. Core Utilities (role-routes.ts)

```typescript
// Constants
export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  STAFF: 'ROLE_STAFF',
  USER: 'ROLE_USER',
};

export const ROLE_ROUTES = {
  [USER_ROLES.ADMIN]: '/admin',
  [USER_ROLES.STAFF]: '/staff',
  [USER_ROLES.USER]: '/dashboard',
};

// Main function
export const getRouteByAuthorities = (authorities: string): string => {
  for (const role of ROLE_PRIORITY) {
    if (authorities.includes(role)) {
      return ROLE_ROUTES[role];
    }
  }
  return '/';
};
```

### 3. Route Protection (routes.tsx)

```typescript
<Route
  path="admin"
  element={
    <PrivateRoute hasAnyAuthorities={['ROLE_ADMIN']}>
      <DashboardLayout />
    </PrivateRoute>
  }
>
  {/* Admin routes */}
</Route>
```

## 🛠️ Sử dụng trong Component

### Check single role
```typescript
import { hasRole, USER_ROLES } from 'app/shared/utils/role-routes';

if (hasRole(authorities, USER_ROLES.ADMIN)) {
  // User is admin
}
```

### Check multiple roles
```typescript
import { hasAnyRole, USER_ROLES } from 'app/shared/utils/role-routes';

if (hasAnyRole(authorities, [USER_ROLES.ADMIN, USER_ROLES.STAFF])) {
  // User is admin or staff
}
```

### Get highest role
```typescript
import { getHighestRole } from 'app/shared/utils/role-routes';

const role = getHighestRole(authorities);
```

### Custom Hook
```typescript
export const useUserRole = (authorities: string) => {
  return {
    isAdmin: hasRole(authorities, USER_ROLES.ADMIN),
    isStaff: hasRole(authorities, USER_ROLES.STAFF),
    isUser: hasRole(authorities, USER_ROLES.USER),
    highestRole: getHighestRole(authorities),
  };
};
```

Xem thêm examples trong file `role-routes.examples.tsx`

## 🧪 Testing

Run tests:
```bash
npm test -- role-routes.spec.ts
```

Test cases cover:
- ✅ Redirect cho từng role
- ✅ Priority khi có nhiều roles
- ✅ Xử lý empty/invalid authorities
- ✅ Role checking functions
- ✅ Get highest role

## 📝 Thêm Role Mới

### Bước 1: Thêm constant
```typescript
// role-routes.ts
export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  STAFF: 'ROLE_STAFF',
  TEACHER: 'ROLE_TEACHER', // ← New role
  USER: 'ROLE_USER',
};
```

### Bước 2: Thêm route mapping
```typescript
export const ROLE_ROUTES = {
  [USER_ROLES.ADMIN]: '/admin',
  [USER_ROLES.STAFF]: '/staff',
  [USER_ROLES.TEACHER]: '/teacher', // ← New route
  [USER_ROLES.USER]: '/dashboard',
};
```

### Bước 3: Cập nhật priority
```typescript
export const ROLE_PRIORITY = [
  USER_ROLES.ADMIN,
  USER_ROLES.STAFF,
  USER_ROLES.TEACHER, // ← Add to priority list
  USER_ROLES.USER
];
```

### Bước 4: Tạo protected route
```typescript
// routes.tsx
<Route
  path="teacher"
  element={
    <PrivateRoute hasAnyAuthorities={['ROLE_TEACHER', 'ROLE_ADMIN']}>
      <DashboardLayout />
    </PrivateRoute>
  }
>
  <Route index element={<TeacherOverview />} />
</Route>
```

### Bước 5: Update backend
- Thêm `ROLE_TEACHER` vào database
- Cấu hình Spring Security cho role mới
- Update JWT token generation

## 🔒 Security Notes

1. **Frontend validation** chỉ để UX, không phải security boundary
2. **Backend** luôn validate role trước khi cho phép access
3. **PrivateRoute** component check authentication & authorization
4. **JWT Token** được verify ở backend cho mọi request
5. **Token** được lưu trong localStorage (có thể chuyển sang httpOnly cookie để bảo mật hơn)

## 🐛 Debugging

Enable logging trong `role-routes.ts`:
```typescript
console.log('User authorities:', authorities);
console.log('Found role:', role, 'redirecting to', route);
```

Check console khi login để xem:
- Authorities trong token
- Role được detect
- Route redirect đến

## 📚 Resources

- [Documentation chi tiết](../docs/role-based-redirect.md)
- [Code examples](./role-routes.examples.tsx)
- [Unit tests](../../../test/webapp/app/shared/utils/role-routes.spec.ts)

## 🤝 Contributing

Khi modify role system:
1. Update constants trong `role-routes.ts`
2. Update routes trong `routes.tsx`
3. Update documentation
4. Add test cases
5. Test thoroughly với các role khác nhau

## ❓ FAQ

**Q: User có nhiều role thì redirect về đâu?**  
A: Redirect về role có priority cao nhất (ADMIN > STAFF > USER)

**Q: Role không được nhận diện thì sao?**  
A: Redirect về trang chủ `/`

**Q: Làm sao để user có thể switch giữa các dashboard?**  
A: Thêm navigation menu check role và link đến các trang tương ứng

**Q: Token expired thì sao?**  
A: Backend sẽ trả về 401, frontend redirect về login page

**Q: Có thể cache role information không?**  
A: Có, có thể store trong Redux/Context, nhưng luôn verify với backend

## 📞 Support

Nếu có vấn đề, check:
1. Console logs
2. Network tab (JWT token response)
3. Backend logs
4. Route configuration trong `routes.tsx`

