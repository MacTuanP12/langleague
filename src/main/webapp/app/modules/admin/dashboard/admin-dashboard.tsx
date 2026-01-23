import React, { useEffect, useMemo } from 'react';
import { Translate } from 'react-jhipster';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector, useAppDispatch } from 'app/config/store';
import { getUsersAsAdmin } from 'app/modules/admin/user-management/user-management.reducer';
import { countAllBooks, countAllEnrollments, getSystemCompletionRate } from './admin-dashboard.reducer';
import '../admin.scss';

export const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { totalItems: totalUsers } = useAppSelector(state => state.userManagement);
  const { totalBooks, totalEnrollments, completionRate } = useAppSelector(state => state.adminDashboard);

  useEffect(() => {
    // Load users count (page 0, size 1 just to get total count in header)
    dispatch(getUsersAsAdmin({ page: 0, size: 1, sort: 'id,asc' }));

    // Load dashboard stats
    dispatch(countAllBooks());
    dispatch(countAllEnrollments());
    dispatch(getSystemCompletionRate());
  }, [dispatch]);

  // Calculate statistics (growth is mocked for now)
  const stats = useMemo(() => {
    // Calculate growth percentages (mock data for now)
    const usersGrowth = totalUsers > 0 ? Math.round(Math.random() * 20 - 5) : 0;
    const booksGrowth = totalBooks > 0 ? Math.round(Math.random() * 15) : 0;
    const enrollmentsGrowth = totalEnrollments > 0 ? Math.round(Math.random() * 25 - 10) : 0;

    return {
      totalUsers,
      totalBooks,
      totalEnrollments,
      completionRate,
      usersGrowth,
      booksGrowth,
      enrollmentsGrowth,
    };
  }, [totalUsers, totalBooks, totalEnrollments, completionRate]);

  return (
    <Container fluid className="admin-page-container">
      {/* Page Header */}
      <div className="admin-header">
        <div className="header-content">
          <h1>
            <Translate contentKey="langleague.admin.dashboard.title">System Dashboard</Translate>
          </h1>
          <p className="subtitle">
            <Translate contentKey="langleague.admin.dashboard.subtitle">Monitor and manage the LangLeague platform</Translate>
          </p>
        </div>
        <div className="header-actions">
          <div className="system-health-indicator healthy">
            <span className="status-dot"></span>
            <Translate contentKey="langleague.admin.dashboard.systemHealth.healthy">System Healthy</Translate>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="admin-stats-grid">
        <Card className="admin-stat-card">
          <CardBody>
            <div className="stat-icon-wrapper users">
              <FontAwesomeIcon icon="users" />
            </div>
            <div className="stat-content">
              <h3>
                <Translate contentKey="langleague.admin.dashboard.stats.totalUsers">Total Users</Translate>
              </h3>
              <p className="stat-number">{stats.totalUsers}</p>
              <span className={`stat-change ${stats.usersGrowth >= 0 ? 'positive' : 'negative'}`}>
                <FontAwesomeIcon icon={stats.usersGrowth >= 0 ? 'arrow-up' : 'arrow-down'} />
                {Math.abs(stats.usersGrowth)}% <Translate contentKey="langleague.admin.dashboard.stats.thisMonth">this month</Translate>
              </span>
            </div>
          </CardBody>
        </Card>

        <Card className="admin-stat-card">
          <CardBody>
            <div className="stat-icon-wrapper books">
              <FontAwesomeIcon icon="book" />
            </div>
            <div className="stat-content">
              <h3>
                <Translate contentKey="langleague.admin.dashboard.stats.totalBooks">Total Books</Translate>
              </h3>
              <p className="stat-number">{stats.totalBooks}</p>
              <span className={`stat-change ${stats.booksGrowth >= 0 ? 'positive' : 'neutral'}`}>
                <FontAwesomeIcon icon="arrow-up" />+{stats.booksGrowth}%{' '}
                <Translate contentKey="langleague.admin.dashboard.stats.growth">growth</Translate>
              </span>
            </div>
          </CardBody>
        </Card>

        <Card className="admin-stat-card">
          <CardBody>
            <div className="stat-icon-wrapper activity">
              <FontAwesomeIcon icon="graduation-cap" />
            </div>
            <div className="stat-content">
              <h3>
                <Translate contentKey="langleague.admin.dashboard.stats.enrollments">Total Enrollments</Translate>
              </h3>
              <p className="stat-number">{stats.totalEnrollments}</p>
              <span className={`stat-change ${stats.enrollmentsGrowth >= 0 ? 'positive' : 'negative'}`}>
                <FontAwesomeIcon icon={stats.enrollmentsGrowth >= 0 ? 'arrow-up' : 'arrow-down'} />
                {Math.abs(stats.enrollmentsGrowth)}%{' '}
                <Translate contentKey="langleague.admin.dashboard.stats.thisMonth">this month</Translate>
              </span>
            </div>
          </CardBody>
        </Card>

        <Card className="admin-stat-card">
          <CardBody>
            <div className="stat-icon-wrapper system">
              <FontAwesomeIcon icon="chart-line" />
            </div>
            <div className="stat-content">
              <h3>
                <Translate contentKey="langleague.admin.dashboard.stats.completion">Completion Rate</Translate>
              </h3>
              <p className="stat-number">{stats.completionRate}%</p>
              <span className="stat-change neutral">
                <FontAwesomeIcon icon="minus" />
                <Translate contentKey="langleague.admin.dashboard.stats.average">average</Translate>
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions and Activity */}
      <Row className="mt-4">
        <Col lg="6" className="mb-4">
          <Card className="quick-actions-panel">
            <CardBody>
              <h4>
                <FontAwesomeIcon icon="bolt" className="me-2" />
                <Translate contentKey="langleague.admin.dashboard.quickActions.title">Quick Actions</Translate>
              </h4>
              <div className="action-list">
                <div className="action-item">
                  <div className="action-info">
                    <div className="action-icon">
                      <FontAwesomeIcon icon="user-plus" />
                    </div>
                    <div className="action-details">
                      <p className="action-title">
                        <Translate contentKey="langleague.admin.dashboard.quickActions.addUser">Add New User</Translate>
                      </p>
                      <p className="action-time">
                        <Translate contentKey="langleague.admin.dashboard.quickActions.createAccount">Create a new account</Translate>
                      </p>
                    </div>
                  </div>
                  <Button color="primary" size="sm" outline>
                    <FontAwesomeIcon icon="arrow-right" />
                  </Button>
                </div>

                <div className="action-item">
                  <div className="action-info">
                    <div className="action-icon">
                      <FontAwesomeIcon icon="book" />
                    </div>
                    <div className="action-details">
                      <p className="action-title">
                        <Translate contentKey="langleague.admin.dashboard.quickActions.manageBooks">Manage Books</Translate>
                      </p>
                      <p className="action-time">
                        <Translate contentKey="langleague.admin.dashboard.quickActions.addEditBooks">Add or edit books</Translate>
                      </p>
                    </div>
                  </div>
                  <Button color="primary" size="sm" outline>
                    <FontAwesomeIcon icon="arrow-right" />
                  </Button>
                </div>

                <div className="action-item">
                  <div className="action-info">
                    <div className="action-icon">
                      <FontAwesomeIcon icon="cog" />
                    </div>
                    <div className="action-details">
                      <p className="action-title">
                        <Translate contentKey="langleague.admin.dashboard.quickActions.systemSettings">System Settings</Translate>
                      </p>
                      <p className="action-time">
                        <Translate contentKey="langleague.admin.dashboard.quickActions.configureSystem">
                          Configure system parameters
                        </Translate>
                      </p>
                    </div>
                  </div>
                  <Button color="primary" size="sm" outline>
                    <FontAwesomeIcon icon="arrow-right" />
                  </Button>
                </div>

                <div className="action-item">
                  <div className="action-info">
                    <div className="action-icon">
                      <FontAwesomeIcon icon="shield-alt" />
                    </div>
                    <div className="action-details">
                      <p className="action-title">
                        <Translate contentKey="langleague.admin.dashboard.quickActions.viewLogs">View System Logs</Translate>
                      </p>
                      <p className="action-time">
                        <Translate contentKey="langleague.admin.dashboard.quickActions.monitorActivity">Monitor system activity</Translate>
                      </p>
                    </div>
                  </div>
                  <Button color="primary" size="sm" outline>
                    <FontAwesomeIcon icon="arrow-right" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="6" className="mb-4">
          <Card className="quick-actions-panel">
            <CardBody>
              <h4>
                <FontAwesomeIcon icon="clock" className="me-2" />
                <Translate contentKey="langleague.admin.dashboard.recentActivity.title">Recent Activity</Translate>
              </h4>
              <div className="activity-feed">
                <div className="activity-item">
                  <div className="activity-icon">
                    <FontAwesomeIcon icon="user-plus" />
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <strong>
                        <Translate contentKey="langleague.admin.dashboard.recentActivity.newUser">New user registered</Translate>
                      </strong>
                    </p>
                    <p className="activity-time">
                      <Translate contentKey="langleague.admin.dashboard.recentActivity.minutesAgo" interpolate={{ minutes: 5 }}>
                        5 minutes ago
                      </Translate>
                    </p>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    <FontAwesomeIcon icon="book" />
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <strong>
                        <Translate contentKey="langleague.admin.dashboard.recentActivity.bookAdded">New book added to library</Translate>
                      </strong>
                    </p>
                    <p className="activity-time">
                      <Translate contentKey="langleague.admin.dashboard.recentActivity.hoursAgo" interpolate={{ hours: 2 }}>
                        2 hours ago
                      </Translate>
                    </p>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    <FontAwesomeIcon icon="graduation-cap" />
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <strong>
                        <Translate contentKey="langleague.admin.dashboard.recentActivity.enrollment">Student enrolled in a book</Translate>
                      </strong>
                    </p>
                    <p className="activity-time">
                      <Translate contentKey="langleague.admin.dashboard.recentActivity.hoursAgo" interpolate={{ hours: 3 }}>
                        3 hours ago
                      </Translate>
                    </p>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    <FontAwesomeIcon icon="check-circle" />
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <strong>
                        <Translate contentKey="langleague.admin.dashboard.recentActivity.unitCompleted">
                          Unit completed by student
                        </Translate>
                      </strong>
                    </p>
                    <p className="activity-time">
                      <Translate contentKey="langleague.admin.dashboard.recentActivity.hoursAgo" interpolate={{ hours: 4 }}>
                        4 hours ago
                      </Translate>
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
