import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { ModernHeader } from 'app/shared/layout/header/modern-header';
import { ModernFooter } from 'app/shared/layout/footer/modern-footer';
import { SidebarToggleButton } from 'app/shared/layout/sidebar/SidebarToggleButton';
import './admin-layout.scss';

export const AdminLayout = () => {
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

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs: Array<{ label: string; path?: string }> = [{ label: 'Dashboard', path: '/admin/dashboard' }];

    if (path.includes('/user-management')) {
      breadcrumbs.push({ label: 'User Management' });
    } else if (path.includes('/books')) {
      breadcrumbs.push({ label: 'Books' });
    } else if (path.includes('/settings')) {
      breadcrumbs.push({ label: 'Settings' });
    }

    return breadcrumbs;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <i className="bi bi-book"></i>
            </div>
            {isSidebarOpen && <h1 className="logo-text">Langleague</h1>}
          </div>
        </div>

        <nav className="nav-menu">
          <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
            <i className="bi bi-speedometer2"></i>
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link to="/admin/books" className={`nav-item ${isActive('/admin/books') ? 'active' : ''}`}>
            <i className="bi bi-book"></i>
            {isSidebarOpen && <span>Books</span>}
          </Link>

          <Link to="/admin/user-management" className={`nav-item ${isActive('/admin/user-management') ? 'active' : ''}`}>
            <i className="bi bi-people"></i>
            {isSidebarOpen && <span>Users</span>}
          </Link>

          <Link to="/admin/settings" className={`nav-item ${isActive('/admin/settings') ? 'active' : ''}`}>
            <i className="bi bi-gear"></i>
            {isSidebarOpen && <span>Settings</span>}
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
      <main className={`admin-main ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <ModernHeader breadcrumbs={getBreadcrumbs()} />

        <div className="admin-content">
          <Outlet />
        </div>

        <ModernFooter variant="compact" />
      </main>
    </div>
  );
};
