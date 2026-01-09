import React from 'react';
import { translate } from 'react-jhipster';
import { FilterTab, FILTER_TABS } from '../dashboard.constants';

interface SearchFilterSectionProps {
  searchQuery: string;
  filterTab: FilterTab;
  onSearchChange: (query: string) => void;
  onFilterChange: (tab: FilterTab) => void;
}

/**
 * SearchFilterSection component - Extracted search and filter UI
 */
export const SearchFilterSection: React.FC<SearchFilterSectionProps> = ({
  searchQuery,
  filterTab,
  onSearchChange,
  onFilterChange,
}) => {
  return (
    <div className="search-filter-section">
      <div className="search-wrapper">
        <i className="bi bi-search" aria-hidden="true"></i>
        <input
          type="text"
          placeholder={translate('langleague.student.dashboard.search.placeholder')}
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          aria-label="Search courses"
        />
      </div>

      <div className="filter-tabs" role="tablist">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            className={`filter-tab ${filterTab === tab.key ? 'active' : ''}`}
            onClick={() => onFilterChange(tab.key)}
            role="tab"
            aria-selected={filterTab === tab.key}
            aria-label={`Filter by ${tab.label}`}
          >
            {translate(`langleague.student.dashboard.filter.${tab.key}`)}
          </button>
        ))}
      </div>
    </div>
  );
};


