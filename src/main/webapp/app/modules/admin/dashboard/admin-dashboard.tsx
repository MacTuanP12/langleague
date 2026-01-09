import React from 'react';
import { useAppSelector } from 'app/config/store';
import './admin-dashboard.scss';

export const AdminDashboard = () => {
  const account = useAppSelector(state => state.authentication.account);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {account?.firstName || 'Admin'}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-book"></i>
          </div>
          <div className="stat-info">
            <h3>Total Courses</h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-graph-up"></i>
          </div>
          <div className="stat-info">
            <h3>Active Sessions</h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-clock-history"></i>
          </div>
          <div className="stat-info">
            <h3>Recent Activities</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">
              <i className="bi bi-person-plus"></i>
              Add User
            </button>
            <button className="action-btn">
              <i className="bi bi-book"></i>
              Manage Courses
            </button>
            <button className="action-btn">
              <i className="bi bi-gear"></i>
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
