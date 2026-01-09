import { AUTHORITIES } from 'app/config/constants';

/**
 * Get the appropriate route based on user authorities
 * Priority: ROLE_ADMIN > ROLE_TEACHER > ROLE_STUDENT
 */
export const getRouteByAuthorities = (authorities: string): string => {
  if (!authorities) {
    return '/';
  }

  // Convert comma-separated string to array
  const authArray = authorities.split(',').map(auth => auth.trim());

  // Check for ADMIN role
  if (authArray.includes(AUTHORITIES.ADMIN)) {
    return '/admin/dashboard';
  }

  // Check for TEACHER role
  if (authArray.includes(AUTHORITIES.TEACHER)) {
    return '/teacher/dashboard';
  }

  // Check for STUDENT role
  if (authArray.includes(AUTHORITIES.STUDENT)) {
    return '/student/dashboard';
  }

  // Default fallback
  return '/';
};

/**
 * Check if user has any of the required authorities
 */
export const hasAnyAuthority = (authorities: string[], hasAnyAuthorities: string[]): boolean => {
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    return hasAnyAuthorities.some(auth => authorities.includes(auth));
  }
  return false;
};

/**
 * Check if user has all of the required authorities
 */
export const hasAllAuthorities = (authorities: string[], requiredAuthorities: string[]): boolean => {
  if (authorities && authorities.length !== 0) {
    if (requiredAuthorities.length === 0) {
      return true;
    }
    return requiredAuthorities.every(auth => authorities.includes(auth));
  }
  return false;
};
