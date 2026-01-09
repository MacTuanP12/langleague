import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import axios from 'axios';
import { IUser } from 'app/shared/model/user.model';
import { LoadingSpinner, ConfirmModal } from 'app/shared/components';
import './user-management.scss';

export const UserManagement = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, [currentPage, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users', {
        params: {
          page: currentPage - 1,
          size: 10,
          role: roleFilter !== 'all' ? roleFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
      });
      setUsers(response.data);
      // Giả sử có 128 users như trong design
      setTotalPages(13);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`/api/admin/users/${userToDelete}`);
        toast.success(translate('langleague.admin.userManagement.deleteSuccess'));
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(translate('langleague.admin.userManagement.deleteFailed'));
      }
    }
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter(
    user =>
      user.login?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRoleBadgeClass = (authorities: string[]) => {
    if (authorities?.includes('ROLE_ADMIN')) return 'role-admin';
    if (authorities?.includes('ROLE_TEACHER')) return 'role-teacher';
    if (authorities?.includes('ROLE_STUDENT')) return 'role-student';

  };

  const getRoleLabel = (authorities: string[]) => {
    if (authorities?.includes('ROLE_ADMIN')) return translate('langleague.admin.userManagement.role.admin');
    if (authorities?.includes('ROLE_TEACHER')) return translate('langleague.admin.userManagement.role.teacher');
    if (authorities?.includes('ROLE_STUDENT')) return translate('langleague.admin.userManagement.role.student');

  };

  const getStatusBadgeClass = (activated: boolean) => {
    return activated ? 'status-active' : 'status-suspended';
  };

  const getStatusLabel = (activated: boolean) => {
    return activated ? translate('langleague.admin.userManagement.status.active') : translate('langleague.admin.userManagement.status.suspended');
  };

  if (loading && users.length === 0) {
    return (
      <div className="user-management">
        <LoadingSpinner message="langleague.admin.userManagement.loading" isI18nKey />
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <Translate contentKey="langleague.admin.userManagement.title">User Management</Translate>
          </h1>
          <p>
            <Translate contentKey="langleague.admin.userManagement.subtitle">Manage student, teacher, and staff accounts.</Translate>
          </p>
        </div>
        <button className="btn-add-user" onClick={() => navigate('/admin/user-management/new')}>
          <i className="bi bi-plus-lg"></i>
          <Translate contentKey="langleague.admin.userManagement.actions.addNew">Add New User</Translate>
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="filter-select">
          <option value="all">All Roles</option>
          <option value="ROLE_STUDENT">Student</option>
          <option value="ROLE_TEACHER">Teacher</option>
          <option value="ROLE_ADMIN">Admin</option>

        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="users-table-container table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>USER NAME</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>REGISTRATION DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.imageUrl ? (
                        <img src={user.imageUrl} alt={user.login} />
                      ) : (
                        <div className="avatar-placeholder">{user.firstName?.charAt(0) || user.login?.charAt(0) || '?'}</div>
                      )}
                    </div>
                    <div className="user-details">
                      <span className="user-name">
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.login}
                      </span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${getRoleBadgeClass(user.authorities)}`}>{getRoleLabel(user.authorities)}</span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(user.activated)}`}>
                    <span className="status-dot"></span>
                    {getStatusLabel(user.activated)}
                  </span>
                </td>
                <td>
                  {user.createdDate
                    ? new Date(user.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => navigate(`/admin/user-management/${user.login}/edit`)}
                      title="Edit User"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn-action btn-lock" title="Lock User Account">
                      <i className="bi bi-lock"></i>
                    </button>
                  <button className="btn-action btn-delete" onClick={() => handleDeleteClick(Number(user.id))} title="Delete User">
                    <i className="bi bi-trash"></i>
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <div className="pagination-info">
          Showing <strong>1</strong> to <strong>10</strong> of <strong>128</strong> results
        </div>
        <div className="pagination">
          <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            <i className="bi bi-chevron-left"></i>
          </button>
          {[1, 2, 3].map(page => (
            <button key={page} className={`page-btn ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
              {page}
            </button>
          ))}
          <span className="page-dots">...</span>
          <button className="page-btn" onClick={() => setCurrentPage(12)}>
            12
          </button>
          <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="langleague.admin.userManagement.confirmDeleteTitle"
        message="langleague.admin.userManagement.confirmDelete"
        confirmText="langleague.common.delete"
        cancelText="langleague.common.cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isI18nKey
        variant="danger"
      />
    </div>
  );
};

export default UserManagement;
