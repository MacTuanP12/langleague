import React from 'react';
import { translate } from 'react-jhipster';
import { EnrolledCourse } from '../dashboard.constants';
import { ProgressBar } from 'app/shared/components/progress';
import './CourseCard.scss';

interface CourseCardProps {
  course: EnrolledCourse;
}

/**
 * CourseCard component - Extracted from StudentDashboard for better modularity
 */
export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getButtonText = () => {
    switch (course.status) {
      case 'COMPLETED':
        return translate('langleague.student.dashboard.course.continue');
      case 'ENROLLED':
        return translate('langleague.student.dashboard.course.start') + ' →';
      default:
        return translate('langleague.student.dashboard.course.continue') + ' →';
    }
  };

  return (
    <div className="course-card">
      {course.status === 'COMPLETED' && <div className="badge-completed">✓ COMPLETED</div>}
      {course.status === 'ENROLLED' && <div className="badge-enrolled">⊕ ENROLLED</div>}

      <div className="course-cover" style={{ backgroundColor: course.coverColor }}>
        <div className="course-placeholder">{course.title}</div>
      </div>

      <div className="course-info">
        <h3>{course.title}</h3>
        <p>{course.description}</p>

        {course.status !== 'ENROLLED' && (
          <div className="progress-section">
            <ProgressBar progress={course.progress} height="small" color="gradient" />
          </div>
        )}

        <button className="enroll-btn" aria-label={getButtonText()}>
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};


