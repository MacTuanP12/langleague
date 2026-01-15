import React, { useEffect, useMemo } from 'react';
import { Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchTeacherStats } from 'app/shared/reducers/teacher.reducer';
import TeacherLayout from 'app/modules/teacher/teacher-layout';
import { LoadingSpinner } from 'app/shared/components';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './teacher-dashboard.scss';
import '../teacher.scss';

export const TeacherDashboard = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const { stats, loading } = useAppSelector(state => state.teacher);

  useEffect(() => {
    dispatch(fetchTeacherStats());
  }, [dispatch]);

  // IMPORTANT: All hooks must be called before any conditional returns
  const maxEnrollment = useMemo(() => {
    if (!stats?.bookStats || stats.bookStats.length === 0) return 1;
    const counts = stats.bookStats.map(s => s?.enrollmentCount || 0);
    return Math.max(...counts, 1);
  }, [stats?.bookStats]);

  // Loading state - after all hooks
  if (loading && !stats?.totalBooks) {
    return (
      <TeacherLayout>
        <LoadingSpinner message="langleague.teacher.dashboard.loading" isI18nKey />
      </TeacherLayout>
    );
  }

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
      <Container fluid className="teacher-page-container">
        {/* Statistics Cards */}
        <Row className="teacher-stats-grid mb-4">
          <Col xs="12" md="6" lg="6">
            <div className="stat-card">
              <div className="stat-icon">
                <FontAwesomeIcon icon="book" />
              </div>
              <div className="stat-info">
                <h3>
                  <Translate contentKey="langleague.teacher.dashboard.stats.myBooks">My Books</Translate>
                </h3>
                <p className="stat-number">{stats?.totalBooks ?? 0}</p>
              </div>
            </div>
          </Col>

          <Col xs="12" md="6" lg="6">
            <div className="stat-card">
              <div className="stat-icon">
                <FontAwesomeIcon icon="users" />
              </div>
              <div className="stat-info">
                <h3>
                  <Translate contentKey="langleague.teacher.dashboard.stats.totalStudents">Total Students</Translate>
                </h3>
                <p className="stat-number">{stats?.totalStudents ?? 0}</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Content Sections */}
        <Row>
          <Col xs="12" lg="8">
            <Card className="content-section">
              <CardBody>
                <div className="section-header">
                  <h2>
                    <Translate contentKey="langleague.teacher.dashboard.enrollments">Enrollments per Book</Translate>
                  </h2>
                </div>
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
                  <p className="text-muted text-center">
                    <Translate contentKey="langleague.teacher.dashboard.noEnrollmentData">No enrollment data available yet.</Translate>
                  </p>
                )}
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" lg="4">
            <Card className="content-section">
              <CardBody>
                <div className="section-header">
                  <h2>
                    <Translate contentKey="langleague.teacher.dashboard.quickActions.title">Quick Actions</Translate>
                  </h2>
                </div>
                <div className="action-buttons" style={{ flexDirection: 'column' }}>
                  <Button tag={Link} to="/teacher/books/new" color="primary" className="action-btn btn-primary mb-2">
                    <FontAwesomeIcon icon="plus-circle" className="me-2" />
                    <Translate contentKey="langleague.teacher.dashboard.quickActions.createBook">Create New Book</Translate>
                  </Button>
                  <Button tag={Link} to="/teacher/books" color="secondary" className="action-btn btn-secondary mb-2" outline>
                    <FontAwesomeIcon icon="book" className="me-2" />
                    <Translate contentKey="langleague.teacher.dashboard.quickActions.manageBooks">Manage Books</Translate>
                  </Button>
                  <Button tag={Link} to="/teacher/students" color="secondary" className="action-btn btn-secondary" outline>
                    <FontAwesomeIcon icon="users" className="me-2" />
                    <Translate contentKey="langleague.teacher.dashboard.quickActions.viewStudents">View Students</Translate>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
