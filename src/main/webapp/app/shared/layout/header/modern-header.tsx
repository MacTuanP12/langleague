import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import './modern-header.scss';

interface ModernHeaderProps {
  breadcrumbs?: Array<{ label: string; path?: string }>;
  showNotifications?: boolean;
  showProfile?: boolean;
  className?: string;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  breadcrumbs = [],
  showNotifications = true,
  showProfile = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className={`modern-header ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb.path ? (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <i className="bi bi-chevron-right breadcrumb-separator"></i>}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Right Section */}
      <div className="header-actions">
        {/* Notifications */}
        {showNotifications && (
          <button className="action-btn notification-btn">
            <i className="bi bi-bell"></i>
            <span className="notification-badge"></span>
          </button>
        )}

        {/* Divider */}
        {showNotifications && showProfile && <div className="divider"></div>}

        {/* Profile */}
        {showProfile && (
          <div className="profile-section">
            <button className="profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="profile-info">
                <p className="profile-name">
                  {account?.firstName || 'User'} {account?.lastName || ''}
                </p>
                <p className="profile-role">{account?.authorities?.[0] || 'User'}</p>
              </div>
              <div
                className="profile-avatar"
                style={{
                  backgroundImage: account?.imageUrl ? `url(${account.imageUrl})` : 'none',
                  backgroundColor: !account?.imageUrl ? 'var(--primary-color, #1152d4)' : 'transparent',
                }}
              >
                {!account?.imageUrl && (
                  <span className="avatar-initials">
                    {account?.firstName?.charAt(0) || 'U'}
                    {account?.lastName?.charAt(0) || ''}
                  </span>
                )}
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="profile-menu">
                <Link to="/account/settings" className="menu-item" onClick={() => setShowProfileMenu(false)}>
                  <i className="bi bi-gear"></i>
                  <span>
                    <Translate contentKey="global.menu.account.settings">Settings</Translate>
                  </span>
                </Link>
                <Link to="/account/password" className="menu-item" onClick={() => setShowProfileMenu(false)}>
                  <i className="bi bi-shield-lock"></i>
                  <span>
                    <Translate contentKey="global.menu.account.password">Change Password</Translate>
                  </span>
                </Link>
                <div className="menu-divider"></div>
                <button className="menu-item logout-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                  <span>
                    <Translate contentKey="global.menu.account.logout">Log Out</Translate>
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
