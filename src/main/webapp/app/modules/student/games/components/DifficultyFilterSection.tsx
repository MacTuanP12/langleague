import React, { memo } from 'react';
import { DifficultyFilter, DIFFICULTY_FILTERS } from '../constants/game-hub.constants';
import { Translate, translate } from 'react-jhipster';
import { Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface DifficultyFilterSectionProps {
  selectedDifficulty: DifficultyFilter;
  onDifficultyChange: (difficulty: DifficultyFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/**
 * DifficultyFilterSection component - Extracted difficulty filter UI
 * Memoized to prevent unnecessary re-renders
 */
export const DifficultyFilterSection: React.FC<DifficultyFilterSectionProps> = memo(
  ({ selectedDifficulty, onDifficultyChange, searchQuery, onSearchChange }) => {
    return (
      <div className="filter-section d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          <div className="filter-label mb-0">
            <i className="bi bi-funnel" aria-hidden="true"></i>{' '}
            <Translate contentKey="langleague.student.games.filterByDifficulty">Filter by difficulty:</Translate>
          </div>
          <div className="difficulty-filters" role="group" aria-label="Difficulty filters">
            {DIFFICULTY_FILTERS.map(filter => (
              <button
                key={filter.key}
                className={`filter-btn ${filter.key === 'all' ? '' : filter.key} ${selectedDifficulty === filter.key ? 'active' : ''}`}
                onClick={() => onDifficultyChange(filter.key)}
                aria-pressed={selectedDifficulty === filter.key}
              >
                {filter.icon && <i className={filter.icon} aria-hidden="true"></i>}{' '}
                <Translate contentKey={filter.labelKey}>{filter.label}</Translate>
              </button>
            ))}
          </div>
        </div>

        <div className="search-box" style={{ minWidth: '250px' }}>
          <FontAwesomeIcon icon="search" className="search-icon" />
          <Input
            type="text"
            placeholder={translate('langleague.student.dashboard.search.placeholder')}
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Search games"
          />
        </div>
      </div>
    );
  },
);

DifficultyFilterSection.displayName = 'DifficultyFilterSection';
