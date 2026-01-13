/**
 * System Messages Utilities
 * Export all system message related utilities
 */

// Constants
export { MessageCode, MessageType, SYSTEM_MESSAGES } from '../constants/system-messages';
export type { SystemMessage } from '../constants/system-messages';

// Message utilities
export { getMessage, getMessageType, isToastMessage, isErrorMessage, isConfirmDialog, getValidationMessage } from './message-utils';

// Toast utilities
export { showToast, showSuccessToast, showErrorToast, showWarningToast, showInfoToast, useToast } from './toast-utils';

// Confirmation dialog utilities
export { showConfirmDialog, executeWithConfirmation, useConfirmDialog } from './confirm-dialog';

// System message hook
export { useSystemMessage } from './use-system-message';

// Date utilities
export {
  convertDateTimeFromServer,
  convertDateTimeToServer,
  displayDefaultDateTime,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatDateForInput,
  isToday,
  isPast,
  getDuration,
} from './date-utils';

// Text utilities
export { capitalize, capitalizeWords, normalizeSearch, truncate, slugify, pluralize, getInitials, formatFullName } from './text-utils';

// File text extraction utilities
export { extractTextFromFile, isFileTypeSupported, getSupportedExtensions, getAcceptAttribute } from './file-text-extractor';
