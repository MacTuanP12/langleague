import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Grammar from './grammar';
import GrammarDetail from './grammar-detail';
import GrammarUpdate from './grammar-update';
import GrammarDeleteDialog from './grammar-delete-dialog';

const GrammarRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Grammar />} />
    <Route path="new" element={<GrammarUpdate />} />
    <Route path=":id">
      <Route index element={<GrammarDetail />} />
      <Route path="edit" element={<GrammarUpdate />} />
      <Route path="delete" element={<GrammarDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default GrammarRoutes;
