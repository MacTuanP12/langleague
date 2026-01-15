import React, { ReactNode } from 'react';

interface ContentSidebarProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable sidebar component for content navigation
 * Can be used for book units, chapters, or any hierarchical content
 */
export const ContentSidebar: React.FC<ContentSidebarProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`content-sidebar ${className}`}>
      {title && (
        <div className="sidebar-header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="sidebar-content">{children}</div>
    </div>
  );
};
