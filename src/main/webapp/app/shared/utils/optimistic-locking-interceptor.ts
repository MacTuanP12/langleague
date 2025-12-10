import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { message } from 'antd';

/**
 * Axios interceptor to handle Optimistic Locking failures (409 Conflict).
 * Automatically retries the request up to 2 times with exponential backoff.
 */

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

export const setupOptimisticLockingInterceptor = () => {
  axios.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const config = error.config as RetryConfig;

      // Check if it's a 409 Conflict (Optimistic Locking failure)
      if (error.response?.status === 409 && config && !config._retry) {
        config._retryCount = config._retryCount || 0;

        if (config._retryCount < MAX_RETRIES) {
          config._retryCount += 1;
          config._retry = true;

          // Calculate exponential backoff delay
          const delay = RETRY_DELAY * Math.pow(2, config._retryCount - 1);

          // Show friendly message to user
          message.warning(`Hệ thống đang bận xử lý... Tự động thử lại lần ${config._retryCount}/${MAX_RETRIES}`, 2);

          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, delay));

          // Retry the request
          return axios(config);
        } else {
          // Max retries reached - show error to user
          message.error('Hệ thống đang bận, vui lòng thử lại sau ít giây', 5);
        }
      }

      // For other errors or max retries reached, pass through
      return Promise.reject(error);
    },
  );
};

/**
 * Alternative: Manual retry function for specific requests
 * Usage:
 * ```
 * const result = await retryOnConflict(() => submitExercise(data));
 * ```
 */
export const retryOnConflict = async <T>(fn: () => Promise<T>, maxRetries = 2, baseDelay = 1000): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (error.response?.status === 409 && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);

        message.warning(`Đang thử lại... (${attempt + 1}/${maxRetries})`, 1.5);

        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        break;
      }
    }
  }

  // All retries failed
  if (lastError) {
    message.error('Không thể xử lý yêu cầu, vui lòng thử lại sau');
    throw lastError;
  }

  throw new Error('Unexpected error in retryOnConflict');
};
