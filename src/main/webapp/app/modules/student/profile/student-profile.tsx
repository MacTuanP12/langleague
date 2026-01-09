import React, { useState, useEffect } from 'react';
import { useAppSelector } from 'app/config/store';
import { toast } from 'react-toastify';
import './student-profile.scss';
import {translate, Translate} from "react-jhipster";

export const StudentProfile = () => {
  const account = useAppSelector(state => state.authentication.account);

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
    <div className="student-profile-page">
      <div className="profile-header">
        <div className="breadcrumb">
          Account / <span className="current"><Translate contentKey="langleague.student.profile.title">Profile</Translate></span>
        </div>
      </div>

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
                <Translate contentKey="langleague.student.profile.actions.changePhoto">Change Photo</Translate>
              </button>
            </div>

            {/* Profile Form */}
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">
                  <Translate contentKey="langleague.student.profile.personalInfo.fullName">Full Name</Translate>
                </label>
                <div className="input-wrapper">
                  <i className="bi bi-person input-icon"></i>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={translate('langleague.student.profile.personalInfo.fullNamePlaceholder', 'e.g. Alex Johnson')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Translate contentKey="langleague.student.profile.personalInfo.email">Email Address</Translate>
                </label>
                <div className="input-wrapper readonly">
                  <i className="bi bi-envelope input-icon"></i>
                  <input type="email" id="email" name="email" value={formData.email} readOnly />
                  <i className="bi bi-lock lock-icon" title="Email cannot be changed directly"></i>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">
                  <Translate contentKey="langleague.student.profile.accountInfo.username">Username</Translate>
                </label>
                <div className="input-wrapper">
                  <i className="bi bi-at input-icon"></i>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={translate('langleague.student.profile.accountInfo.usernamePlaceholder', 'e.g. alexj2024')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">
                  <Translate contentKey="langleague.student.profile.personalInfo.bio">Bio / About Me</Translate>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder={translate('langleague.student.profile.personalInfo.bioPlaceholder', 'Tell us a little about yourself...')}
                  rows={3}
                />
              </div>

              <button type="submit" className="save-btn">
                <i className="bi bi-check-circle"></i>
                <Translate contentKey="langleague.student.profile.actions.saveChanges">Save Changes</Translate>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
