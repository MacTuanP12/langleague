import React from 'react';
import SafeIcon from 'app/shared/components/SafeIcon';
import './StatCard.scss';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface StatCardProps {
  /** Icon class string (e.g., 'bi bi-book'), FontAwesome icon name (e.g., 'book'), FontAwesome IconProp object, or React element */
  icon: IconProp | React.ReactElement;
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, variant = 'default', className = '', onClick }) => {
  const isClickable = !!onClick;

  const renderIcon = () => {
    // If it's a React Element, render it directly
    if (React.isValidElement(icon)) {
      return icon;
    }

    // If it's a string that looks like a Bootstrap icon class
    if (typeof icon === 'string' && (icon.includes('bi-') || icon.includes(' '))) {
      return <i className={icon} aria-hidden="true"></i>;
    }

    // Otherwise, treat it as a FontAwesome IconProp (string name, array, or object definition)
    // SafeIcon handles the different IconProp types internally
    return <SafeIcon icon={icon as IconProp} />;
  };

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
      <div className="stat-card__icon">{renderIcon()}</div>
      <div className="stat-card__content">
        <h3 className="stat-card__label">{label}</h3>
        <p className="stat-card__value">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
