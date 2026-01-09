import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { toast } from 'react-toastify';
import './student-profile.scss';
import { SidebarToggleButton } from 'app/shared/layout/sidebar/SidebarToggleButton';

export const StudentProfile = () => {
  const account = useAppSelector(state => state.authentication.account);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    bio: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (account) {
      setFormData({
        fullName: `${account.firstName || ''} ${account.lastName || ''}`.trim() || account.login,
        email: account.email || '',
        username: account.login || '',
        bio: '',
        imageUrl: account.imageUrl || 'https://via.placeholder.com/150',
      });
    }
  }, [account]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would dispatch an action to save the profile
    toast.success('Profile updated successfully!');
  };

  const handlePhotoChange = () => {
    toast.info('Photo upload functionality coming soon!');
  };

  return (
    <div className="profile-page-wrapper">
      <div className="student-profile-container">
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
            <Link to="/student/dashboard" className="nav-item">
              <i className="bi bi-house-door"></i>
              {isSidebarOpen && <span>Home</span>}
            </Link>
            <Link to="/student/books" className="nav-item">
              <i className="bi bi-book"></i>
              {isSidebarOpen && <span>My Books</span>}
            </Link>
            <Link to="/student/flashcards" className="nav-item">
              <i className="bi bi-credit-card-2-front"></i>
              {isSidebarOpen && <span>FlashCard</span>}
            </Link>
            <Link to="/student/games" className="nav-item">
              <i className="bi bi-controller"></i>
              {isSidebarOpen && <span>Games</span>}
            </Link>
            <Link to="/student/profile" className="nav-item active">
              <i className="bi bi-person-circle"></i>
              {isSidebarOpen && <span>Profile</span>}
            </Link>
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
              {isSidebarOpen && <span>Log Out</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="profile-header">
            <div className="breadcrumb">
              Account / <span className="current">Profile</span>
            </div>
            <div className="header-actions">
              <button className="lang-toggle">EN/VN</button>
              <div className="user-avatar">
                <img src={formData.imageUrl} alt="User Profile" />
              </div>
            </div>
          </header>

          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-card-inner">
                {/* Avatar Section */}
                <div className="avatar-section">
                  <div className="avatar-container" onClick={handlePhotoChange}>
                    <img src={formData.imageUrl} alt="Large User Avatar" />
                    <div className="avatar-overlay">
                      <i className="bi bi-camera"></i>
                    </div>
                  </div>
                  <button className="change-photo-btn" onClick={handlePhotoChange}>
                    <i className="bi bi-upload"></i>
                    Change Photo
                  </button>
                </div>

                {/* Profile Form */}
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <div className="input-wrapper">
                      <i className="bi bi-person input-icon"></i>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Alex Johnson"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper readonly">
                      <i className="bi bi-envelope input-icon"></i>
                      <input type="email" id="email" name="email" value={formData.email} readOnly />
                      <i className="bi bi-lock lock-icon" title="Email cannot be changed directly"></i>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-wrapper">
                      <i className="bi bi-at input-icon"></i>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="e.g. alexj2024"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio / About Me</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us a little about yourself..."
                      rows={3}
                    />
                  </div>

                  <button type="submit" className="save-btn">
                    <i className="bi bi-check-circle"></i>
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;
