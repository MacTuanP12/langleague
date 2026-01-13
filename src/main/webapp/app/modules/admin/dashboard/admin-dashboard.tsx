import React, { useEffect, useMemo } from 'react';
import { Translate } from 'react-jhipster';
import { useAppSelector, useAppDispatch } from 'app/config/store';
import { useBooks, useEnrollments, useProgress } from 'app/shared/reducers/hooks';
import { getUsersAsAdmin } from 'app/modules/admin/user-management/user-management.reducer';
import './admin-dashboard.scss';

export const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const { totalItems: totalUsers } = useAppSelector(state => state.userManagement);

  // Redux hooks for statistics
  const { books, loadBooks } = useBooks();
  const { enrollments, loadMyEnrollments } = useEnrollments();
  const { progresses, loadMyProgresses } = useProgress();

  useEffect(() => {
    // Load data for statistics
    loadBooks();
    loadMyEnrollments();
    loadMyProgresses();
    // Load users count (page 0, size 1 just to get total count in header)
    dispatch(getUsersAsAdmin({ page: 0, size: 1, sort: 'id,asc' }));
  }, [loadBooks, loadMyEnrollments, loadMyProgresses, dispatch]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBooks = (books || []).length;
    // Note: enrollments here are "my enrollments" due to the hook used.
    // For admin stats, we ideally need "all enrollments", but we don't have that API exposed to FE easily yet without admin rights check on specific endpoint.
    // Assuming for now we display what we have access to.
    const totalEnrollments = (enrollments || []).length;
    const completedUnits = (progresses || []).filter(p => p.isCompleted).length;
    const totalUnits = (progresses || []).length;
    const completionRate = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

    return {
      totalUsers,
      totalBooks,
      totalEnrollments,
      completionRate,
    };
  }, [books, enrollments, progresses, totalUsers]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>
          <Translate contentKey="langleague.admin.dashboard.title">Admin Dashboard</Translate>
        </h1>
        <p>
          <Translate contentKey="langleague.admin.dashboard.welcome" interpolate={{ name: account?.firstName || 'Admin' }}>
            Welcome back, {account?.firstName || 'Admin'}!
          </Translate>
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-info">
            <h3>
              <Translate contentKey="langleague.admin.dashboard.stats.totalUsers">Total Users</Translate>
            </h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-book"></i>
          </div>
          <div className="stat-info">
            <h3>
              <Translate contentKey="langleague.admin.dashboard.stats.totalBooks">Total Books</Translate>
            </h3>
            <p className="stat-number">{stats.totalBooks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-graph-up"></i>
          </div>
          <div className="stat-info">
            <h3>
              <Translate contentKey="langleague.admin.dashboard.stats.activeSessions">Active Sessions</Translate>
            </h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-clock-history"></i>
          </div>
          <div className="stat-info">
            <h3>
              <Translate contentKey="langleague.admin.dashboard.stats.recentActivities">Recent Activities</Translate>
            </h3>
            <p className="stat-number">0</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>
            <Translate contentKey="langleague.admin.dashboard.quickActions.title">Quick Actions</Translate>
          </h2>
          <div className="action-buttons">
            <button className="action-btn">
              <i className="bi bi-person-plus"></i>
              <Translate contentKey="langleague.admin.dashboard.quickActions.addUser">Add User</Translate>
            </button>
            <button className="action-btn">
              <i className="bi bi-book"></i>
              <Translate contentKey="langleague.admin.dashboard.quickActions.manageCourses">Manage Courses</Translate>
            </button>
            <button className="action-btn">
              <i className="bi bi-gear"></i>
              <Translate contentKey="langleague.admin.dashboard.quickActions.systemSettings">System Settings</Translate>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
