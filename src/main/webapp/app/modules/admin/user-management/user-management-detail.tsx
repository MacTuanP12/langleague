import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IUser } from 'app/shared/model/user.model';
import './user-management-edit.scss';

export const UserManagementDetail = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      console.error('Error loading user:', error);
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    if (role === 'ROLE_STUDENT') return 'Student';
    if (role === 'ROLE_TEACHER') return 'Teacher';
    if (role === 'ROLE_ADMIN') return 'Admin';
    return role;
  };

  const getStatusBadge = (activated: boolean) => {
    return activated ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">Inactive</span>;
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
          <span className="current">{user.login}</span>
        </div>
        <div className="header-actions">
          <Link to={`/admin/user-management/${login}/edit`} className="btn-primary">
            <i className="fa fa-pencil"></i> Edit User
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
              User ID: {user.id} • Joined{' '}
              {user.createdDate ? new Date(user.createdDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
            </p>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <label>Login</label>
            <p>{user.login}</p>
          </div>

          <div className="detail-item">
            <label>Email Address</label>
            <p>{user.email}</p>
          </div>

          <div className="detail-item">
            <label>First Name</label>
            <p>{user.firstName || '-'}</p>
          </div>

          <div className="detail-item">
            <label>Last Name</label>
            <p>{user.lastName || '-'}</p>
          </div>

          <div className="detail-item">
            <label>Role</label>
            <p className="role-badge">{getRoleLabel(user.authorities?.[0] || '')}</p>
          </div>

          <div className="detail-item">
            <label>Status</label>
            <p>{getStatusBadge(user.activated || false)}</p>
          </div>

          <div className="detail-item">
            <label>Language</label>
            <p>{user.langKey?.toUpperCase() || 'EN'}</p>
          </div>

          <div className="detail-item">
            <label>Created By</label>
            <p>{user.createdBy || 'System'}</p>
          </div>

          <div className="detail-item">
            <label>Created Date</label>
            <p>{user.createdDate ? new Date(user.createdDate).toLocaleString() : '-'}</p>
          </div>

          <div className="detail-item">
            <label>Last Modified By</label>
            <p>{user.lastModifiedBy || '-'}</p>
          </div>

          <div className="detail-item">
            <label>Last Modified Date</label>
            <p>{user.lastModifiedDate ? new Date(user.lastModifiedDate).toLocaleString() : '-'}</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/user-management')} className="btn-secondary">
            <i className="fa fa-arrow-left"></i> Back to List
          </button>
          <Link to={`/admin/user-management/${login}/edit`} className="btn-primary">
            <i className="fa fa-pencil"></i> Edit User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDetail;
