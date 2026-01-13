import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { saveAccountSettings, uploadAvatar } from './settings.reducer';
import { getSession } from 'app/shared/reducers/authentication';
import { toast } from 'react-toastify';
import './settings.scss';
import { SidebarToggleButton } from 'app/shared/layout/sidebar/SidebarToggleButton';

/**
 * ⚠️ DEPRECATION NOTICE - GOLDEN STANDARD REFERENCE
 *
 * This component serves as the "Golden Standard" for card layout and styling.
 * Its styling has been extracted and applied to:
 * - StudentProfile (student-profile.tsx)
 * - Password (password.tsx)
 *
 * TODO: This component includes sidebar/header that should be handled globally.
 * Consider refactoring to remove nested layout components in future iterations.
 *
 * Keep this file as a reference for the card layout pattern.
 */

export const SettingsNew = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const avatarUploading = useAppSelector(state => state.settings.avatarUploading);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (account) {
      setFullName(`${account.firstName || ''} ${account.lastName || ''}`.trim() || account.login);
      setEmail(account.email || '');
      setAvatarPreview(account.imageUrl || null);
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
      imageUrl: avatarPreview || account.imageUrl,
    };
    dispatch(saveAccountSettings(updatedAccount));
    toast.success(translate('settings.messages.profileUpdateSuccess'));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(translate('settings.messages.invalidImageType'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(translate('settings.messages.imageTooLarge'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setAvatarPreview(imageUrl);

        // Upload immediately and refresh session
        dispatch(uploadAvatar(imageUrl))
          .then(() => {
            dispatch(getSession());
            toast.success(translate('settings.messages.avatarUploadSuccess'));
          })
          .catch(() => {
            toast.error(translate('settings.messages.avatarUploadError'));
            setAvatarPreview(account.imageUrl || null);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvatarDisplay = () => {
    if (avatarPreview) {
      return <img src={avatarPreview} alt="Avatar" className="large-avatar-image" />;
    }
    return <div className="large-avatar">{account?.login?.[0]?.toUpperCase() || 'U'}</div>;
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
              {isSidebarOpen && (
                <span>
                  <Translate contentKey="settings.sidebar.home">Home</Translate>
                </span>
              )}
            </Link>
            <Link to="/student/flashcards" className="nav-item">
              <i className="bi bi-credit-card-2-front"></i>
              {isSidebarOpen && (
                <span>
                  <Translate contentKey="settings.sidebar.flashcard">FlashCard</Translate>
                </span>
              )}
            </Link>
            <Link to="/student/games" className="nav-item">
              <i className="bi bi-controller"></i>
              {isSidebarOpen && (
                <span>
                  <Translate contentKey="settings.sidebar.games">Games</Translate>
                </span>
              )}
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`main-content ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
          {/* Header */}
          <header className="settings-header">
            <div className="header-left">
              <div className="breadcrumb">
                <Link to="/">
                  <Translate contentKey="settings.page.account">Account</Translate>
                </Link>
                <i className="bi bi-chevron-right"></i>
                <span>
                  <Translate contentKey="settings.page.profile">Profile</Translate>
                </span>
              </div>
            </div>

            <div className="header-actions">
              <div className="user-menu">
                <div className="user-avatar">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="avatar-circle-image" />
                  ) : (
                    <div className="avatar-circle">{account?.login?.[0]?.toUpperCase() || 'U'}</div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar-section">
                {getAvatarDisplay()}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <button type="button" className="change-photo-btn" onClick={handleAvatarClick} disabled={avatarUploading}>
                  <i className="bi bi-camera"></i>{' '}
                  {avatarUploading ? (
                    <Translate contentKey="settings.header.uploading">Uploading...</Translate>
                  ) : (
                    <Translate contentKey="settings.header.changePhoto">Change Photo</Translate>
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>
                  <Translate contentKey="settings.form.fullName">Full Name</Translate>
                </label>
                <div className="input-wrapper">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder={translate('settings.form.fullNamePlaceholder')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Translate contentKey="settings.form.emailAddress">Email Address</Translate>
                </label>
                <div className="input-wrapper">
                  <i className="bi bi-envelope"></i>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={translate('settings.form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Translate contentKey="settings.form.bio">Bio / About Me</Translate>
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder={translate('settings.form.bioPlaceholder')}
                  rows={4}
                />
              </div>

              <div className="form-actions">
                <Link to="/account/password" className="change-password-btn">
                  <i className="bi bi-key"></i> <Translate contentKey="settings.form.changePassword">Change Password</Translate>
                </Link>

                <button type="submit" className="save-btn">
                  <i className="bi bi-check-circle"></i> <Translate contentKey="settings.form.saveChanges">Save Changes</Translate>
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
