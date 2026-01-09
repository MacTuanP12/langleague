import { MessageCode } from '../constants/system-messages';
import { getMessage } from './message-utils';

/**
 * Props for the ConfirmDialog component
 */
interface ConfirmDialogProps {
  messageCode: MessageCode;
  onConfirm: () => void;
  onCancel?: () => void;
  params?: Record<string, string | number>;
}

/**
 * Show a confirmation dialog using system messages
 * @param props ConfirmDialog props
 * @returns true if confirmed, false if cancelled
 */
export const showConfirmDialog = (props: ConfirmDialogProps): boolean => {
  const { messageCode, params } = props;
  const message = getMessage(messageCode, params);
  return window.confirm(message);
};

/**
 * Execute an action with confirmation dialog
 * @param messageCode The message code for confirmation
 * @param action The action to execute if confirmed
 * @param params Optional parameters for the message
 */
export const executeWithConfirmation = async (
  messageCode: MessageCode,
  action: () => void | Promise<void>,
  params?: Record<string, string | number>,
): Promise<void> => {
  const message = getMessage(messageCode, params);
  if (window.confirm(message)) {
    await action();
  }
};

/**
 * Hook for confirmation dialogs
 */
export const useConfirmDialog = () => {
  const confirm = (messageCode: MessageCode, params?: Record<string, string | number>): boolean => {
    return showConfirmDialog({ messageCode, onConfirm() {}, params });
  };

  const confirmAsync = async (
    messageCode: MessageCode,
    action: () => void | Promise<void>,
    params?: Record<string, string | number>,
  ): Promise<void> => {
    return executeWithConfirmation(messageCode, action, params);
  };

  return { confirm, confirmAsync };
};

export default useConfirmDialog;
