import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { ModernHeader } from 'app/shared/layout/header/modern-header';
import { ModernFooter } from 'app/shared/layout/footer/modern-footer';
import { SidebarToggleButton } from 'app/shared/layout/sidebar/SidebarToggleButton';
import './teacher-parent-layout.scss';

export const TeacherParentLayout = () => {
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
    <div className="teacher-parent-layout">
      {/* Sidebar */}
      <aside className={`teacher-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <i className="bi bi-book"></i>
            </div>
            {isSidebarOpen && <h1 className="logo-text">Langleague</h1>}
          </div>
        </div>

        <nav className="nav-menu">
          <Link to="/teacher/dashboard" className={`nav-item ${isActive('/teacher/dashboard') ? 'active' : ''}`}>
            <i className="bi bi-speedometer2"></i>
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link to="/teacher/books" className={`nav-item ${isActive('/teacher/books') ? 'active' : ''}`}>
            <i className="bi bi-book"></i>
            {isSidebarOpen && <span>Books</span>}
          </Link>

          <Link to="/teacher/units" className={`nav-item ${isActive('/teacher/units') ? 'active' : ''}`}>
            <i className="bi bi-grid-3x3"></i>
            {isSidebarOpen && <span>Units</span>}
          </Link>

          <Link to="/teacher/students" className={`nav-item ${isActive('/teacher/students') ? 'active' : ''}`}>
            <i className="bi bi-people"></i>
            {isSidebarOpen && <span>Students</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <SidebarToggleButton isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

          <button className={`logout-btn ${!isSidebarOpen ? 'collapsed' : ''}`} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            {isSidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`teacher-main ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <ModernHeader />

        <div className="teacher-content">
          <Outlet />
        </div>

        <ModernFooter variant="compact" />
      </main>
    </div>
  );
};
