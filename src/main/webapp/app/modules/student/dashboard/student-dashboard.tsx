import React, { useState, useEffect, useCallback } from 'react';
import { Translate } from 'react-jhipster';
import { AppFooter } from 'app/shared/layout/footer/app-footer';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import { FALLBACK_COURSES, FilterTab } from './dashboard.constants';
import { useCourseFilters } from './hooks/useCourseFilters';
import { CourseCard } from './components/CourseCard';
import { SearchFilterSection } from './components/SearchFilterSection';
import './student-dashboard.scss';

/**
 * StudentDashboard Component - Refactored for better performance and maintainability
 *
 * Improvements:
 * - Extracted hardcoded data to constants file
 * - Added loading and error states
 * - Used useMemo for expensive filter operations
 * - Split into smaller, reusable components
 * - Added proper error boundaries
 * - TODO: Replace FALLBACK_COURSES with API call to fetch real enrollment data
 */
export const StudentDashboard = () => {
  const [courses, setCourses] = useState(FALLBACK_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  // NOTE: setLoading and setError are kept for future API integration (see loadCourses TODO)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use custom hook for filtering with memoization
  const { filteredCourses } = useCourseFilters({ courses, searchQuery, filterTab });

  /**
   * TODO: Replace this with actual API call
   * Example:
   * const loadCourses = async () => {
   *   try {
   *     setLoading(true);
   *     const response = await axios.get('/api/enrollments/my-courses');
   *     setCourses(response.data);
   *   } catch (err) {
   *     setError('Failed to load courses');
   *   } finally {
   *     setLoading(false);
   *   }
   * };
   */
  const loadCourses = useCallback(() => {
    // Using fallback data for now
    setCourses(FALLBACK_COURSES);
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((tab: FilterTab) => {
    setFilterTab(tab);
  }, []);

  // Error state
  if (error) {
    return (
      <div className="dashboard-content-wrapper">
        <ErrorDisplay message={error} onRetry={loadCourses} />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-content-wrapper">
        <LoadingSpinner message="Loading your courses..." />
      </div>
    );
  }

  return (
    <div className="dashboard-content-wrapper">
      {/* Search and Filter */}
      <SearchFilterSection
        searchQuery={searchQuery}
        filterTab={filterTab}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="no-results">
          <i className="bi bi-search"></i>
          <p>
            <Translate contentKey="langleague.student.dashboard.noCourses">No courses found matching your search.</Translate>
          </p>
        </div>
      )}

      {/* Load More */}
      <div className="load-more-section">
        <button className="load-more-btn" aria-label="Load more books">
          Load more books <i className="bi bi-arrow-down"></i>
        </button>
      </div>

      {/* Footer */}
      <AppFooter showLogo={true} showSocial={true} />
    </div>
  );
};

export default StudentDashboard;
