import React from 'react';
import { IProgress } from 'app/shared/model/progress.model';
import './UnitProgressIndicator.scss';

interface Props {
  progress?: IProgress;
  showDetails?: boolean;
  compact?: boolean;
}

export const UnitProgressIndicator: React.FC<Props> = ({ progress, showDetails = false, compact = false }) => {
  if (!progress) {
    return (
      <div className={`progress-indicator not-started ${compact ? 'compact' : ''}`}>
        <span className="status-icon">○</span>
        {!compact && <span className="status-text">Not Started</span>}
      </div>
    );
  }

  if (progress.isCompleted) {
    return (
      <div className={`progress-indicator completed ${compact ? 'compact' : ''}`}>
        <span className="status-icon">✓</span>
        {!compact && <span className="status-text">Completed</span>}
        {showDetails && progress.updatedAt && (
          <small className="updated-time">Last updated: {new Date(progress.updatedAt).toLocaleDateString()}</small>
        )}
      </div>
    );
  }

  return (
    <div className={`progress-indicator in-progress ${compact ? 'compact' : ''}`}>
      <span className="status-icon">◐</span>
      {!compact && <span className="status-text">In Progress</span>}
      {showDetails && progress.updatedAt && (
        <small className="updated-time">Updated: {new Date(progress.updatedAt).toLocaleDateString()}</small>
      )}
    </div>
  );
};

export default UnitProgressIndicator;
