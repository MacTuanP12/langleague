import React from 'react';
import { Translate } from 'react-jhipster';
import { useAppSelector } from 'app/config/store';
import './admin-dashboard.scss';

export const AdminDashboard = () => {
  const account = useAppSelector(state => state.authentication.account);

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
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-book"></i>
          </div>
          <div className="stat-info">
            <h3>
              <Translate contentKey="langleague.admin.dashboard.stats.totalCourses">Total Courses</Translate>
            </h3>
            <p className="stat-number">0</p>
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
