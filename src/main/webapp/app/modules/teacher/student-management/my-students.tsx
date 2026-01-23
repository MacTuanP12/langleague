import React, { useEffect, useState, useMemo } from 'react';
import { Translate, TextFormat, translate } from 'react-jhipster';
import { Container, Input, Card, CardBody, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchMyStudents, StudentDTO } from 'app/shared/reducers/teacher.reducer';
import TeacherLayout from 'app/modules/teacher/teacher-layout';
import { LoadingSpinner } from 'app/shared/components';
import { DataTable, Column } from 'app/shared/components/data-table';
import { APP_DATE_FORMAT } from 'app/config/constants';
import '../teacher.scss';
import './my-students.scss';

export const MyStudents = () => {
  const dispatch = useAppDispatch();
  const { students, loading, errorMessage } = useAppSelector(state => state.teacher);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchMyStudents());
  }, [dispatch]);

  const filteredStudents = useMemo(
    () =>
      (students || []).filter(
        student =>
          student.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [students, searchTerm],
  );

  const columns: Column<StudentDTO>[] = useMemo(
    () => [
      {
        key: 'student',
        header: translate('langleague.teacher.students.table.student'),
        render: student => (
          <div className="d-flex align-items-center">
            <div className="user-avatar-small me-3">
              {student.imageUrl ? (
                <img src={student.imageUrl} alt={student.login} />
              ) : (
                <div className="avatar-placeholder">{student.firstName?.charAt(0) || student.login?.charAt(0) || '?'}</div>
              )}
            </div>
            <div>
              <div className="fw-bold">
                {student.firstName} {student.lastName}
              </div>
              <small className="text-muted">@{student.login}</small>
            </div>
          </div>
        ),
      },
      {
        key: 'book',
        header: translate('langleague.teacher.students.table.enrolledBook'),
        render: student => (
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon="book" className="text-primary me-2" />
            <span>{student.bookTitle}</span>
          </div>
        ),
      },
      {
        key: 'date',
        header: translate('langleague.teacher.students.table.enrolledDate'),
        render: student =>
          student.enrollmentDate ? <TextFormat value={student.enrollmentDate} type="date" format={APP_DATE_FORMAT} /> : 'N/A',
      },
      {
        key: 'status',
        header: translate('langleague.teacher.students.table.status'),
        render: student => (
          <Badge
            color={
              student.status.toLowerCase() === 'active' ? 'success' : student.status.toLowerCase() === 'pending' ? 'warning' : 'secondary'
            }
          >
            {student.status}
          </Badge>
        ),
      },
    ],
    [],
  );

  if (loading && students.length === 0) {
    return (
      <TeacherLayout>
        <LoadingSpinner message="langleague.teacher.students.messages.loading" isI18nKey />
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout
      title={<Translate contentKey="langleague.teacher.students.title">My Students</Translate>}
      subtitle={<Translate contentKey="langleague.teacher.students.subtitle">Track student progress and enrollments</Translate>}
      showBackButton={false}
    >
      <Container fluid className="teacher-page-container">
        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
            {errorMessage}
          </div>
        )}

        {/* Search Bar */}
        <div className="search-filter-bar mb-4">
          <div className="search-box">
            <Input
              type="text"
              placeholder={translate('langleague.teacher.students.search')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center">
            <Badge color="primary" pill className="px-3 py-2">
              <Translate contentKey="langleague.teacher.students.totalStudents">Total Students:</Translate>{' '}
              <strong>{students.length}</strong>
            </Badge>
          </div>
        </div>

        {/* Students Table */}
        <Card className="stat-card">
          <CardBody>
            <DataTable
              data={filteredStudents}
              columns={columns}
              keyExtractor={s => `${s.id}-${s.bookTitle}`}
              emptyMessage={translate('langleague.teacher.students.messages.noStudents')}
              className="teacher-table"
            />
          </CardBody>
        </Card>
      </Container>
    </TeacherLayout>
  );
};

export default MyStudents;
