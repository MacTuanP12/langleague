import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Translate } from 'react-jhipster';
import { Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingSpinner } from 'app/shared/components';
import { BookCard } from 'app/shared/components/cards/BookCard';
import { IProgress } from 'app/shared/model/progress.model';
import { FilterTab } from './dashboard.constants';
import { useBookFilters } from './hooks/useBookFilters';
import { SearchFilterSection } from './components/SearchFilterSection';
import { StreakWidget } from './components/StreakWidget';
import { useBooks, useEnrollments, useProgress, useUserProfile } from 'app/shared/reducers/hooks';
// Removed direct import of student.scss as it should be loaded globally or via layout

/**
 * StudentDashboard Component - Main learning dashboard with Redux integration
 *
 * Features:
 * - Fetch ALL books (public)
 * - Fetch user enrollments to check status
 * - Track learning progress
 * - Filter and search books
 * - Display user statistics
 * - Gamification elements (streak, progress)
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
  const { books: allBooks, loading: booksLoading, loadBooks } = useBooks();
  const { enrollments, loading: enrollmentsLoading, loadMyEnrollments } = useEnrollments();
  const { progresses, loadMyProgresses } = useProgress();
  const { loadCurrentProfile } = useUserProfile();

  const loading = booksLoading || enrollmentsLoading;

  // Transform all books to display format with enrollment status
  const books = useMemo(() => {
    if (!allBooks || !Array.isArray(allBooks)) return [];

    return allBooks.map(book => {
      const enrollment = enrollments?.find(e => e.book?.id === book.id);
      const isEnrolled = !!enrollment;

      return {
        id: book.id || 0,
        title: book.title || 'Untitled Book',
        description: book.description || '',
        coverImageUrl: book.coverImageUrl,
        progress: calculateProgress(book.id, progresses || []),
        status: enrollment?.status || (isEnrolled ? 'ACTIVE' : 'NOT_ENROLLED'),
        enrolledAt: enrollment?.enrolledAt,
        isPublic: book.isPublic,
      };
    });
  }, [allBooks, enrollments, progresses]);

  // Use custom hook for filtering with memoization
  const { filteredBooks } = useBookFilters({ books, searchQuery, filterTab });

  // Fetch data on mount
  useEffect(() => {
    loadBooks();
    loadMyEnrollments();
    loadMyProgresses();
    loadCurrentProfile();
  }, [loadBooks, loadMyEnrollments, loadMyProgresses, loadCurrentProfile]);

  // Memoized event handlers
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((tab: FilterTab) => {
    setFilterTab(tab);
  }, []);

  // Loading state
  if (loading && (!books || books.length === 0)) {
    return (
      <Container fluid className="student-page-container">
        <LoadingSpinner message="langleague.student.dashboard.loading" isI18nKey />
      </Container>
    );
  }

  return (
    <Container fluid className="student-page-container">
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
      <div className="books-grid">
        {(filteredBooks || []).map(book => (
          <BookCard key={book.id} book={book} mode="student" progress={book.progress} status={book.status} />
        ))}
      </div>

      {/* Empty State */}
      {(!filteredBooks || filteredBooks.length === 0) && (
        <div className="empty-state-student">
          <div className="empty-icon">
            <FontAwesomeIcon icon="search" />
          </div>
          <h3>
            <Translate contentKey="langleague.student.dashboard.noBooks">No books found</Translate>
          </h3>
          <p>
            <Translate contentKey="langleague.student.dashboard.noBooksDescription">
              Try adjusting your search or filter to find what you're looking for.
            </Translate>
          </p>
        </div>
      )}
    </Container>
  );
};

export default StudentDashboard;
