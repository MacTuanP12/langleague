import { IProgress } from 'app/shared/model/progress.model';
import { IBook } from 'app/shared/model/book.model';

/**
 * Calculate progress percentage for a book based on completed units
 *
 * @param bookId - The book ID to calculate progress for
 * @param allProgresses - Array of all progress records
 * @returns Progress percentage (0-100)
 */
export const calculateBookProgress = (bookId: number | undefined, allProgresses: IProgress[] = []): number => {
  if (!bookId || !allProgresses || allProgresses.length === 0) return 0;

  // Filter progresses for this specific book
  const bookProgresses = allProgresses.filter(p => p.unit?.book?.id === bookId);

  if (bookProgresses.length === 0) return 0;

  // Count completed units
  const completed = bookProgresses.filter(p => p.isCompleted).length;

  return Math.round((completed / bookProgresses.length) * 100);
};

/**
 * Calculate completion status for a book
 *
 * @param progress - Progress percentage (0-100)
 * @returns Status string: 'NOT_STARTED', 'IN_PROGRESS', or 'COMPLETED'
 */
export const getBookCompletionStatus = (progress: number): string => {
  if (progress === 0) return 'NOT_STARTED';
  if (progress === 100) return 'COMPLETED';
  return 'IN_PROGRESS';
};

/**
 * Filter books by search term
 *
 * @param books - Array of books to filter
 * @param searchTerm - Search term to filter by
 * @returns Filtered array of books
 */
export const filterBooksBySearch = (books: IBook[], searchTerm: string): IBook[] => {
  if (!searchTerm) return books;

  const lowerSearchTerm = searchTerm.toLowerCase();

  return books.filter(
    book => book.title?.toLowerCase().includes(lowerSearchTerm) || book.description?.toLowerCase().includes(lowerSearchTerm),
  );
};

/**
 * Sort books by different criteria
 *
 * @param books - Array of books to sort
 * @param sortBy - Sort criteria: 'title', 'createdAt'
 * @param order - Sort order: 'asc' or 'desc'
 * @returns Sorted array of books
 */
export const sortBooks = (books: IBook[], sortBy: 'title' | 'createdAt' = 'createdAt', order: 'asc' | 'desc' = 'desc'): IBook[] => {
  const sorted = [...books].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '');
        break;
      case 'createdAt':
        comparison = (a.createdAt?.valueOf() || 0) - (b.createdAt?.valueOf() || 0);
        break;
      default:
        comparison = 0;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

/**
 * Get default book cover image URL
 */
export const getDefaultBookCover = (): string => {
  return '/content/images/default-book.png';
};

/**
 * Validate book cover URL and return safe URL
 *
 * @param url - Book cover URL to validate
 * @returns Valid URL or default cover
 */
export const getSafeBookCoverUrl = (url: string | undefined | null): string => {
  if (!url || url.trim() === '') {
    return getDefaultBookCover();
  }
  return url;
};
