import { toast, ToastOptions } from 'react-toastify';
import { MessageCode, MessageType } from '../constants/system-messages';
import { getMessage, getMessageType } from './message-utils';

/**
 * Show a toast notification based on message code
 * The toast type (success, error, warning, info) is automatically determined from the message code
 * @param code Message code
 * @param params Optional parameters for message interpolation
 * @param options Optional toast options
 */
export const showToast = (code: MessageCode, params?: Record<string, string | number>, options?: ToastOptions): void => {
  const message = getMessage(code, params);
  const type = getMessageType(code);

  switch (type) {
    case MessageType.TOAST_SUCCESS:
      toast.success(message, options);
      break;
    case MessageType.TOAST_ERROR:
      toast.error(message, options);
      break;
    case MessageType.TOAST_WARNING:
      toast.warning(message, options);
      break;
    case MessageType.TOAST_INFO:
      toast.info(message, options);
      break;
    default:
      toast(message, options);
  }
};

/**
 * Show a success toast
 * @param code Message code
 * @param params Optional parameters
 * @param options Optional toast options
 */
export const showSuccessToast = (code: MessageCode, params?: Record<string, string | number>, options?: ToastOptions): void => {
  const message = getMessage(code, params);
  toast.success(message, options);
};

/**
 * Show an error toast
 * @param code Message code
 * @param params Optional parameters
 * @param options Optional toast options
 */
export const showErrorToast = (code: MessageCode, params?: Record<string, string | number>, options?: ToastOptions): void => {
  const message = getMessage(code, params);
  toast.error(message, options);
};

/**
 * Show a warning toast
 * @param code Message code
 * @param params Optional parameters
 * @param options Optional toast options
 */
export const showWarningToast = (code: MessageCode, params?: Record<string, string | number>, options?: ToastOptions): void => {
  const message = getMessage(code, params);
  toast.warning(message, options);
};

/**
 * Show an info toast
 * @param code Message code
 * @param params Optional parameters
 * @param options Optional toast options
 */
export const showInfoToast = (code: MessageCode, params?: Record<string, string | number>, options?: ToastOptions): void => {
  const message = getMessage(code, params);
  toast.info(message, options);
};

/**
 * React hook for toast notifications
 */
export const useToast = () => {
  return {
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
  };
};

export default useToast;
