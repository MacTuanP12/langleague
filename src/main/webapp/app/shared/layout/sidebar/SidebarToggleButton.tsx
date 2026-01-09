import React from 'react';
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
      title={isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
    >
      <i className="bi bi-arrow-bar-left toggle-icon"></i>
      {isOpen && <span className="toggle-text">HIDE</span>}
    </button>
  );
};
