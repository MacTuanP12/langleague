import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { useUserManagement } from 'app/shared/reducers/user-management.hook';
import { IUser } from 'app/shared/model/user.model';
import { LoadingSpinner, ConfirmModal } from 'app/shared/components';
import './user-management.scss';

export const UserManagement = () => {
  const { loadUsers: fetchUsers, deleteUser, updateUser } = useUserManagement();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [currentPage, roleFilter, statusFilter, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchUsers(currentPage - 1, 10, 'id,asc', searchTerm, roleFilter, statusFilter);
      setUsers(response.data);
      const total = parseInt(response.headers['x-total-count'], 10);
      setTotalPages(Math.ceil(total / 10) || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error(translate('langleague.admin.userManagement.messages.loadError'));
      setLoading(false);
    }
  };

  const handleDeleteClick = (login: string) => {
    setUserToDelete(login);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete);
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

  const handleToggleStatus = async (user: IUser) => {
    try {
      const updatedUser = { ...user, activated: !user.activated };
      await updateUser(updatedUser);
      toast.success(
        translate(
          updatedUser.activated
            ? 'langleague.admin.userManagement.messages.activateSuccess'
            : 'langleague.admin.userManagement.messages.deactivateSuccess',
        ),
      );
      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(translate('langleague.admin.userManagement.messages.updateError'));
    }
  };

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
    return activated
      ? translate('langleague.admin.userManagement.status.active')
      : translate('langleague.admin.userManagement.status.suspended');
  };

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
            placeholder={translate('langleague.admin.userManagement.search.placeholder')}
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="all">
            <Translate contentKey="langleague.admin.userManagement.filters.role.all">All Roles</Translate>
          </option>
          <option value="ROLE_STUDENT">
            <Translate contentKey="langleague.admin.userManagement.filters.role.student">Student</Translate>
          </option>
          <option value="ROLE_TEACHER">
            <Translate contentKey="langleague.admin.userManagement.filters.role.teacher">Teacher</Translate>
          </option>
          <option value="ROLE_ADMIN">
            <Translate contentKey="langleague.admin.userManagement.filters.role.admin">Admin</Translate>
          </option>
        </select>
        <select
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="all">
            <Translate contentKey="langleague.admin.userManagement.filters.status.all">All Statuses</Translate>
          </option>
          <option value="active">
            <Translate contentKey="langleague.admin.userManagement.filters.status.active">Active</Translate>
          </option>
          <option value="suspended">
            <Translate contentKey="langleague.admin.userManagement.filters.status.suspended">Suspended</Translate>
          </option>
          <option value="pending">
            <Translate contentKey="langleague.admin.userManagement.filters.status.pending">Pending</Translate>
          </option>
        </select>
      </div>

      {loading ? (
        <div className="user-management">
          <LoadingSpinner message="langleague.admin.userManagement.loading" isI18nKey />
        </div>
      ) : (
        <div className="users-table-container table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>
                  <Translate contentKey="langleague.admin.userManagement.table.name">USER NAME</Translate>
                </th>
                <th>
                  <Translate contentKey="langleague.admin.userManagement.table.role">ROLE</Translate>
                </th>
                <th>
                  <Translate contentKey="langleague.admin.userManagement.table.status">STATUS</Translate>
                </th>
                <th>
                  <Translate contentKey="langleague.admin.userManagement.table.registrationDate">REGISTRATION DATE</Translate>
                </th>
                <th>
                  <Translate contentKey="langleague.admin.userManagement.table.actions">ACTIONS</Translate>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
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
                        title={translate('langleague.admin.userManagement.actions.editTitle')}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className={`btn-action ${user.activated ? 'btn-lock' : 'btn-unlock'}`}
                        onClick={() => handleToggleStatus(user)}
                        title={translate(
                          user.activated
                            ? 'langleague.admin.userManagement.actions.lockTitle'
                            : 'langleague.admin.userManagement.actions.unlockTitle',
                        )}
                      >
                        <i className={`bi ${user.activated ? 'bi-lock' : 'bi-unlock'}`}></i>
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteClick(user.login || '')}
                        title={translate('langleague.admin.userManagement.actions.deleteTitle')}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination-container">
        <div className="pagination-info">
          <Translate contentKey="langleague.admin.userManagement.pagination.showing">Showing</Translate>{' '}
          <strong>{(currentPage - 1) * 10 + 1}</strong> <Translate contentKey="langleague.admin.userManagement.pagination.to">to</Translate>{' '}
          <strong>{Math.min(currentPage * 10, (currentPage - 1) * 10 + users.length)}</strong>{' '}
          <Translate contentKey="langleague.admin.userManagement.pagination.of">of</Translate> <strong>{totalPages * 10}</strong>{' '}
          {/* Note: totalItems is not available in local state, using approximation or need to fetch total */}
          <Translate contentKey="langleague.admin.userManagement.pagination.results">results</Translate>
        </div>
        <div className="pagination">
          <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            <i className="bi bi-chevron-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} className={`page-btn ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
              {page}
            </button>
          ))}
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
