import React from 'react';
import './StatCard.scss';

export interface StatCardProps {
  /** Icon class (e.g., 'bi bi-book') or React node */
  icon: string | React.ReactNode;
  /** Label text */
  label: string;
  /** Value to display */
  value: string | number;
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  /** Additional CSS class */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Reusable StatCard component
 * Replaces duplicate stat card implementations across admin/teacher/student modules
 *
 * @example
 * <StatCard icon="bi bi-book" label="My Courses" value={12} />
 * <StatCard icon="bi bi-people" label="Students" value={150} variant="success" />
 */
export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, variant = 'default', className = '', onClick }) => {
  const isClickable = !!onClick;

  return (
    <div
      className={`stat-card stat-card--${variant} ${isClickable ? 'stat-card--clickable' : ''} ${className}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <div className="stat-card__icon">{typeof icon === 'string' ? <i className={icon} aria-hidden="true"></i> : icon}</div>
      <div className="stat-card__content">
        <h3 className="stat-card__label">{label}</h3>
        <p className="stat-card__value">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
