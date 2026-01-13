import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { useUserManagement } from 'app/shared/reducers/user-management.hook';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import { IUser } from 'app/shared/model/user.model';
import './user-management-edit.scss';

export const UserManagementEdit = () => {
  const { getUserById, updateUser } = useUserManagement();
  const [user, setUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    status: 'active',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useParams<{ login: string }>();

  useEffect(() => {
    if (login) {
      loadUser();
    }
  }, [login]);

  const loadUser = async () => {
    try {
      const userResult = await getUserById(login);
      setUser(userResult);
      setFormData({
        fullName: `${userResult.firstName || ''} ${userResult.lastName || ''}`.trim(),
        email: userResult.email || '',
        role: userResult.authorities?.[0] || '',
        status: userResult.activated ? 'active' : 'inactive',
        bio: userResult.bio || '',
      });
      setLoading(false);
    } catch (loadErr) {
      console.error('Error loading user:', loadErr);
      toast.error(translate('langleague.admin.userManagement.messages.loadError'));
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

      await updateUser(updatedUser);
      toast.success(translate('langleague.admin.userManagement.messages.updateSuccess'));
      navigate('/admin/user-management');
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error(translate('langleague.admin.userManagement.messages.updateError'));
    }
  };

  if (loading) {
    return <LoadingSpinner message="userManagement.edit.loading" isI18nKey />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={loadUser} />;
  }

  if (!user) {
    return <ErrorDisplay message="userManagement.edit.notFound" isI18nKey iconClass="bi-person-x" />;
  }

  return (
    <div className="user-management-edit">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/admin/user-management">
            <Translate contentKey="userManagement.detail.breadcrumb">User Management</Translate>
          </Link>
          <span className="separator">›</span>
          <Link to={`/admin/user-management/${login}`}>{user.login}</Link>
          <span className="separator">›</span>
          <span className="current">
            <Translate contentKey="userManagement.edit.breadcrumb">Edit Details</Translate>
          </span>
        </div>
        <h1>
          <Translate contentKey="userManagement.edit.title">Edit User Details</Translate>
        </h1>
        <p>
          <Translate contentKey="userManagement.edit.subtitle">Update personal information, role settings, and account status.</Translate>
        </p>
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
              <Translate contentKey="userManagement.edit.userIdLabel">User ID</Translate>: {user.id} •{' '}
              <Translate contentKey="userManagement.edit.joinedLabel">Joined</Translate>{' '}
              {user.createdDate ? new Date(user.createdDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
            </p>
            <p className="info-note">
              <i className="fa fa-info-circle"></i>{' '}
              <Translate contentKey="userManagement.edit.avatarNote">
                Avatar is managed by user through their profile settings, not by admin
              </Translate>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>
                <Translate contentKey="userManagement.edit.fields.fullName">Full Name</Translate>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={translate('userManagement.edit.fields.fullNamePlaceholder')}
              />
            </div>

            <div className="form-group">
              <label>
                <Translate contentKey="userManagement.edit.fields.email">Email Address</Translate>{' '}
                <span className="read-only-label">
                  <Translate contentKey="userManagement.edit.fields.emailReadOnly">(Read-only)</Translate>
                </span>
              </label>
              <div className="input-with-icon">
                <input type="email" name="email" value={formData.email} onChange={handleChange} readOnly disabled />
                <i className="fa fa-lock"></i>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Translate contentKey="userManagement.edit.fields.role">Role</Translate>
              </label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="ROLE_STUDENT">{translate('userManagement.edit.roles.student')}</option>
                <option value="ROLE_TEACHER">{translate('userManagement.edit.roles.teacher')}</option>
                <option value="ROLE_ADMIN">{translate('userManagement.edit.roles.admin')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <Translate contentKey="userManagement.edit.fields.status">Account Status</Translate>
              </label>
              <div className="status-display">
                <span className={`status-badge ${formData.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                  <span className="status-dot"></span>
                  {formData.status === 'active'
                    ? translate('userManagement.edit.status.active')
                    : translate('userManagement.edit.status.inactive')}
                </span>
              </div>
            </div>
          </div>

          <div className="form-group full-width">
            <label>
              <Translate contentKey="userManagement.edit.fields.bio">Bio / About Me</Translate>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder={translate('userManagement.edit.fields.bioPlaceholder')}
              rows={5}
            />
            <div className="character-count">
              <Translate contentKey="userManagement.edit.characterCount" interpolate={{ count: formData.bio.length }} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/admin/user-management')}>
              <Translate contentKey="userManagement.edit.buttons.cancel">Cancel</Translate>
            </button>
            <button type="submit" className="btn-submit">
              <i className="fa fa-save"></i>
              <Translate contentKey="userManagement.edit.buttons.save">Save Changes</Translate>
            </button>
          </div>
        </form>

        <div className="info-box">
          <i className="fa fa-info-circle"></i>
          <div>
            <strong>
              <Translate contentKey="userManagement.edit.infoBox.title">Editing User Permissions</Translate>
            </strong>
            <p>
              <Translate contentKey="userManagement.edit.infoBox.content">
                Changing a user&apos;s role to Administrator will grant them full access to the system settings and user management panels.
                Proceed with caution.
              </Translate>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementEdit;
