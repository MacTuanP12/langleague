import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Translate, Storage } from 'react-jhipster';
import { Navbar, Nav, NavItem, NavLink, NavbarToggler, Collapse } from 'reactstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { setLocale } from 'app/shared/reducers/locale';
import { languages } from 'app/config/translation';
import { useTheme } from 'app/shared/context/ThemeContext';
import { ThemeMode } from 'app/shared/model/enumerations/enums.model';
import './modern-header.scss';

// ============================================
// TypeScript Interfaces
// ============================================
interface ModernHeaderProps {
  className?: string;
}

interface UserAccount {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  authorities?: string[];
}

// ============================================
// Navigation Items Component
// ============================================
const NavigationItems: React.FC<{
  isAuthenticated: boolean;
  account: UserAccount;
  isActive: (path: string) => boolean;
}> = ({ isAuthenticated, account, isActive }) => {
  const isAdmin = account?.authorities?.includes('ROLE_ADMIN');
  const isTeacher = account?.authorities?.includes('ROLE_TEACHER');
  const isStudent = account?.authorities?.includes('ROLE_STUDENT');

  return (
    <Nav className="main-nav" navbar>
      <NavItem>
        <NavLink tag={Link} to="/" className={isActive('/') ? 'active' : ''}>
          <i className="bi bi-house-door"></i>
          <span>
            <Translate contentKey="global.menu.home">Home</Translate>
          </span>
        </NavLink>
      </NavItem>

      {isAuthenticated && (
        <>
          {/* Student menu - only for students */}
          {isStudent && (
            <NavItem>
              <NavLink tag={Link} to="/student" className={isActive('/student') ? 'active' : ''}>
                <i className="bi bi-mortarboard"></i>
                <span>
                  <Translate contentKey="global.menu.student">Student</Translate>
                </span>
              </NavLink>
            </NavItem>
          )}

          {/* Teacher menu - only for teachers */}
          {isTeacher && (
            <NavItem>
              <NavLink tag={Link} to="/teacher" className={isActive('/teacher') ? 'active' : ''}>
                <i className="bi bi-person-badge"></i>
                <span>
                  <Translate contentKey="global.menu.teacher.main">Teacher</Translate>
                </span>
              </NavLink>
            </NavItem>
          )}

          {/* Admin menu - only for admins */}
          {isAdmin && (
            <NavItem>
              <NavLink tag={Link} to="/admin" className={isActive('/admin') ? 'active' : ''}>
                <i className="bi bi-gear"></i>
                <span>
                  <Translate contentKey="global.menu.admin.main">Administration</Translate>
                </span>
              </NavLink>
            </NavItem>
          )}
        </>
      )}
    </Nav>
  );
};

// ============================================
// Language Switcher - Globe Icon Component
// ============================================
const LanguageSwitcher: React.FC<{
  currentLocale: string;
  showLanguageMenu: boolean;
  setShowLanguageMenu: (show: boolean) => void;
  handleLocaleChange: (langKey: string) => void;
  languageRef: React.RefObject<HTMLDivElement>;
}> = ({ currentLocale, showLanguageMenu, setShowLanguageMenu, handleLocaleChange, languageRef }) => (
  <div className="language-switcher" ref={languageRef}>
    <button
      className="action-btn language-btn"
      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
      aria-label="Change language"
      aria-expanded={showLanguageMenu}
    >
      <i className="bi bi-globe"></i>
    </button>

    {showLanguageMenu && (
      <div className="dropdown-menu-custom language-menu">
        {Object.keys(languages).map(langKey => (
          <button
            key={langKey}
            className={`menu-item ${currentLocale === langKey ? 'active' : ''}`}
            onClick={() => handleLocaleChange(langKey)}
          >
            <span className="language-name">{languages[langKey].name}</span>
            {currentLocale === langKey && <i className="bi bi-check2 check-icon"></i>}
          </button>
        ))}
      </div>
    )}
  </div>
);

