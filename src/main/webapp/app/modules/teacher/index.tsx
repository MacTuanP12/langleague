import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import TeacherDashboard from 'app/modules/teacher/dashboard/teacher-dashboard';
import BookManagement from 'app/modules/teacher/book-management/book-management';
import BookUpdate from 'app/modules/teacher/book-management/book-update';
import BookDetail from 'app/modules/teacher/book-management/book-detail';
import { UnitUpdateV2 } from 'app/modules/teacher/unit-management/unit-update-v2';
import UnitContentEditor from 'app/modules/teacher/unit-management/unit-content-editor';
import MyStudents from 'app/modules/teacher/student-management/my-students';

const TeacherRoutes = () => {
  return (
    <ErrorBoundaryRoutes>
      <Route index element={<TeacherDashboard />} />
      <Route path="dashboard" element={<TeacherDashboard />} />

      {/* Book Management */}
      <Route path="books">
        <Route index element={<BookManagement />} />
        <Route path="new" element={<BookUpdate />} />
        <Route path=":id" element={<BookDetail />} />
        <Route path=":id/edit" element={<BookUpdate />} />
      </Route>

      {/* Unit Management */}
      <Route path="units">
        <Route path=":bookId/new" element={<UnitUpdateV2 />} />
        <Route path=":id/edit" element={<UnitUpdateV2 />} />
        <Route path=":id/content" element={<UnitContentEditor />} />
      </Route>

      {/* Student Management */}
      <Route path="students" element={<MyStudents />} />
    </ErrorBoundaryRoutes>
  );
};

export default TeacherRoutes;
