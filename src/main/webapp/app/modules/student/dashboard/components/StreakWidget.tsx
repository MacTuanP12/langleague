import React from 'react';
import { useAppSelector } from 'app/config/store';
import { FaFire } from 'react-icons/fa';
import { Translate } from 'react-jhipster';
import styles from '../student-dashboard.module.scss';

export const StreakWidget = () => {
  const userProfile = useAppSelector(state => state.userProfile.userProfile);
  const streakCount = userProfile?.streakCount || 0;

  // Milestones logic
  const milestones = [7, 15, 30, 50, 100];

  let nextMilestone = milestones.find(m => m > streakCount);
  let isLegendary = false;

  // Edge Case 1: High Streaks (> 100)
  if (!nextMilestone) {
    if (streakCount >= 100) {
      // Dynamic milestone: next multiple of 50
      nextMilestone = Math.ceil((streakCount + 1) / 50) * 50;
      // Optional: Mark as legendary if needed for UI, but we use dynamic milestone here
      isLegendary = true;
    } else {
      // Fallback for safety, though logic above covers it
      nextMilestone = 100;
    }
  }

  // Edge Case 2: Zero/Null State
  // progress calculation: avoid NaN if nextMilestone is somehow 0 (unlikely)
  // If streakCount is 0, progress is 0.
  const progress = nextMilestone > 0 ? Math.min(100, (streakCount / nextMilestone) * 100) : 0;

  return (
    <div className={styles?.streakWidget || 'streak-widget'}>
      <div className={styles?.streakIconWrapper || 'streak-icon-wrapper'}>
        <FaFire className={`${styles?.streakIcon || 'streak-icon'} ${streakCount > 0 ? styles?.active || 'active' : ''}`} />
      </div>
      <div className={styles?.streakContent || 'streak-content'}>
        <div className={styles?.streakHeader || 'streak-header'}>
          <span className={styles?.streakCount || 'streak-count'}>{streakCount}</span>
          <span className={styles?.streakLabel || 'streak-label'}>
            <Translate contentKey="langleague.student.dashboard.streak.label">Day Streak</Translate>
          </span>
        </div>
        <p className={styles?.streakMessage || 'streak-message'}>
          {streakCount > 0 ? (
            <Translate contentKey="langleague.student.dashboard.streak.active" interpolate={{ count: streakCount }}>
              You are on fire! {streakCount} day streak!
            </Translate>
          ) : (
            <Translate contentKey="langleague.student.dashboard.streak.start">Start your streak today!</Translate>
          )}
        </p>
        <div className={styles?.streakProgress || 'streak-progress'}>
          <div className={styles?.progressBar || 'progress-bar'}>
            <div
              className={styles?.progressFill || 'progress-fill'}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className={styles?.milestoneText || 'milestone-text'}>
            <Translate contentKey="langleague.student.dashboard.streak.nextMilestone" interpolate={{ count: nextMilestone }}>
              {`Next milestone: ${nextMilestone} days`}
            </Translate>
          </span>
        </div>
      </div>
    </div>
  );
};
