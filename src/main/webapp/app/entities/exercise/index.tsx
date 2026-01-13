import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Exercise from './exercise';
import ExerciseDetail from './exercise-detail';
import ExerciseUpdate from './exercise-update';
import ExerciseDeleteDialog from './exercise-delete-dialog';

const ExerciseRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Exercise />} />
    <Route path="new" element={<ExerciseUpdate />} />
    <Route path=":id">
      <Route index element={<ExerciseDetail />} />
      <Route path="edit" element={<ExerciseUpdate />} />
      <Route path="delete" element={<ExerciseDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ExerciseRoutes;
