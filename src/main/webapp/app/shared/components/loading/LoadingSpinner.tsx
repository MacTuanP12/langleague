import React from 'react';
import { Translate } from 'react-jhipster';
import './LoadingSpinner.scss';

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  isI18nKey?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, size = 'medium', fullScreen = false, isI18nKey = false }) => {
  const containerClass = fullScreen ? 'loading-spinner-fullscreen' : 'loading-spinner-container';
  const spinnerClass = `loading-spinner loading-spinner-${size}`;

  return (
    <div className={containerClass}>
      <div className={spinnerClass} role="status" aria-label="Loading">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="loading-spinner-message">{isI18nKey ? <Translate contentKey={message}>{message}</Translate> : message}</p>}
    </div>
  );
};

export const InlineSpinner: React.FC<{ size?: 'small' | 'medium' }> = ({ size = 'small' }) => {
  return <div className={`loading-spinner loading-spinner-${size} loading-spinner-inline`} role="status" />;
};
