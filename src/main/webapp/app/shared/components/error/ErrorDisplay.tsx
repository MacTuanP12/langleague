import React from 'react';
import { Translate } from 'react-jhipster';
import './ErrorDisplay.scss';

export interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  isI18nKey?: boolean;
  iconClass?: string;
  showDetails?: boolean;
  errorDetails?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  onRetry,
  fullScreen = false,
  isI18nKey = false,
  iconClass = 'bi-exclamation-triangle',
  showDetails = false,
  errorDetails,
}) => {
  const containerClass = fullScreen ? 'error-display-fullscreen' : 'error-display-container';

  return (
    <div className={containerClass}>
      <div className="error-display-content">
        <i className={`bi ${iconClass} error-display-icon`}></i>
        <p className="error-display-message">
          {message ? (
            isI18nKey ? (
              <Translate contentKey={message}>{message}</Translate>
            ) : (
              message
            )
          ) : (
            <Translate contentKey="error.generic">An error occurred. Please try again.</Translate>
          )}
        </p>
        {showDetails && errorDetails && (
          <details className="error-display-details">
            <summary>
              <Translate contentKey="error.details">Error Details</Translate>
            </summary>
            <pre className="error-display-stack">{errorDetails}</pre>
          </details>
        )}
        {onRetry && (
          <button onClick={onRetry} className="error-display-retry-btn">
            <i className="bi bi-arrow-clockwise"></i>
            <Translate contentKey="error.retry">Try Again</Translate>
          </button>
        )}
      </div>
    </div>
  );
};

export const InlineError: React.FC<{ message: string; isI18nKey?: boolean }> = ({ message, isI18nKey = false }) => {
  return (
    <div className="error-display-inline">
      <i className="bi bi-exclamation-circle"></i>
      <span>{isI18nKey ? <Translate contentKey={message}>{message}</Translate> : message}</span>
    </div>
  );
};

export const ErrorAlert: React.FC<{
  message: string;
  isI18nKey?: boolean;
  onClose?: () => void;
  variant?: 'error' | 'warning' | 'info';
}> = ({ message, isI18nKey = false, onClose, variant = 'error' }) => {
  const variantIcons = {
    error: 'bi-x-circle',
    warning: 'bi-exclamation-triangle',
    info: 'bi-info-circle',
  };

  return (
    <div className={`error-alert error-alert-${variant}`}>
      <i className={`bi ${variantIcons[variant]}`}></i>
      <span className="error-alert-message">{isI18nKey ? <Translate contentKey={message}>{message}</Translate> : message}</span>
      {onClose && (
        <button onClick={onClose} className="error-alert-close" aria-label="Close">
          <i className="bi bi-x"></i>
        </button>
      )}
    </div>
  );
};
