import React from 'react';
import { Link } from 'react-router-dom';
import { IUnit } from 'app/shared/model/unit.model';
import { UnitProgressIndicator } from 'app/shared/components/progress';

interface UnitListProps {
  units: IUnit[];
  selectedUnitId: number | null;
  expandedUnitId: number | null;
  onUnitClick: (unit: IUnit) => void;
  loading?: boolean;
  emptyMessage?: string;
}

/**
 * Reusable unit list component for displaying book units
 * Supports expansion, progress indicators, and section links
 */
export const UnitList: React.FC<UnitListProps> = ({
  units,
  selectedUnitId,
  expandedUnitId,
  onUnitClick,
  loading = false,
  emptyMessage = 'No units available yet',
}) => {
  if (loading) {
    return (
      <div className="units-list">
        <div className="loading-spinner">Loading units...</div>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="units-list">
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="units-list">
      {units.map(unit => (
        <div key={unit.id} className="unit-item">
          <div
            className={`unit-header ${selectedUnitId === unit.id ? 'active' : ''}`}
            onClick={() => onUnitClick(unit)}
            role="button"
            tabIndex={0}
            onKeyPress={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onUnitClick(unit);
              }
            }}
          >
            <span className="unit-icon">
              <i className="bi bi-play-fill"></i>
            </span>
            <span className="unit-title">{unit.title}</span>
            {unit.progresses && unit.progresses[0] && <UnitProgressIndicator progress={unit.progresses[0]} compact />}
            <span className={`expand-icon ${expandedUnitId === unit.id ? 'expanded' : ''}`}>
              <i className="bi bi-chevron-right"></i>
            </span>
          </div>

          {expandedUnitId === unit.id && (
            <div className="unit-sections">
              <Link to={`/student/learn/unit/${unit.id}/vocabulary`} className="section-link">
                <span className="section-icon">
                  <i className="bi bi-book"></i>
                </span>
                Vocabulary
              </Link>
              <Link to={`/student/learn/unit/${unit.id}/grammar`} className="section-link">
                <span className="section-icon">
                  <i className="bi bi-journal-text"></i>
                </span>
                Grammar
              </Link>
              <Link to={`/student/learn/unit/${unit.id}/exercise`} className="section-link">
                <span className="section-icon">
                  <i className="bi bi-pencil-square"></i>
                </span>
                Exercise
              </Link>
              <Link to={`/student/learn/unit/${unit.id}/flashcard`} className="section-link">
                <span className="section-icon">
                  <i className="bi bi-card-text"></i>
                </span>
                Flashcard
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
