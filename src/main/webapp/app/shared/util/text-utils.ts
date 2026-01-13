/**
 * Text manipulation utilities
 * Provides consistent text transformation functions across the application
 */

/**
 * Capitalize the first letter of a string
 * @param str Input string
 * @returns String with first letter capitalized
 * @example
 * capitalize('hello') // => 'Hello'
 * capitalize('WORLD') // => 'World'
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize the first letter of each word
 * @param str Input string
 * @returns String with each word capitalized
 * @example
 * capitalizeWords('hello world') // => 'Hello World'
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Normalize a string for search/comparison purposes
 * Converts to lowercase and trims whitespace
 * @param str Input string
 * @returns Normalized string
 * @example
 * normalizeSearch('  Hello World  ') // => 'hello world'
 */
export const normalizeSearch = (str: string | null | undefined): string => {
  return (str || '').toLowerCase().trim();
};

/**
 * Truncate a string to a maximum length with ellipsis
 * @param str Input string
 * @param maxLength Maximum length (including suffix)
 * @param suffix Suffix to append (default: '...')
 * @returns Truncated string
 * @example
 * truncate('Hello World', 8) // => 'Hello...'
 * truncate('Hello', 10) // => 'Hello'
 */
export const truncate = (str: string, maxLength: number, suffix = '...'): string => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length).trim() + suffix;
};

/**
 * Convert string to URL-friendly slug
 * @param str Input string
 * @returns Slugified string
 * @example
 * slugify('Hello World!') // => 'hello-world'
 * slugify('  React & TypeScript  ') // => 'react-typescript'
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Pluralize a word based on count
 * @param count Number to determine plural
 * @param singular Singular form
 * @param plural Plural form (optional, defaults to singular + 's')
 * @returns Pluralized string with count
 * @example
 * pluralize(1, 'book') // => '1 book'
 * pluralize(5, 'book') // => '5 books'
 * pluralize(2, 'child', 'children') // => '2 children'
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  const word = count === 1 ? singular : plural || `${singular}s`;
  return `${count} ${word}`;
};

/**
 * Get initials from a name
 * @param name Full name
 * @param maxInitials Maximum number of initials (default: 2)
 * @returns Initials
 * @example
 * getInitials('John Doe') // => 'JD'
 * getInitials('John Smith Doe', 3) // => 'JSD'
 */
export const getInitials = (name: string, maxInitials = 2): string => {
  if (!name) return '';
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .slice(0, maxInitials)
    .map(word => word[0].toUpperCase())
    .join('');
};

/**
 * Format a full name from first and last name
 * @param firstName First name
 * @param lastName Last name
 * @param fallback Fallback value if both names are empty
 * @returns Formatted full name
 * @example
 * formatFullName('John', 'Doe') // => 'John Doe'
 * formatFullName('', '', 'Anonymous') // => 'Anonymous'
 */
export const formatFullName = (firstName?: string | null, lastName?: string | null, fallback = 'Anonymous'): string => {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  return fullName || fallback;
};
