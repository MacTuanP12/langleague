/**
 * Constants for localStorage and sessionStorage keys
 */
export const STORAGE_KEYS = {
  GEMINI_API_KEY: 'USER_GEMINI_KEY',
  OPENAI_API_KEY: 'USER_OPENAI_KEY',
} as const;

/**
 * API Provider Links
 */
export const API_PROVIDER_LINKS = {
  GOOGLE_GEMINI: 'https://aistudio.google.com/app/apikey',
  OPENAI: 'https://platform.openai.com/api-keys',
} as const;
