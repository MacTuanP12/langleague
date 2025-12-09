import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * Custom hook for translations with namespace support
 * @param namespace - Translation namespace (e.g., 'common', 'staff', 'user')
 */
export const useTranslation = (namespace: string | string[] = 'common') => {
  return useI18nTranslation(namespace);
};

/**
 * Format relative time
 * @param date - Date string or Date object
 * @param t - Translation function
 */
export const formatRelativeTime = (date: string | Date, t: any): string => {
  if (!date) return '';

  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) return t('common:time.justNow');
  if (diffMins < 60) return t('common:time.minutesAgo', { count: diffMins });
  if (diffHours < 24) return t('common:time.hoursAgo', { count: diffHours });
  if (diffDays < 7) return t('common:time.daysAgo', { count: diffDays });
  return t('common:time.weeksAgo', { count: diffWeeks });
};

/**
 * Get level translation
 * @param level - Level string (BEGINNER, INTERMEDIATE, ADVANCED)
 * @param t - Translation function
 */
export const getLevelTranslation = (level: string | undefined, t: any): string => {
  if (!level) return '';
  const levelKey = level.toLowerCase();
  return t(`common:levels.${levelKey}`);
};

export default useTranslation;
