import { Translate, translate } from 'react-jhipster';
import { MessageCode } from '../constants/system-messages';
import { getMessage as getMessageUtil } from './message-utils';

/**
 * Custom hook for system messages with i18n support using react-jhipster
 */
export const useSystemMessage = () => {
  /**
   * Get system message by code
   * Tries to get from i18n first, falls back to default message
   * @param code Message code
   * @param params Optional parameters for message interpolation
   * @returns The message content
   */
  const getMessage = (code: MessageCode, params?: Record<string, string | number>): string => {
    const i18nKey = `systemMessages.${code}`;

    try {
      // Try to get translated message using react-jhipster
      const translatedMessage = translate(i18nKey, params);

      // If translation exists and is not the same as the key, use it
      if (translatedMessage && translatedMessage !== i18nKey) {
        return translatedMessage;
      }
    } catch (error) {
      // If translation fails, fall back to default
    }

    // Fall back to default message
    return getMessageUtil(code, params);
  };

  return { getMessage };
};
