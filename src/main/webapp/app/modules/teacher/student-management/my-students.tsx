import React, { useEffect, useState } from 'react';
import { Translate, TextFormat } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchMyStudents, StudentDTO } from 'app/shared/reducers/teacher.reducer';
import TeacherLayout from 'app/modules/teacher/teacher-layout';
import { LoadingSpinner } from 'app/shared/components';
import { DataTable, Column } from 'app/shared/components/data-table';
import { APP_DATE_FORMAT } from 'app/config/constants';
import './my-students.scss';

export const MyStudents = () => {
  const dispatch = useAppDispatch();
  const { students, loading } = useAppSelector(state => state.teacher);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchMyStudents());
  }, [dispatch]);

  const filteredStudents = (students || []).filter(
    student =>
      student.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns: Column<StudentDTO>[] = [
    {
      key: 'student',
      header: 'Student',
      render: student => (
        <div className="student-info">
          <img src={student.imageUrl || '/content/images/jhipster_family_member_0.svg'} alt="Avatar" className="student-avatar" />
          <div className="student-details">
            <span className="student-name">
              {student.firstName} {student.lastName}
            </span>
            <span className="student-login">@{student.login}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'book',
      header: 'Enrolled Course',
      render: student => <span className="book-name">{student.bookTitle}</span>,
    },
    {
      key: 'date',
      header: 'Enrolled Date',
      render: student =>
        student.enrollmentDate ? <TextFormat value={student.enrollmentDate} type="date" format={APP_DATE_FORMAT} /> : 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      render: student => <span className={`status-badge ${student.status.toLowerCase()}`}>{student.status}</span>,
    },
  ];

  if (loading && students.length === 0) {
    return (
      <TeacherLayout>
        <LoadingSpinner message="Loading students..." />
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="My Students" subtitle="Track student progress and enrollments" showBackButton={false}>
      <div className="my-students-page">
        <div className="actions-bar">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Search by name or course..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="stats-summary">
            <span>
              Total Students: <strong>{students.length}</strong>
            </span>
          </div>
        </div>

        <div className="students-table-container">
          <DataTable
            data={filteredStudents}
            columns={columns}
            keyExtractor={s => `${s.id}-${s.bookTitle}`} // Composite key as student can be in multiple books
            emptyMessage="No students found enrolled in your books."
          />
        </div>
      </div>
    </TeacherLayout>
  );
};

export default MyStudents;
