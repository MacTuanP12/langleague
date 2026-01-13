import React, { useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchTeacherStats } from 'app/shared/reducers/teacher.reducer';
import TeacherLayout from 'app/modules/teacher/teacher-layout';
import { LoadingSpinner } from 'app/shared/components';
import { Link } from 'react-router-dom';
import './teacher-dashboard.scss';

export const TeacherDashboard = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const { stats, loading } = useAppSelector(state => state.teacher);

  useEffect(() => {
    dispatch(fetchTeacherStats());
  }, [dispatch]);

  if (loading && !stats.totalBooks) {
    return (
      <TeacherLayout>
        <LoadingSpinner message="Loading dashboard..." />
      </TeacherLayout>
    );
  }

  // Simple bar chart visualization using CSS
  const maxEnrollment = stats.bookStats && stats.bookStats.length > 0 ? Math.max(...stats.bookStats.map(s => s.enrollmentCount), 1) : 1;

  return (
    <TeacherLayout
      title={<Translate contentKey="langleague.teacher.dashboard.title">Teacher Dashboard</Translate>}
      subtitle={
        <Translate contentKey="langleague.teacher.dashboard.welcome" interpolate={{ name: account?.firstName || 'Teacher' }}>
          Welcome back, {account?.firstName || 'Teacher'}!
        </Translate>
      }
      showBackButton={false}
    >
      <div className="teacher-dashboard-content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-book"></i>
            </div>
            <div className="stat-info">
              <h3>
                <Translate contentKey="langleague.teacher.dashboard.stats.myBooks">My Books</Translate>
              </h3>
              <p className="stat-number">{stats.totalBooks}</p>
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
              <p className="stat-number">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="content-section chart-section">
            <h2>Enrollments per Book</h2>
            {stats.bookStats && stats.bookStats.length > 0 ? (
              <div className="simple-bar-chart">
                {stats.bookStats.map((stat, index) => (
                  <div key={index} className="chart-row">
                    <div className="chart-label">{stat.bookTitle}</div>
                    <div className="chart-bar-container">
                      <div className="chart-bar" style={{ width: `${(stat.enrollmentCount / maxEnrollment) * 100}%` }}>
                        <span className="chart-value">{stat.enrollmentCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No enrollment data available yet.</p>
            )}
          </div>

          <div className="content-section">
            <h2>
              <Translate contentKey="langleague.teacher.dashboard.quickActions.title">Quick Actions</Translate>
            </h2>
            <div className="action-buttons">
              <Link to="/teacher/books/new" className="action-btn">
                <i className="bi bi-plus-circle"></i>
                <Translate contentKey="langleague.teacher.dashboard.quickActions.createBook">Create New Book</Translate>
              </Link>
              <Link to="/teacher/books" className="action-btn">
                <i className="bi bi-book"></i>
                <Translate contentKey="langleague.teacher.dashboard.quickActions.manageBooks">Manage Books</Translate>
              </Link>
              <Link to="/teacher/students" className="action-btn">
                <i className="bi bi-people"></i>
                View Students
              </Link>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
