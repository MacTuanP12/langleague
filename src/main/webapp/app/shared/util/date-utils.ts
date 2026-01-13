import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { APP_LOCAL_DATETIME_FORMAT } from 'app/config/constants';

// Enable relative time plugin
dayjs.extend(relativeTime);

/**
 * Convert date from server to local datetime format
 * @param date Date from server
 * @returns Formatted date string or null
 */
export const convertDateTimeFromServer = date => (date ? dayjs(date).format(APP_LOCAL_DATETIME_FORMAT) : null);

/**
 * Convert date to server format
 * @param date Date string
 * @returns Dayjs object or null
 */
export const convertDateTimeToServer = (date?: string): dayjs.Dayjs | null => (date ? dayjs(date) : null);

/**
 * Display default datetime (start of day)
 * @returns Formatted date string
 */
export const displayDefaultDateTime = () => dayjs().startOf('day').format(APP_LOCAL_DATETIME_FORMAT);

/**
 * Format date to readable format
 * @param date Date to format (Date, string, or null)
 * @param fallback Fallback text if date is null (default: 'N/A')
 * @returns Formatted date string
 * @example
 * formatDate(new Date('2026-01-09')) // => 'Jan 09, 2026'
 * formatDate(null, 'No date') // => 'No date'
 */
export const formatDate = (date: Date | string | null | undefined, fallback = 'N/A'): string => {
  return date ? dayjs(date).format('MMM DD, YYYY') : fallback;
};

/**
 * Format date with time
 * @param date Date to format (Date, string, or null)
 * @param fallback Fallback text if date is null (default: 'N/A')
 * @returns Formatted datetime string
 * @example
 * formatDateTime(new Date()) // => 'Jan 09, 2026 14:30'
 */
export const formatDateTime = (date: Date | string | null | undefined, fallback = 'N/A'): string => {
  return date ? dayjs(date).format('MMM DD, YYYY HH:mm') : fallback;
};

/**
 * Format date as relative time (e.g., "2 hours ago")
 * @param date Date to format (Date, string, or null)
 * @param fallback Fallback text if date is null (default: 'N/A')
 * @returns Relative time string
 * @example
 * formatRelativeTime(new Date()) // => 'a few seconds ago'
 * formatRelativeTime(Date.now() - 3600000) // => 'an hour ago'
 */
export const formatRelativeTime = (date: Date | string | null | undefined, fallback = 'N/A'): string => {
  return date ? dayjs(date).fromNow() : fallback;
};

/**
 * Format date for date input (YYYY-MM-DD)
 * @param date Date to format
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date: Date | string | null | undefined): string => {
  return date ? dayjs(date).format('YYYY-MM-DD') : '';
};

/**
 * Check if a date is today
 * @param date Date to check
 * @returns True if date is today
 */
export const isToday = (date: Date | string): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Check if a date is in the past
 * @param date Date to check
 * @returns True if date is in the past
 */
export const isPast = (date: Date | string): boolean => {
  return dayjs(date).isBefore(dayjs());
};

/**
 * Get duration between two dates in human-readable format
 * @param startDate Start date
 * @param endDate End date (default: now)
 * @returns Duration string
 */
export const getDuration = (startDate: Date | string, endDate: Date | string = new Date()): string => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diffInMinutes = end.diff(start, 'minute');

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes`;
  }

  const diffInHours = end.diff(start, 'hour');
  if (diffInHours < 24) {
    return `${diffInHours} hours`;
  }

  const diffInDays = end.diff(start, 'day');
  return `${diffInDays} days`;
};
