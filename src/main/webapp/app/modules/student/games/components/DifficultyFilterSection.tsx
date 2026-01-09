import React from 'react';
import { DifficultyFilter, DIFFICULTY_FILTERS } from '../game-hub.constants';

interface DifficultyFilterSectionProps {
  selectedDifficulty: DifficultyFilter;
  onDifficultyChange: (difficulty: DifficultyFilter) => void;
}

/**
 * DifficultyFilterSection component - Extracted difficulty filter UI
 */
export const DifficultyFilterSection: React.FC<DifficultyFilterSectionProps> = ({ selectedDifficulty, onDifficultyChange }) => {
  return (
    <div className="filter-section">
      <div className="filter-label">
        <i className="bi bi-funnel" aria-hidden="true"></i> Filter by difficulty:
      </div>
      <div className="difficulty-filters" role="group" aria-label="Difficulty filters">
        {DIFFICULTY_FILTERS.map(filter => (
          <button
            key={filter.key}
            className={`filter-btn ${filter.key === 'all' ? '' : filter.key} ${selectedDifficulty === filter.key ? 'active' : ''}`}
            onClick={() => onDifficultyChange(filter.key)}
            aria-pressed={selectedDifficulty === filter.key}
          >
            {filter.icon && <i className={filter.icon} aria-hidden="true"></i>} {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};


