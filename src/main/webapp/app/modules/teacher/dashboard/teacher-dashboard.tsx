import React from 'react';
import { useAppSelector } from 'app/config/store';
import './teacher-dashboard.scss';

export const TeacherDashboard = () => {
  const account = useAppSelector(state => state.authentication.account);

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p>Welcome back, {account?.firstName || 'Teacher'}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-book"></i>
          </div>
          <div className="stat-info">
            <h3>My Courses</h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-info">
            <h3>Total Students</h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-clipboard-check"></i>
          </div>
          <div className="stat-info">
            <h3>Pending Assignments</h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-star"></i>
          </div>
          <div className="stat-info">
            <h3>Average Rating</h3>
            <p className="stat-number">0.0</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => (window.location.href = '/teacher/books')}>
              <i className="bi bi-book"></i>
              Manage Books
            </button>
            <button className="action-btn" onClick={() => (window.location.href = '/teacher/books/new')}>
              <i className="bi bi-plus-circle"></i>
              Create New Book
            </button>
            <button className="action-btn" onClick={() => (window.location.href = '/teacher/students')}>
              <i className="bi bi-people"></i>
              View Students
            </button>
          </div>
        </div>

        <div className="content-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <p className="no-data">No recent activities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
