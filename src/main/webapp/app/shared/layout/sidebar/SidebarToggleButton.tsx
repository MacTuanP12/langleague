import React from 'react';
import { Translate } from 'react-jhipster';
import './sidebar-toggle-button.scss';

interface SidebarToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({ isOpen, onToggle, className = '' }) => {
  return (
    <button
      className={`sidebar-toggle-btn ${isOpen ? 'open' : 'collapsed'} ${className}`}
      onClick={onToggle}
      aria-label={isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
    >
      <i className="bi bi-arrow-bar-left toggle-icon"></i>
      {isOpen && (
        <span className="toggle-text">
          <Translate contentKey="global.sidebar.hide">HIDE</Translate>
        </span>
      )}
    </button>
  );
};
