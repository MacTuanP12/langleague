import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getMyBooks, getPublicBooks, getEnrolledBooks } from 'app/entities/book/book.reducer';
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
  const { entities, loading, errorMessage } = useAppSelector(state => state.book);

  // Fetch books based on mode
  const fetchBooks = () => {
    switch (mode) {
      case 'teacher':
        return dispatch(getMyBooks({}));
      case 'student-public':
        return dispatch(getPublicBooks({}));
      case 'student-enrolled':
        return dispatch(getEnrolledBooks({}));
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
    if (!searchTerm) return entities || [];

    const lowerSearchTerm = searchTerm.toLowerCase();
    return (entities || []).filter(
      book => book.title?.toLowerCase().includes(lowerSearchTerm) || book.description?.toLowerCase().includes(lowerSearchTerm),
    );
  }, [entities, searchTerm]);

  return {
    books: entities || [],
    filteredBooks,
    loading,
    errorMessage,
    refetch: fetchBooks,
  };
};
