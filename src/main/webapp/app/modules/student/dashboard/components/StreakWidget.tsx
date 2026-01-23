import React from 'react';
import { useAppSelector } from 'app/config/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import '../../student.scss';

export const StreakWidget = () => {
  const userProfile = useAppSelector(state => state.userProfile.userProfile);
  const account = useAppSelector(state => state.authentication.account);
  const streakCount = userProfile?.streakCount || 0;

  // Only show streak widget for students
  const isStudent = account?.authorities?.includes('ROLE_STUDENT');
  const isAdminOrTeacher = account?.authorities?.some(auth => auth === 'ROLE_ADMIN' || auth === 'ROLE_TEACHER');

  // Don't render streak widget for admin or teacher
  if (!isStudent || isAdminOrTeacher) {
    return null;
  }

  // Milestones logic
  const milestones = [7, 15, 30, 50, 100];

  let nextMilestone = milestones.find(m => m > streakCount);

  // Edge Case 1: High Streaks (> 100)
  if (!nextMilestone) {
    if (streakCount >= 100) {
      // Dynamic milestone: next multiple of 50
      nextMilestone = Math.ceil((streakCount + 1) / 50) * 50;
    } else {
      nextMilestone = 100;
    }
  }

  // Calculate progress
  const progress = nextMilestone > 0 ? Math.min(100, (streakCount / nextMilestone) * 100) : 0;

  return (
    <div className="streak-widget">
      <div className="streak-icon">
        <FontAwesomeIcon icon="fire" className={streakCount > 0 ? 'pulse-animation' : ''} />
      </div>
      <div className="streak-content">
        <div className="d-flex align-items-baseline gap-2">
          <span className="streak-number">{streakCount}</span>
          <span className="streak-label">
            <Translate contentKey="langleague.student.dashboard.streak.label">Day Streak</Translate>
          </span>
        </div>
        <p className="mb-2">
          {streakCount > 0 ? (
            <span>{translate('langleague.student.dashboard.streak.active', { count: streakCount })}</span>
          ) : (
            <Translate contentKey="langleague.student.dashboard.streak.start">Start your learning streak today!</Translate>
          )}
        </p>

        {/* Progress to next milestone */}
        {nextMilestone && (
          <div className="mt-3">
            <div className="d-flex justify-content-between mb-1">
              <small>
                <Translate contentKey="langleague.student.dashboard.streak.nextMilestone" interpolate={{ count: nextMilestone }}>
                  Next milestone: {nextMilestone.toString()} days
                </Translate>
              </small>
              <small className="fw-bold">{nextMilestone} days</small>
            </div>
            <div className="student-progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
