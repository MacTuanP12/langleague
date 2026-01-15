import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { useAppDispatch } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { ModernHeader } from 'app/shared/layout/header/modern-header';
import { ModernFooter } from 'app/shared/layout/footer/modern-footer';
import { SidebarToggleButton } from 'app/shared/layout/sidebar/SidebarToggleButton';
import './student-layout.scss';

export const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="student-layout">
      {/* Sidebar */}
      <aside className={`student-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <i className="bi bi-book"></i>
            </div>
            {isSidebarOpen && <h1 className="logo-text">Langleague</h1>}
          </div>
        </div>

        <nav className="nav-menu">
          <Link to="/student/dashboard" className={`student-nav-item ${isActive('/student/dashboard') ? 'active' : ''}`}>
            <i className="bi bi-house-door"></i>
            {isSidebarOpen && (
              <span>
                <Translate contentKey="global.sidebar.student.home">Home</Translate>
              </span>
            )}
          </Link>

          <Link to="/student/books" className={`student-nav-item ${isActive('/student/books') ? 'active' : ''}`}>
            <i className="bi bi-book"></i>
            {isSidebarOpen && (
              <span>
                <Translate contentKey="global.sidebar.student.myBooks">My Books</Translate>
              </span>
            )}
          </Link>

          <Link to="/student/flashcards" className={`student-nav-item ${isActive('/student/flashcards') ? 'active' : ''}`}>
            <i className="bi bi-credit-card-2-front"></i>
            {isSidebarOpen && (
              <span>
                <Translate contentKey="global.sidebar.student.flashCard">FlashCard</Translate>
              </span>
            )}
          </Link>

          <Link to="/student/games" className={`student-nav-item ${isActive('/student/games') ? 'active' : ''}`}>
            <i className="bi bi-controller"></i>
            {isSidebarOpen && (
              <span>
                <Translate contentKey="global.sidebar.student.games">Games</Translate>
              </span>
            )}
          </Link>

          <Link to="/student/profile" className={`student-nav-item ${isActive('/student/profile') ? 'active' : ''}`}>
            <i className="bi bi-person-circle"></i>
            {isSidebarOpen && (
              <span>
                <Translate contentKey="global.sidebar.student.profile">Profile</Translate>
              </span>
            )}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <SidebarToggleButton isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

          <button className={`logout-btn ${!isSidebarOpen ? 'collapsed' : ''}`} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            {isSidebarOpen && (
              <span>
                <Translate contentKey="global.sidebar.student.logout">Log Out</Translate>
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`student-main ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <ModernHeader />

        <div className="student-content">
          <Outlet />
        </div>

        <ModernFooter variant="compact" />
      </main>
    </div>
  );
};
