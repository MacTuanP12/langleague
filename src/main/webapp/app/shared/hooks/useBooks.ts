import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchMyBooks, fetchPublicBooks, fetchEnrolledBooks } from 'app/shared/reducers/book.reducer';
import { IBook } from 'app/shared/model/book.model';

type BookFetchMode = 'teacher' | 'student-public' | 'student-enrolled';

interface UseBooksOptions {
  mode: BookFetchMode;
  autoFetch?: boolean;
  searchTerm?: string;
}

interface UseBooksReturn {
  books: IBook[];
  filteredBooks: IBook[];
  loading: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

/**
 * Unified custom hook for fetching and managing books across Teacher and Student modules
 *
 * @example Teacher usage:
 * const { books, loading, refetch } = useBooks({ mode: 'teacher' });
 *
 * @example Student usage:
 * const { books, loading } = useBooks({ mode: 'student-public', searchTerm });
 */
export const useBooks = ({ mode, autoFetch = true, searchTerm = '' }: UseBooksOptions): UseBooksReturn => {
  const dispatch = useAppDispatch();
  const { books, loading, errorMessage } = useAppSelector(state => state.book);

  // Fetch books based on mode
  const fetchBooks = () => {
    switch (mode) {
      case 'teacher':
        return dispatch(fetchMyBooks());
      case 'student-public':
        return dispatch(fetchPublicBooks());
      case 'student-enrolled':
        return dispatch(fetchEnrolledBooks());
      default:
        return Promise.resolve();
    }
  };

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchBooks();
    }
  }, [mode, autoFetch]);

  // Filter books by search term (memoized)
  const filteredBooks = useMemo(() => {
    if (!searchTerm) return books || [];

    const lowerSearchTerm = searchTerm.toLowerCase();
    return (books || []).filter(
      book => book.title?.toLowerCase().includes(lowerSearchTerm) || book.description?.toLowerCase().includes(lowerSearchTerm),
    );
  }, [books, searchTerm]);

  return {
    books: books || [],
    filteredBooks,
    loading,
    errorMessage,
    refetch: fetchBooks,
  };
};
