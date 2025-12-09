/**
 * Centralized JWT Token Storage Management
 *
 * This utility provides a consistent way to store, retrieve, and manage JWT tokens.
 *
 * Key Features:
 * - Single source of truth for token storage
 * - Token expiry validation
 * - Backward compatibility with legacy storage locations
 * - Cross-tab synchronization support
 */

import { TOKEN_KEY } from 'app/config/constants';

/**
 * Interface for decoded JWT user information
 */
export interface UserInfo {
  userId?: string;
  username: string;
  authorities: string[];
  email?: string;
  exp: number;
  iat?: number;
}

export const TokenStorage = {
  /**
   * Get the JWT token from storage
   * @returns The JWT token string or null if not found
   */
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Store the JWT token
   * @param token The JWT token to store
   */
  set(token: string): void {
    // Clear legacy storage locations for backward compatibility
    localStorage.removeItem('authToken');
    sessionStorage.removeItem(TOKEN_KEY);

    // Store in the single source of truth
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Remove the JWT token from all storage locations
   * Includes legacy locations for backward compatibility
   */
  remove(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('authToken'); // legacy key
    sessionStorage.removeItem(TOKEN_KEY); // legacy location
  },

  /**
   * Check if the current token is expired
   * @returns true if token is expired or invalid, false otherwise
   */
  isExpired(): boolean {
    const token = TokenStorage.get();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return true;
    }
  },

  /**
   * Get the token expiry time
   * @returns Date object of token expiry or null if invalid
   */
  getExpiryTime(): Date | null {
    const token = TokenStorage.get();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  /**
   * Get user information from token
   * @returns User object or null if invalid
   */
  getUserInfo(): UserInfo | null {
    const token = TokenStorage.get();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.userId || payload.sub,
        username: payload.sub,
        authorities: payload.auth ? payload.auth.split(' ') : [],
        email: payload.email,
        exp: payload.exp,
        iat: payload.iat,
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  /**
   * Check if token exists and is valid
   * @returns true if token exists and is not expired
   */
  isValid(): boolean {
    return TokenStorage.get() !== null && !TokenStorage.isExpired();
  },

  /**
   * Get time remaining until token expires (in milliseconds)
   * @returns milliseconds until expiry or 0 if expired/invalid
   */
  getTimeUntilExpiry(): number {
    const expiryTime = TokenStorage.getExpiryTime();
    if (!expiryTime) return 0;

    const remaining = expiryTime.getTime() - Date.now();
    return Math.max(0, remaining);
  },
};

/**
 * Hook up storage event listener to sync logout across tabs
 * Call this once in your app initialization (e.g., App.tsx)
 */
export const setupTokenStorageSync = (onTokenRemoved: () => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === TOKEN_KEY && e.newValue === null) {
      // Token was removed in another tab
      console.log('Token removed in another tab, logging out...');
      onTokenRemoved();
    }
  };

  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

export default TokenStorage;
