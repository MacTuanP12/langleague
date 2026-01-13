import React, { useState, useEffect } from 'react';
import { useAppSelector } from 'app/config/store';
import { toast } from 'react-toastify';
import { translate, Translate } from 'react-jhipster';
import { useUserProfile } from 'app/shared/reducers/hooks';

import './student-profile.scss';

export const StudentProfile = () => {
  const { userProfile, loading, editProfile, loadCurrentProfile } = useUserProfile();
  const account = useAppSelector(state => state.authentication.account);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    bio: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadCurrentProfile();
  }, [loadCurrentProfile]);

  useEffect(() => {
    if (account) {
      setFormData({
        fullName: `${account.firstName || ''} ${account.lastName || ''}`.trim() || account.login,
        email: account.email || '',
        username: account.login || '',
        bio: userProfile?.bio || '',
        imageUrl: account.imageUrl || 'https://via.placeholder.com/150',
      });
    }
  }, [account, userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    try {
      await editProfile({ ...userProfile, bio: formData.bio });
      toast.success(translate('langleague.student.profile.messages.success', 'Profile updated successfully!'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };

  const handlePhotoChange = () => {
    toast.info(translate('langleague.student.profile.messages.photoComingSoon', 'Photo upload functionality coming soon!'));
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-content">
        {/* Profile Card - Using Golden Standard Layout */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-section">
              {account?.imageUrl ? (
                <img src={account.imageUrl} alt="Avatar" className="large-avatar-image" />
              ) : (
                <div className="large-avatar">{account?.login?.[0]?.toUpperCase() || 'U'}</div>
              )}
              <button className="change-photo-btn" onClick={handlePhotoChange}>
                <i className="bi bi-camera"></i>
                <Translate contentKey="langleague.student.profile.actions.changePhoto">Change Photo</Translate>
              </button>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">
                <Translate contentKey="langleague.student.profile.personalInfo.fullName">Full Name</Translate>
              </label>
              <div className="input-wrapper">
                <i className="bi bi-person"></i>
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
              <div className="input-wrapper">
                <i className="bi bi-envelope"></i>
                <input type="email" id="email" name="email" value={formData.email} readOnly />
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
                rows={4}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                <i className="bi bi-check-circle"></i>
                <Translate contentKey="langleague.student.profile.actions.saveChanges">Save Changes</Translate>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
