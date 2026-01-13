import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Unit from './unit';
import UnitDetail from './unit-detail';
import UnitUpdate from './unit-update';
import UnitDeleteDialog from './unit-delete-dialog';

const UnitRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Unit />} />
    <Route path="new" element={<UnitUpdate />} />
    <Route path=":id">
      <Route index element={<UnitDetail />} />
      <Route path="edit" element={<UnitUpdate />} />
      <Route path="delete" element={<UnitDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default UnitRoutes;
