import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Progress from './progress';
import ProgressDetail from './progress-detail';
import ProgressUpdate from './progress-update';
import ProgressDeleteDialog from './progress-delete-dialog';

const ProgressRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Progress />} />
    <Route path="new" element={<ProgressUpdate />} />
    <Route path=":id">
      <Route index element={<ProgressDetail />} />
      <Route path="edit" element={<ProgressUpdate />} />
      <Route path="delete" element={<ProgressDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ProgressRoutes;
