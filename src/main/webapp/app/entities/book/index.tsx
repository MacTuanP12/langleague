import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import { BookDetail } from './book-detail';
import { BookLearn } from './book-learn';
import { BookManagement } from './book-management';
import { BookUpdate } from './book-update';

const BookRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<BookManagement />} />
    <Route path="new" element={<BookUpdate />} />
    <Route path=":id">
      <Route index element={<BookDetail />} />
      <Route path="edit" element={<BookUpdate />} />
      <Route path="learn" element={<BookLearn />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default BookRoutes;
