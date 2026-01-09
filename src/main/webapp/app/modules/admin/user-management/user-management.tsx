import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IUser } from 'app/shared/model/user.model';
import './user-management.scss';

export const UserManagement = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
    return 'role-librarian';
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

  if (loading && users.length === 0) {
    return (
      <div className="user-management">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="header-content">
          <h1>User Management</h1>
          <p>Manage student, teacher, and staff accounts.</p>
        </div>
        <button className="btn-add-user" onClick={() => navigate('/admin/user-management/new')}>
          <i className="bi bi-plus-lg"></i>
          Add New User
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
          <option value="ROLE_LIBRARIAN">Librarian</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="users-table-container">
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
                    <button className="btn-action btn-delete" onClick={() => handleDelete(user.id)} title="Delete User">
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
    </div>
  );
};

export default UserManagement;
