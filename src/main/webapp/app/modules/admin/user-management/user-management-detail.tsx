import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Translate, translate } from 'react-jhipster';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import { IUser } from 'app/shared/model/user.model';
import './user-management-edit.scss';

export const UserManagementDetail = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login } = useParams<{ login: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (login) {
      loadUser();
    }
  }, [login]);

  const loadUser = async () => {
    try {
      const response = await axios.get(`/api/admin/users/${login}`);
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading user:', err);
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    if (role === 'ROLE_STUDENT') return translate('userManagement.detail.roles.student');
    if (role === 'ROLE_TEACHER') return translate('userManagement.detail.roles.teacher');
    if (role === 'ROLE_ADMIN') return translate('userManagement.detail.roles.admin');
    return role;
  };

  const getStatusBadge = (activated: boolean) => {
    return activated ? (
      <span className="badge badge-success">
        <Translate contentKey="userManagement.detail.status.active">Active</Translate>
      </span>
    ) : (
      <span className="badge badge-danger">
        <Translate contentKey="userManagement.detail.status.inactive">Inactive</Translate>
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner message="userManagement.detail.loading" isI18nKey />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={loadUser} />;
  }

  if (!user) {
    return <ErrorDisplay message="userManagement.detail.notFound" isI18nKey iconClass="bi-person-x" />;
  }

  return (
    <div className="user-management-edit">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/admin/user-management">
            <Translate contentKey="userManagement.detail.breadcrumb">User Management</Translate>
          </Link>
          <span className="separator">›</span>
          <span className="current">{user.login}</span>
        </div>
        <div className="header-actions">
          <Link to={`/admin/user-management/${login}/edit`} className="btn-primary">
            <i className="fa fa-pencil"></i> <Translate contentKey="userManagement.detail.editUser">Edit User</Translate>
          </Link>
        </div>
      </div>

      <div className="form-container">
        <div className="user-profile-section">
          <div className="avatar-container">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt={user.login} className="user-avatar-image" />
            ) : (
              <div className="avatar-placeholder">{user.firstName?.charAt(0) || user.login?.charAt(0) || '?'}</div>
            )}
          </div>
          <div className="user-info">
            <h3>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.login}</h3>
            <p className="user-meta">
              <Translate contentKey="userManagement.detail.userIdLabel">User ID</Translate>: {user.id} •{' '}
              <Translate contentKey="userManagement.detail.joinedLabel">Joined</Translate>{' '}
              {user.createdDate ? new Date(user.createdDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
            </p>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <label>
              <Translate contentKey="userManagement.detail.fields.login">Login</Translate>
            </label>
            <p>{user.login}</p>
          </div>

          <div className="detail-item">
            <label>
              <Translate contentKey="userManagement.detail.fields.email">Email Address</Translate>
            </label>
            <p>{user.email}</p>
          </div>

          <div className="detail-item">
            <label>
              <Translate contentKey="userManagement.detail.fields.firstName">First Name</Translate>
            </label>
            <p>{user.firstName || '-'}</p>
          </div>

          <div className="detail-item">
            <label>
              <Translate contentKey="userManagement.detail.fields.lastName">Last Name</Translate>
            </label>
            <p>{user.lastName || '-'}</p>
          </div>

          <div className="detail-item">
            <label>
              <Translate contentKey="userManagement.detail.fields.role">Role</Translate>
            </label>
            <p className="role-badge">{getRoleLabel(user.authorities?.[0] || '')}</p>
          </div>

          <div className="detail-item">
            <label>
              <Translate contentKey="userManagement.detail.fields.status">Status</Translate>
            </label>
            <p>{getStatusBadge(user.activated || false)}</p>
          </div>

          <div className="detail-item">
            <label>
              <Translate contentKey="userManagement.detail.fields.language">Language</Translate>
            </label>
            <p>{user.langKey?.toUpperCase() || 'EN'}</p>
          </div>

          <div className="detail-item">
            <label>
              <Translate contentKey="userManagement.detail.fields.createdBy">Created By</Translate>
            </label>
            <p>{user.createdBy || translate('userManagement.detail.system')}</p>
          </div>

          <div className="detail-item">
            <label>
              <Translate contentKey="userManagement.detail.fields.createdDate">Created Date</Translate>
            </label>
            <p>{user.createdDate ? new Date(user.createdDate).toLocaleString() : '-'}</p>
          </div>

          <div className="detail-item">
            <label>
              <Translate contentKey="userManagement.detail.fields.lastModifiedBy">Last Modified By</Translate>
            </label>
            <p>{user.lastModifiedBy || '-'}</p>
          </div>

          <div className="detail-item">
            <label>
              <Translate contentKey="userManagement.detail.fields.lastModifiedDate">Last Modified Date</Translate>
            </label>
            <p>{user.lastModifiedDate ? new Date(user.lastModifiedDate).toLocaleString() : '-'}</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/user-management')} className="btn-secondary">
            <i className="fa fa-arrow-left"></i> <Translate contentKey="userManagement.detail.backToList">Back to List</Translate>
          </button>
          <Link to={`/admin/user-management/${login}/edit`} className="btn-primary">
            <i className="fa fa-pencil"></i> <Translate contentKey="userManagement.detail.editUser">Edit User</Translate>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDetail;
