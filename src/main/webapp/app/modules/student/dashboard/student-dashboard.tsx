import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Translate } from 'react-jhipster';
import { LoadingSpinner } from 'app/shared/components';
import { IProgress } from 'app/shared/model/progress.model';
import { FilterTab } from './dashboard.constants';
import { useBookFilters } from './hooks/useBookFilters';
import { BookCard } from './components/BookCard';
import { SearchFilterSection } from './components/SearchFilterSection';
import { StreakWidget } from './components/StreakWidget';
import { useEnrollments, useProgress, useUserProfile } from 'app/shared/reducers/hooks';
import styles from './student-dashboard.module.scss';

/**
 * StudentDashboard Component - Using Redux for real data
 *
 * Features:
 * - Fetch user enrollments from API
 * - Track learning progress
 * - Filter and search books
 * - Display user statistics
 */

// Helper function to calculate progress (moved outside component for performance)
const calculateProgress = (bookId: number | undefined, allProgresses: IProgress[] = []): number => {
  if (!bookId || !allProgresses || allProgresses.length === 0) return 0;

  // Calculate based on completed units
  const bookProgresses = allProgresses.filter(p => p.unit?.book?.id === bookId);
  if (bookProgresses.length === 0) return 0;

  const completed = bookProgresses.filter(p => p.isCompleted).length;
  return Math.round((completed / bookProgresses.length) * 100);
};

export const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  // Redux hooks
  const { enrollments, loading, loadMyEnrollments } = useEnrollments();
  const { progresses, loadMyProgresses } = useProgress();
  const { loadCurrentProfile } = useUserProfile();

  // Transform enrollments to books format with safe null handling
  const books = useMemo(() => {
    if (!enrollments || !Array.isArray(enrollments)) return [];

    return enrollments.map(enrollment => ({
      id: enrollment.book?.id || 0,
      title: enrollment.book?.title || 'Untitled Book',
      description: enrollment.book?.description || '',
      coverImageUrl: enrollment.book?.coverImageUrl,
      progress: calculateProgress(enrollment.book?.id, progresses || []),
      status: enrollment.status || 'ACTIVE',
      enrolledAt: enrollment.enrolledAt,
    }));
  }, [enrollments, progresses]);

  // Use custom hook for filtering with memoization
  const { filteredBooks } = useBookFilters({ books, searchQuery, filterTab });

  // Fetch data on mount
  useEffect(() => {
    loadMyEnrollments();
    loadMyProgresses();
    loadCurrentProfile();
  }, [loadMyEnrollments, loadMyProgresses, loadCurrentProfile]);

  // Memoized event handlers
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((tab: FilterTab) => {
    setFilterTab(tab);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={styles?.dashboardContentWrapper || 'dashboard-content-wrapper'}>
        <LoadingSpinner message="Loading your books..." />
      </div>
    );
  }

  return (
    <div className={styles?.dashboardContentWrapper || 'dashboard-content-wrapper'}>
      {/* Streak Widget */}
      <StreakWidget />

      {/* Search and Filter */}
      <SearchFilterSection
        searchQuery={searchQuery}
        filterTab={filterTab}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />

      {/* Books Grid */}
      <div className={styles?.booksGrid || 'books-grid'}>
        {(filteredBooks || []).map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Empty State */}
      {(!filteredBooks || filteredBooks.length === 0) && (
        <div className={styles?.noResults || 'no-results'}>
          <i className="bi bi-search"></i>
          <p>
            <Translate contentKey="langleague.student.dashboard.noBooks">No books found matching your search.</Translate>
          </p>
        </div>
      )}

      {/* Load More */}
      {filteredBooks && filteredBooks.length > 0 && (
        <div className={styles?.loadMoreSection || 'load-more-section'}>
          <button className={styles?.loadMoreBtn || 'load-more-btn'} aria-label="Load more books">
            <Translate contentKey="langleague.student.dashboard.loadMore">Load more books</Translate> <i className="bi bi-arrow-down"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
