import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './teacher-layout.scss';

interface TeacherLayoutProps {
  children: React.ReactNode;
  title?: React.ReactNode; // Changed from string to React.ReactNode
  subtitle?: React.ReactNode; // Changed from string to React.ReactNode
  showBackButton?: boolean;
  backTo?: string;
  headerActions?: React.ReactNode;
}

export const TeacherLayout: React.FC<TeacherLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = true,
  backTo,
  headerActions,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="teacher-layout">
      <div className="teacher-container">
        {(title || showBackButton) && (
          <div className="teacher-header">
            {showBackButton && (
              <button onClick={handleBack} className="back-btn" type="button">
                <i className="bi bi-arrow-left"></i>
              </button>
            )}
            {title && (
              <div className="header-content">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
              </div>
            )}
            {headerActions && <div className="header-actions">{headerActions}</div>}
          </div>
        )}
        <div className="teacher-content">{children}</div>
      </div>
    </div>
  );
};

export default TeacherLayout;
