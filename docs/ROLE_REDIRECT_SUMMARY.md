# 🚀 Quick Reference: Role-Based Redirect

## 📌 TL;DR

Sau khi login, user được tự động redirect đến:
- **ROLE_ADMIN** → `/admin`
- **ROLE_STAFF** → `/staff`  
- **ROLE_USER** → `/dashboard`
- **No role** → `/`

## 🔧 Files Changed/Created

### Modified
✅ `src/main/webapp/app/modules/account/auth-slider.tsx`
- Added `redirectUserByRole()` function
- Integrated role-based redirect logic after login
- Uses `getRouteByAuthorities()` utility

### Created
✅ `src/main/webapp/app/shared/utils/role-routes.ts`
- Core utilities for role management
- Constants: `USER_ROLES`, `ROLE_ROUTES`, `ROLE_PRIORITY`
- Functions: `getRouteByAuthorities()`, `hasRole()`, `hasAnyRole()`, `getHighestRole()`

✅ `src/main/webapp/app/shared/utils/role-routes.examples.tsx`
- React component examples using role utilities
- Custom hooks
- Conditional rendering patterns

✅ `src/test/webapp/app/shared/utils/role-routes.spec.ts`
- Comprehensive unit tests
- Covers all edge cases

✅ `docs/role-based-redirect.md`
- Detailed documentation
- How to add new roles
- Security considerations

✅ `docs/ROLE_BASED_AUTH_README.md`
- Developer guide
- FAQ
- Troubleshooting

## 💡 Quick Usage

### In Login Flow
```typescript
// Auto-redirect after login (already implemented)
const authorities = payload.auth || '';
redirectUserByRole(authorities);
```

### Check Role in Component
```typescript
import { hasRole, USER_ROLES } from 'app/shared/utils/role-routes';

if (hasRole(authorities, USER_ROLES.ADMIN)) {
  // Show admin content
}
```

### Get Redirect URL
```typescript
import { getRouteByAuthorities } from 'app/shared/utils/role-routes';

const route = getRouteByAuthorities(authorities);
navigate(route);
```

## 🧪 Test

```bash
npm test -- role-routes.spec.ts
```

## 📚 More Info

See `docs/ROLE_BASED_AUTH_README.md` for complete documentation.

## ✅ What's Working

1. ✅ Login redirects based on role
2. ✅ Priority system (ADMIN > STAFF > USER)
3. ✅ Fallback to home page for unknown roles
4. ✅ Logging for debugging
5. ✅ Reusable utilities
6. ✅ Type-safe with TypeScript
7. ✅ Unit tests
8. ✅ Documentation

## 🎯 Next Steps (Optional)

- [ ] Add role-based navigation menu
- [ ] Implement role badge in header
- [ ] Add analytics for login redirects
- [ ] Cache user role in Redux store
- [ ] Add role switch feature for testing

## 🐛 Debug

Check browser console for:
```
User authorities: ROLE_ADMIN,ROLE_USER
Found role ROLE_ADMIN, redirecting to /admin
```

## 📞 Need Help?

Check:
1. Console logs during login
2. JWT token payload (authorities field)
3. Route configuration in `routes.tsx`
4. Backend role assignment

