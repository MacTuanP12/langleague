import { MessageCode, SYSTEM_MESSAGES, MessageType } from '../constants/system-messages';

/**
 * Get system message by code
 * @param code Message code
 * @param params Optional parameters for message interpolation
 * @returns The message content with interpolated parameters
 */
export const getMessage = (code: MessageCode, params?: Record<string, string | number>): string => {
  const message = SYSTEM_MESSAGES[code];
  if (!message) {
    return '';
  }

  let content = message.content;

  // Replace placeholders with actual values
  if (params) {
    Object.keys(params).forEach(key => {
      content = content.replace(`{${key}}`, String(params[key]));
    });
  }

  return content;
};

/**
 * Get message type by code
 * @param code Message code
 * @returns The message type
 */
export const getMessageType = (code: MessageCode): MessageType | undefined => {
  return SYSTEM_MESSAGES[code]?.type;
};

/**
 * Check if message is a toast message
 * @param code Message code
 * @returns true if message is a toast message
 */
export const isToastMessage = (code: MessageCode): boolean => {
  const type = getMessageType(code);
  return (
    type === MessageType.TOAST ||
    type === MessageType.TOAST_SUCCESS ||
    type === MessageType.TOAST_ERROR ||
    type === MessageType.TOAST_WARNING ||
    type === MessageType.TOAST_INFO
  );
};

/**
 * Check if message is an error message
 * @param code Message code
 * @returns true if message is an error message
 */
export const isErrorMessage = (code: MessageCode): boolean => {
  const type = getMessageType(code);
  return type === MessageType.IN_RED || type === MessageType.TOAST_ERROR;
};

/**
 * Check if message is a confirmation dialog
 * @param code Message code
 * @returns true if message is a confirmation dialog
 */
export const isConfirmDialog = (code: MessageCode): boolean => {
  return getMessageType(code) === MessageType.CONFIRM_DIALOG;
};

/**
 * Get validation message for form fields
 * @param fieldName Field name
 * @param validationType Type of validation (required, minLength, maxLength, etc.)
 * @param params Additional parameters
 * @returns Validation message
 */
export const getValidationMessage = (
  fieldName?: string,
  validationType?: 'required' | 'minLength' | 'maxLength' | 'email' | 'pattern',
  params?: Record<string, string | number>,
): string => {
  let code: MessageCode;

  switch (validationType) {
    case 'required':
      if (fieldName) {
        code = MessageCode.MSG05;
        return getMessage(code, { fieldName });
      }
      code = MessageCode.MSG02;
      break;
    case 'minLength':
      code = MessageCode.MSG04;
      break;
    case 'maxLength':
      code = MessageCode.MSG03;
      break;
    case 'email':
      code = MessageCode.MSG06;
      break;
    default:
      code = MessageCode.MSG02;
  }

  return getMessage(code, params);
};
