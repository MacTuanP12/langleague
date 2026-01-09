import { useMemo } from 'react';
import { EnrolledCourse, FilterTab } from '../dashboard.constants';

interface UseCourseFiltersProps {
  courses: EnrolledCourse[];
  searchQuery: string;
  filterTab: FilterTab;
}

/**
 * Custom hook to filter courses based on search query and filter tab
 * Optimized with useMemo to prevent unnecessary recalculations
 */
export const useCourseFilters = ({ courses, searchQuery, filterTab }: UseCourseFiltersProps) => {
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());

      if (filterTab === 'enrolled') {
        return matchesSearch && (course.status === 'ACTIVE' || course.status === 'COMPLETED');
      }

      if (filterTab === 'notEnroll') {
        return matchesSearch && course.status === 'ENROLLED';
      }

      return matchesSearch;
    });
  }, [courses, searchQuery, filterTab]);

  return { filteredCourses };
};

