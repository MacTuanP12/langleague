import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IUser } from 'app/shared/model/user.model';
import './user-management-modern.scss';

export const UserManagementModern = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
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
          role: roleFilter || undefined,
          status: statusFilter || undefined,
        },
      });
      setUsers(response.data);
      setTotalPages(13); // Assuming 128 total users / 10 per page
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id!));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, id]);
    } else {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.login?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRoleBadgeClass = (authorities: string[]) => {
    if (authorities?.includes('ROLE_ADMIN')) return 'badge-admin';
    if (authorities?.includes('ROLE_TEACHER')) return 'badge-teacher';
    if (authorities?.includes('ROLE_STUDENT')) return 'badge-student';
    return 'badge-librarian';
  };

  const getRoleLabel = (authorities: string[]) => {
    if (authorities?.includes('ROLE_ADMIN')) return 'Admin';
    if (authorities?.includes('ROLE_TEACHER')) return 'Teacher';
    if (authorities?.includes('ROLE_STUDENT')) return 'Student';
    return 'Librarian';
  };

  const getStatusBadgeClass = (activated: boolean) => {
    return activated ? 'status-active' : 'status-suspended';
  };

  const getStatusLabel = (activated: boolean) => {
    return activated ? 'Active' : 'Suspended';
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading && users.length === 0) {
    return (
      <div className="user-management-modern">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="user-management-modern">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>User Management</h1>
          <p>Manage student, teacher, and staff accounts.</p>
        </div>
        <button className="btn-add-user" onClick={() => navigate('/admin/user-management/new')}>
          <i className="bi bi-plus-lg"></i>
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters */}
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

        <div className="filter-group">
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="ROLE_STUDENT">Student</option>
            <option value="ROLE_TEACHER">Teacher</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
          <i className="bi bi-chevron-down"></i>
        </div>

        <div className="filter-group">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <i className="bi bi-chevron-down"></i>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={e => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>USER NAME</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>REGISTRATION DATE</th>
              <th className="col-actions">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="col-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={e => handleSelectUser(user.id, e.target.checked)}
                  />
                </td>
                <td>
                  <div className="user-info">
                    {user.imageUrl ? (
                      <div className="user-avatar" style={{ backgroundImage: `url(${user.imageUrl})` }}></div>
                    ) : (
                      <div className="user-avatar initials">{getInitials(user.firstName, user.lastName)}</div>
                    )}
                    <div className="user-details">
                      <span className="user-name">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${getRoleBadgeClass(user.authorities || [])}`}>{getRoleLabel(user.authorities || [])}</span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(user.activated || false)}`}>
                    <span className="status-dot"></span>
                    {getStatusLabel(user.activated || false)}
                  </span>
                </td>
                <td className="registration-date">{user.createdDate ? new Date(user.createdDate).toLocaleDateString() : '-'}</td>
                <td className="col-actions">
                  <div className="action-buttons">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => navigate(`/admin/user-management/${user.login}/edit`)}
                      title="Edit User"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="action-btn lock-btn" title="Lock User Account">
                      <i className="bi bi-lock"></i>
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(user.id)} title="Delete User">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-section">
        <div className="pagination-info">
          Showing <span className="highlight">{(currentPage - 1) * 10 + 1}</span> to{' '}
          <span className="highlight">{Math.min(currentPage * 10, 128)}</span> of <span className="highlight">128</span> results
        </div>
        <div className="pagination-controls">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            aria-label="Previous page"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          {[1, 2, 3].map(page => (
            <button key={page} className={`page-number ${page === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
              {page}
            </button>
          ))}
          <span className="page-ellipsis">...</span>
          <button className="page-number" onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </button>
          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            aria-label="Next page"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementModern;
