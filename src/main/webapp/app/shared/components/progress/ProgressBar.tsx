import React from 'react';
import './ProgressBar.scss';

export interface ProgressBarProps {
  /** Progress value (0-100) */
  progress: number;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Height variant */
  height?: 'small' | 'medium' | 'large';
  /** Color variant */
  color?: 'blue' | 'gradient' | 'purple';
  /** Additional CSS class */
  className?: string;
  /** Enable animation */
  animated?: boolean;
  /** Accessible label */
  ariaLabel?: string;
}

/**
 * Reusable progress bar component
 * Extracted from student/dashboard, learning modules to eliminate duplication
 *
 * @example
 * <ProgressBar progress={75} color="gradient" />
 * <ProgressBar progress={50} showPercentage={true} height="large" />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = true,
  height = 'medium',
  color = 'gradient',
  className = '',
  animated = true,
  ariaLabel = 'Progress',
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`progress-bar-wrapper ${className}`}>
      <div
        className={`progress-bar-track progress-bar--${height}`}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`progress-bar-fill progress-bar-fill--${color} ${animated ? 'progress-bar-fill--animated' : ''}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && <span className="progress-bar-text">{clampedProgress}%</span>}
    </div>
  );
};

export default ProgressBar;
