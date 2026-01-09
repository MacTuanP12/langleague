import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IUser } from 'app/shared/model/user.model';
import './user-management-edit.scss';

export const UserManagementEdit = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    status: 'active',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useParams<{ login: string }>();

  useEffect(() => {
    if (login) {
      loadUser();
    }
  }, [login]);

  const loadUser = async () => {
    try {
      const response = await axios.get(`/api/admin/users/${login}`);
      const userData = response.data;
      setUser(userData);
      setFormData({
        fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        email: userData.email || '',
        role: userData.authorities?.[0] || '',
        status: userData.activated ? 'active' : 'inactive',
        bio: userData.bio || '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading user:', error);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const updatedUser = {
        ...user,
        firstName,
        lastName,
        email: formData.email,
        authorities: [formData.role],
        activated: formData.status === 'active',
        bio: formData.bio,
      };

      await axios.put(`/api/admin/users`, updatedUser);
      navigate('/admin/user-management');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) {
    return (
      <div className="user-management-edit">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-management-edit">
        <div className="error">User not found</div>
      </div>
    );
  }

  return (
    <div className="user-management-edit">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/admin/user-management">User Management</Link>
          <span className="separator">›</span>
          <Link to={`/admin/user-management/${login}`}>{user.login}</Link>
          <span className="separator">›</span>
          <span className="current">Edit Details</span>
        </div>
        <h1>Edit User Details</h1>
        <p>Update personal information, role settings, and account status.</p>
      </div>

      <div className="form-container">
        <div className="user-profile-section">
          <div className="avatar-container">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt={user.login} className="user-avatar-image" />
            ) : (
              <div className="avatar-placeholder">{formData.fullName?.charAt(0) || user.login?.charAt(0) || '?'}</div>
            )}
          </div>
          <div className="user-info">
            <h3>{formData.fullName || user.login}</h3>
            <p className="user-meta">
              User ID: {user.id} • Joined{' '}
              {user.createdDate ? new Date(user.createdDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
            </p>
            <p className="info-note">
              <i className="fa fa-info-circle"></i> Avatar is managed by user through their profile settings, not by admin
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" />
            </div>

            <div className="form-group">
              <label>
                Email Address <span className="read-only-label">(Read-only)</span>
              </label>
              <div className="input-with-icon">
                <input type="email" name="email" value={formData.email} onChange={handleChange} readOnly disabled />
                <i className="fa fa-lock"></i>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="ROLE_STUDENT">Student</option>
                <option value="ROLE_TEACHER">Teacher</option>
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_LIBRARIAN">Librarian</option>
              </select>
            </div>

            <div className="form-group">
              <label>Account Status</label>
              <div className="status-display">
                <span className={`status-badge ${formData.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                  <span className="status-dot"></span>
                  {formData.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Bio / About Me</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Enter a brief description..." rows={5} />
            <div className="character-count">{formData.bio.length}/500 characters</div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/admin/user-management')}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <i className="fa fa-save"></i>
              Save Changes
            </button>
          </div>
        </form>

        <div className="info-box">
          <i className="fa fa-info-circle"></i>
          <div>
            <strong>Editing User Permissions</strong>
            <p>
              Changing a user&apos;s role to <strong>Administrator</strong> will grant them full access to the system settings and user
              management panels. Proceed with caution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementEdit;
