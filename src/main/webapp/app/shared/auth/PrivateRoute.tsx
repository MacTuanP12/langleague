import React from 'react';
import { Navigate } from 'react-router-dom';
import { TOKEN_KEY } from 'app/config/constants';

interface PrivateRouteProps {
  children: React.ReactElement;
  hasAnyAuthorities?: string[];
}

/**
 * Route guard component để bảo vệ các route theo authorities
 * @param children - Component con sẽ render nếu đủ quyền
 * @param hasAnyAuthorities - Mảng các authorities cần thiết (VD: ['ROLE_ADMIN', 'ROLE_STAFF'])
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, hasAnyAuthorities = [] }) => {
  // Lấy token từ storage - check localStorage trước, sau đó sessionStorage
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

  console.log('=== PrivateRoute Check ===');
  console.log('Token exists:', !!token);
  console.log('Required authorities:', hasAnyAuthorities);

  // Nếu không có token, redirect về login
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Nếu không yêu cầu authorities cụ thể, cho phép truy cập
  if (hasAnyAuthorities.length === 0) {
    console.log('No specific authorities required, allowing access');
    return children;
  }

  // Decode JWT để lấy authorities
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));

      let userAuthorities: string[] = ['ROLE_USER'];

      // Parse authorities từ JWT payload
      if (payload.auth) {
        if (typeof payload.auth === 'string') {
          userAuthorities = payload.auth
            .split(/[,\s]+/)
            .map((a: string) => a.trim())
            .filter((a: string) => a.length > 0);
        } else if (Array.isArray(payload.auth)) {
          userAuthorities = payload.auth;
        }
      } else if (payload.authorities) {
        userAuthorities = Array.isArray(payload.authorities) ? payload.authorities : [payload.authorities];
      }

      console.log('User authorities:', userAuthorities);

      // Kiểm tra xem user có bất kỳ authority nào trong danh sách yêu cầu không
      const hasAuthority = hasAnyAuthorities.some(authority => userAuthorities.includes(authority));

      console.log('Has required authority:', hasAuthority);

      if (hasAuthority) {
        console.log('Access granted');
        return children;
      }

      // Nếu không có quyền, redirect về dashboard hoặc trang phù hợp
      console.warn('User does not have required authority', {
        required: hasAnyAuthorities,
        actual: userAuthorities,
      });

      // Redirect dựa trên role hiện tại
      if (userAuthorities.includes('ROLE_ADMIN')) {
        console.log('Redirecting to /admin');
        return <Navigate to="/admin" replace />;
      } else if (userAuthorities.includes('ROLE_STAFF')) {
        console.log('Redirecting to /staff');
        return <Navigate to="/staff" replace />;
      }
      console.log('Redirecting to /dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return <Navigate to="/login" replace />;
  }

  console.log('Fallback: Redirecting to login');
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
