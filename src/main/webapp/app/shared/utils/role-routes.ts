/**
 * File quản lý mapping giữa các role và route tương ứng
 */

// Định nghĩa các role trong hệ thống
export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  STAFF: 'ROLE_STAFF',
  USER: 'ROLE_USER',
} as const;

// Định nghĩa route mặc định cho mỗi role (theo thứ tự ưu tiên)
export const ROLE_ROUTES = {
  [USER_ROLES.ADMIN]: '/admin',
  [USER_ROLES.STAFF]: '/staff',
  [USER_ROLES.USER]: '/dashboard',
} as const;

// Thứ tự ưu tiên khi user có nhiều role
export const ROLE_PRIORITY = [USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.USER] as const;

/**
 * Lấy route tương ứng với role cao nhất của user
 * @param authorities - Chuỗi chứa các role, phân cách bởi dấu phẩy hoặc khoảng trắng
 * @returns Route tương ứng hoặc route mặc định
 */
export const getRouteByAuthorities = (authorities: string): string => {
  if (!authorities) {
    console.warn('No authorities provided, returning default route');
    return '/';
  }

  // Tìm role có ưu tiên cao nhất
  for (const role of ROLE_PRIORITY) {
    if (authorities.includes(role)) {
      const route = ROLE_ROUTES[role];
      console.log(`Found role ${role}, redirecting to ${route}`);
      return route;
    }
  }

  // Nếu không tìm thấy role nào, trả về route mặc định
  console.warn('No recognized role found in authorities:', authorities);
  return '/';
};

/**
 * Kiểm tra xem user có role cụ thể hay không
 * @param authorities - Chuỗi chứa các role
 * @param role - Role cần kiểm tra
 * @returns true nếu user có role đó
 */
export const hasRole = (authorities: string, role: string): boolean => {
  return authorities.includes(role);
};

/**
 * Kiểm tra xem user có ít nhất một trong các role được chỉ định
 * @param authorities - Chuỗi chứa các role
 * @param roles - Mảng các role cần kiểm tra
 * @returns true nếu user có ít nhất một role
 */
export const hasAnyRole = (authorities: string, roles: string[]): boolean => {
  return roles.some(role => authorities.includes(role));
};

/**
 * Lấy role cao nhất của user
 * @param authorities - Chuỗi chứa các role
 * @returns Role cao nhất hoặc null
 */
export const getHighestRole = (authorities: string): string | null => {
  for (const role of ROLE_PRIORITY) {
    if (authorities.includes(role)) {
      return role;
    }
  }
  return null;
};
