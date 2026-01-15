import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { ModernHeader } from 'app/shared/layout/header/modern-header';
import { ModernFooter } from 'app/shared/layout/footer/modern-footer';
import './teacher-layout.scss';

interface TeacherLayoutProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
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

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className="teacher-layout-wrapper">
      <ModernHeader />

      <div className="teacher-layout-container">
        <aside className="teacher-sidebar">
          <div className="sidebar-header">
            <h3>
              <Translate contentKey="langleague.teacher.sidebar.title">Teacher CMS</Translate>
            </h3>
          </div>
          <nav className="sidebar-nav">
            <Link
              to="/teacher/dashboard"
              className={`nav-item ${location.pathname === '/teacher/dashboard' || location.pathname === '/teacher' ? 'active' : ''}`}
            >
              <i className="bi bi-speedometer2"></i>
              <span>
                <Translate contentKey="global.menu.teacher.dashboard">Dashboard</Translate>
              </span>
            </Link>
            <Link to="/teacher/books" className={`nav-item ${isActive('/teacher/books')}`}>
              <i className="bi bi-book"></i>
              <span>
                <Translate contentKey="global.menu.teacher.bookManager">Book Manager</Translate>
              </span>
            </Link>
            <Link to="/teacher/students" className={`nav-item ${isActive('/teacher/students')}`}>
              <i className="bi bi-people"></i>
              <span>
                <Translate contentKey="global.menu.teacher.studentAnalytics">Student Analytics</Translate>
              </span>
            </Link>
          </nav>
        </aside>

        <main className="teacher-main-content">
          <div className="content-wrapper">
            {(title || showBackButton) && (
              <div className="page-header">
                <div className="header-left">
                  {showBackButton && (
                    <button onClick={handleBack} className="back-btn" type="button">
                      <i className="bi bi-arrow-left"></i>
                    </button>
                  )}
                  <div className="header-text">
                    {title && <h1>{title}</h1>}
                    {subtitle && <p>{subtitle}</p>}
                  </div>
                </div>
                {headerActions && <div className="header-actions">{headerActions}</div>}
              </div>
            )}
            <div className="page-content">{children}</div>
          </div>
        </main>
      </div>

      <ModernFooter variant="compact" />
    </div>
  );
};

export default TeacherLayout;
