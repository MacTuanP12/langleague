import React from 'react';
import { translate } from 'react-jhipster';
import { Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FilterTab, FILTER_TABS } from '../dashboard.constants';
import '../../student.scss';

interface SearchFilterSectionProps {
  searchQuery: string;
  filterTab: FilterTab;
  onSearchChange: (query: string) => void;
  onFilterChange: (tab: FilterTab) => void;
}

/**
 * SearchFilterSection component - Search and filter UI with global styling
 */
export const SearchFilterSection: React.FC<SearchFilterSectionProps> = ({ searchQuery, filterTab, onSearchChange, onFilterChange }) => {
  return (
    <div className="search-filter-section">
      <div className="search-box">
        <FontAwesomeIcon icon="search" className="search-icon" />
        <Input
          type="text"
          placeholder={translate('langleague.student.dashboard.search.placeholder')}
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          aria-label="Search books"
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
