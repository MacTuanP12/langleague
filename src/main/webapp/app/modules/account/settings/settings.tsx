import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { saveAccountSettings } from './settings.reducer';
import { toast } from 'react-toastify';
import './settings.scss';
import { SidebarToggleButton } from 'app/shared/layout/sidebar/SidebarToggleButton';

export const SettingsNew = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (account) {
      setFullName(`${account.firstName || ''} ${account.lastName || ''}`.trim() || account.login);
      setEmail(account.email || '');
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = fullName.split(' ');
    const updatedAccount = {
      ...account,
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      email,
    };
    dispatch(saveAccountSettings(updatedAccount));
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="settings-page-wrapper">
      <div className="settings-container">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
          <div className="sidebar-header">
            <div className="logo-section">
              <div className="logo-icon">◆</div>
              {isSidebarOpen && <span className="logo-text">LangLeague</span>}
            </div>
            <SidebarToggleButton isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>

          <nav className="nav-menu">
            <Link to="/" className="nav-item">
              <i className="bi bi-house-door"></i>
              {isSidebarOpen && <span>Home</span>}
            </Link>
            <Link to="/student/flashcards" className="nav-item">
              <i className="bi bi-credit-card-2-front"></i>
              {isSidebarOpen && <span>FlashCard</span>}
            </Link>
            <Link to="/student/games" className="nav-item">
              <i className="bi bi-controller"></i>
              {isSidebarOpen && <span>Games</span>}
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`main-content ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
          {/* Header */}
          <header className="settings-header">
            <div className="header-left">
              <div className="breadcrumb">
                <Link to="/">Account</Link>
                <i className="bi bi-chevron-right"></i>
                <span>Profile</span>
              </div>
            </div>

            <div className="header-actions">
              <div className="language-selector">
                <button className="lang-btn active">EN</button>
                <button className="lang-btn">VN</button>
              </div>
              <div className="user-menu">
                <div className="user-avatar">
                  <div className="avatar-circle">{account?.login?.[0]?.toUpperCase() || 'U'}</div>
                </div>
              </div>
            </div>
          </header>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar-section">
                <div className="large-avatar">{account?.login?.[0]?.toUpperCase() || 'U'}</div>
                <button className="change-photo-btn">
                  <i className="bi bi-camera"></i> Change Photo
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <i className="bi bi-person"></i>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Alex Johnson" />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <i className="bi bi-envelope"></i>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex.johnson@university.edu" />
                </div>
              </div>

              <div className="form-group">
                <label>Bio / About Me</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Passionate computer science student with a love for algorithms and open-source software. Learning one flashcard at a time."
                  rows={4}
                />
              </div>

              <div className="form-actions">
                <Link to="/account/password" className="change-password-btn">
                  <i className="bi bi-key"></i> Change Password
                </Link>

                <button type="submit" className="save-btn">
                  <i className="bi bi-check-circle"></i> Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsNew;
