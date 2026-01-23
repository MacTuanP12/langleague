import { useMemo } from 'react';
import { EnrolledBook, FilterTab } from '../dashboard.constants';

interface UseBookFiltersProps {
  books: EnrolledBook[];
  searchQuery: string;
  filterTab: FilterTab;
}

/**
 * Custom hook to filter books based on search query and filter tab
 * Optimized with useMemo to prevent unnecessary recalculations
 */
export const useBookFilters = ({ books, searchQuery, filterTab }: UseBookFiltersProps) => {
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const matchesSearch =
        book.title.toLowerCase().includes(lowerCaseQuery) || (book.description && book.description.toLowerCase().includes(lowerCaseQuery));

      if (filterTab === 'enrolled') {
        return matchesSearch && (book.status === 'ACTIVE' || book.status === 'COMPLETED');
      }

      if (filterTab === 'notEnroll') {
        return matchesSearch && book.status === 'NOT_ENROLLED';
      }

      return matchesSearch;
    });
  }, [books, searchQuery, filterTab]);

  return { filteredBooks };
};
