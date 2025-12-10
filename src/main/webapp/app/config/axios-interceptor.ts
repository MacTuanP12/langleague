import axios from 'axios';
import { TOKEN_KEY } from './constants';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;
axios.defaults.withCredentials = true;

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const setupAxiosInterceptors = onUnauthenticated => {
  const onRequestSuccess = config => {
    // Don't add token to /authenticate and /register endpoints
    const isAuthEndpoint = config.url && (config.url.includes('/api/authenticate') || config.url.includes('/api/register'));

    if (!isAuthEndpoint) {
      // Get token from localStorage only
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  };

  const onResponseSuccess = response => response;

  const onResponseError = async err => {
    const status = err.status || (err.response ? err.response.status : 0);
    const config = err.config || {};
    const url = config.url || '';

    // Handle 401 errors with token refresh
    if (status === 401 && !config._retry) {
      const isAuthCheck = url.includes('/api/account') || url.includes('/api/authenticate');

      // Check if this is a background/silent request that shouldn't trigger redirect
      const isSilentRequest = config.headers?.['X-Silent-Request'] === 'true';

      // Don't redirect for silent requests - let the caller handle the error
      if (isSilentRequest) {
        console.debug('Silent request failed with 401, not redirecting');
        return Promise.reject(err instanceof Error ? err : new Error(String(err)));
      }

      if (isAuthCheck) {
        // Auth endpoint failed - redirect to login
        console.warn('Authentication failed, redirecting to login');
        onUnauthenticated();
        return Promise.reject(err instanceof Error ? err : new Error(String(err)));
      }

      // For other 401s, try to refresh token
      if (isRefreshing) {
        // Already refreshing, queue this request
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((tokenValue: string | null) => {
            const tokenStr = tokenValue ?? '';
            config.headers['Authorization'] = 'Bearer ' + tokenStr;
            return axios(config);
          })
          .catch(error => {
            return Promise.reject(error instanceof Error ? error : new Error(String(error)));
          });
      }

      config._retry = true;
      isRefreshing = true;

      // Try to get a fresh token by calling /api/account
      // If user is still logged in, this will work
      try {
        const response = await axios.get('/api/account');
        if (response.status === 200) {
          // Token is still valid, retry the original request
          processQueue(null, null);
          isRefreshing = false;
          return axios(config);
        }
      } catch (refreshError) {
        // Token refresh failed - redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        console.warn('Token refresh failed, redirecting to login');
        onUnauthenticated();
        return Promise.reject(refreshError instanceof Error ? refreshError : new Error(String(refreshError)));
      }
    } else if (status === 403) {
      // 403 means authenticated but not authorized - don't redirect to login
      console.warn('403 Forbidden on:', config.url, '- Insufficient permissions');
    }

    return Promise.reject(err instanceof Error ? err : new Error(String(err)));
  };

  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);

  // Dev-only: fallback for network errors so frontend can run without backend
  if (process.env.NODE_ENV !== 'production') {
    axios.interceptors.response.use(undefined, error => {
      // If there's already a response error, delegate to existing handler
      if (error && error.response) {
        return Promise.reject(error instanceof Error ? error : new Error(error));
      }
      // Network error (no response) - return a safe fake response to prevent unhandled rejections
      const cfg = error.config || {};
      const method = (cfg.method || 'get').toLowerCase();
      const fallbackData = method === 'get' ? [] : null;
      const fakeResponse = {
        data: fallbackData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: cfg,
      };
      console.warn('Axios dev fallback applied for network error:', error && error.message ? error.message : error);
      return Promise.resolve(fakeResponse);
    });
  }
};

export default setupAxiosInterceptors;