// ============================================
// Profile Menu Component
// ============================================
const ProfileMenu: React.FC<{
  account: UserAccount;
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  handleLogout: () => void;
  profileRef: React.RefObject<HTMLDivElement>;
  currentLocale: string;
  handleLocaleChange: (langKey: string) => void;
}> = ({ account, showProfileMenu, setShowProfileMenu, handleLogout, profileRef, currentLocale, handleLocaleChange }) => {
  const { theme, setTheme } = useTheme();

  const getInitials = () => {
    const first = account?.firstName?.charAt(0)?.toUpperCase() || 'U';
    const last = account?.lastName?.charAt(0)?.toUpperCase() || '';
    return first + last;
  };

  const getDisplayName = () => {
    if (account?.firstName && account?.lastName) {
      return `${account.firstName} ${account.lastName}`;
    }
    return account?.firstName || account?.lastName || 'User';
  };

  const getRole = () => {
    const role = account?.authorities?.[0]?.replace('ROLE_', '') || 'User';
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  const getThemeIcon = (themeMode: ThemeMode) => {
    switch (themeMode) {
      case ThemeMode.LIGHT:
        return 'bi-sun-fill';
      case ThemeMode.DARK:
        return 'bi-moon-fill';
      case ThemeMode.SYSTEM:
        return 'bi-circle-half';
      default:
        return 'bi-circle-half';
    }
  };

  const getThemeLabel = (themeMode: ThemeMode) => {
    switch (themeMode) {
      case ThemeMode.LIGHT:
        return 'Light';
      case ThemeMode.DARK:
        return 'Dark';
      case ThemeMode.SYSTEM:
        return 'System';
      default:
        return 'System';
    }
  };

  return (
    <div className="profile-section" ref={profileRef}>
      <button
        className="profile-btn"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        aria-label="User menu"
        aria-expanded={showProfileMenu}
      >
        <div className="profile-info">
          <p className="profile-name">{getDisplayName()}</p>
          <p className="profile-role">{getRole()}</p>
        </div>
        <div
          className="profile-avatar"
          style={{
            backgroundImage: account?.imageUrl ? `url(${account.imageUrl})` : 'none',
            backgroundColor: !account?.imageUrl ? 'var(--primary-color)' : 'transparent',
          }}
        >
          {!account?.imageUrl && <span className="avatar-initials">{getInitials()}</span>}
        </div>
      </button>

      {showProfileMenu && (
        <div className="dropdown-menu-custom profile-menu">
          {/* Theme Selection Section */}
          <div className="menu-section">
            <div className="menu-section-title">
              <i className="bi bi-palette"></i>
              <span>
                <Translate contentKey="global.menu.theme">Theme</Translate>
              </span>
            </div>
            <div className="theme-options-inline">
              <button
                className={`theme-option-btn ${theme === ThemeMode.LIGHT ? 'active' : ''}`}
                onClick={() => setTheme(ThemeMode.LIGHT)}
                aria-label="Switch to light mode"
                title="Light Mode"
              >
                <i className="bi bi-sun-fill"></i>
              </button>
              <button
                className={`theme-option-btn ${theme === ThemeMode.DARK ? 'active' : ''}`}
                onClick={() => setTheme(ThemeMode.DARK)}
                aria-label="Switch to dark mode"
                title="Dark Mode"
              >
                <i className="bi bi-moon-fill"></i>
              </button>
              <button
                className={`theme-option-btn ${theme === ThemeMode.SYSTEM ? 'active' : ''}`}
                onClick={() => setTheme(ThemeMode.SYSTEM)}
                aria-label="Use system theme"
                title="System Theme"
              >
                <i className="bi bi-circle-half"></i>
              </button>
            </div>
          </div>

          {/* Language Selection Section */}
          <div className="menu-section">
            <div className="menu-section-title">
              <i className="bi bi-translate"></i>
              <span>
                <Translate contentKey="global.menu.language">Language</Translate>
              </span>
            </div>
            <div className="language-options-inline">
              {Object.keys(languages).map(langKey => (
                <button
                  key={langKey}
                  className={`language-option-btn ${currentLocale === langKey ? 'active' : ''}`}
                  onClick={() => {
                    handleLocaleChange(langKey);
                    setShowProfileMenu(false);
                  }}
                  title={languages[langKey].name}
                >
                  {langKey.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-divider"></div>

          {/* Account Settings */}
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

          {/* Logout */}
          <button className="menu-item logout-item" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            <span>
              <Translate contentKey="global.menu.account.logout">Log Out</Translate>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// Main Header Component
// ============================================
export const ModernHeader: React.FC<ModernHeaderProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Redux State
  const account = useAppSelector(state => state.authentication.account);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  // UI State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for click outside detection
  const profileRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // ============================================
  // Handle Language Change with Persistence
  // ============================================
  const handleLocaleChange = (langKey: string) => {
    dispatch(setLocale(langKey));
    Storage.session.set('locale', langKey);
    Storage.local.set('locale', langKey);
    setShowLanguageMenu(false);
  };

  // ============================================
  // Handle Logout
  // ============================================
  const handleLogout = () => {
    dispatch(logout());
    setShowProfileMenu(false);
    navigate('/login');
  };

  // ============================================
  // Check if Link is Active
  // ============================================
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // ============================================
  // Close Dropdowns When Clicking Outside
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================
  // Close Mobile Menu on Route Change
  // ============================================
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowProfileMenu(false);
    setShowLanguageMenu(false);
  }, [location.pathname]);

  // ============================================
  // Render Header
  // ============================================
  return (
    <header className={`modern-header-wrapper ${className}`}>
      <Navbar className="modern-header" expand="lg">
        <div className="header-container">
          {/* Brand / Logo */}
          <Link to="/" className="navbar-brand">
            <i className="bi bi-translate brand-icon"></i>
            <span className="brand-text">LangLeague</span>
          </Link>

          {/* Mobile Hamburger */}
          <NavbarToggler onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-toggle" aria-label="Toggle navigation">
            <i className={`bi ${mobileMenuOpen ? 'bi-x' : 'bi-list'}`}></i>
          </NavbarToggler>

          {/* Navigation & Actions */}
          <Collapse isOpen={mobileMenuOpen} navbar>
            <NavigationItems isAuthenticated={isAuthenticated} account={account} isActive={isActive} />

            {/* Right Side Actions */}
            <div className="header-actions">
              <LanguageSwitcher
                currentLocale={currentLocale}
                showLanguageMenu={showLanguageMenu}
                setShowLanguageMenu={setShowLanguageMenu}
                handleLocaleChange={handleLocaleChange}
                languageRef={languageRef}
              />

              {/* User Profile or Login Button */}
              {isAuthenticated ? (
                <ProfileMenu
                  account={account}
                  showProfileMenu={showProfileMenu}
                  setShowProfileMenu={setShowProfileMenu}
                  handleLogout={handleLogout}
                  profileRef={profileRef}
                  currentLocale={currentLocale}
                  handleLocaleChange={handleLocaleChange}
                />
              ) : (
                <Link to="/login" className="login-btn">
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>
                    <Translate contentKey="global.menu.account.login">Sign In</Translate>
                  </span>
                </Link>
              )}
            </div>
          </Collapse>
        </div>
      </Navbar>
    </header>
  );
};
