import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ExerciseOption from './exercise-option';
import ExerciseOptionDetail from './exercise-option-detail';
import ExerciseOptionUpdate from './exercise-option-update';
import ExerciseOptionDeleteDialog from './exercise-option-delete-dialog';

const ExerciseOptionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ExerciseOption />} />
    <Route path="new" element={<ExerciseOptionUpdate />} />
    <Route path=":id">
      <Route index element={<ExerciseOptionDetail />} />
      <Route path="edit" element={<ExerciseOptionUpdate />} />
      <Route path="delete" element={<ExerciseOptionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ExerciseOptionRoutes;
