import React from 'react';
import { Translate } from 'react-jhipster';
import { useAppSelector } from 'app/config/store';
import './teacher-dashboard.scss';

export const TeacherDashboard = () => {
  const account = useAppSelector(state => state.authentication.account);

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>
          <Translate contentKey="langleague.teacher.dashboard.title">Teacher Dashboard</Translate>
        </h1>
        <p>
          <Translate contentKey="langleague.teacher.dashboard.welcome" interpolate={{ name: account?.firstName || 'Teacher' }}>
            Welcome back, {account?.firstName || 'Teacher'}!
          </Translate>
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-book"></i>
          </div>
          <div className="stat-info">
            <h3>
              <Translate contentKey="langleague.teacher.dashboard.stats.myCourses">My Courses</Translate>
            </h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-info">
            <h3>
              <Translate contentKey="langleague.teacher.dashboard.stats.totalStudents">Total Students</Translate>
            </h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-clipboard-check"></i>
          </div>
          <div className="stat-info">
            <h3>
              <Translate contentKey="langleague.teacher.dashboard.stats.pendingAssignments">Pending Assignments</Translate>
            </h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-star"></i>
          </div>
          <div className="stat-info">
            <h3>
              <Translate contentKey="langleague.teacher.dashboard.stats.averageRating">Average Rating</Translate>
            </h3>
            <p className="stat-number">0.0</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>
            <Translate contentKey="langleague.teacher.dashboard.quickActions.title">Quick Actions</Translate>
          </h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => (window.location.href = '/teacher/books')}>
              <i className="bi bi-book"></i>
              <Translate contentKey="langleague.teacher.dashboard.quickActions.manageBooks">Manage Books</Translate>
            </button>
            <button className="action-btn" onClick={() => (window.location.href = '/teacher/books/new')}>
              <i className="bi bi-plus-circle"></i>
              <Translate contentKey="langleague.teacher.dashboard.quickActions.createBook">Create New Book</Translate>
            </button>
            <button className="action-btn" onClick={() => (window.location.href = '/teacher/students')}>
              <i className="bi bi-people"></i>
              <Translate contentKey="langleague.teacher.dashboard.quickActions.viewStudents">View Students</Translate>
            </button>
          </div>
        </div>

        <div className="content-section">
          <h2>
            <Translate contentKey="langleague.teacher.dashboard.recentActivity.title">Recent Activity</Translate>
          </h2>
          <div className="activity-list">
            <p className="no-data">
              <Translate contentKey="langleague.teacher.dashboard.recentActivity.noData">No recent activities</Translate>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
