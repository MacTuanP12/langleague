import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Vocabulary from './vocabulary';
import VocabularyDetail from './vocabulary-detail';
import VocabularyUpdate from './vocabulary-update';
import VocabularyDeleteDialog from './vocabulary-delete-dialog';

const VocabularyRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Vocabulary />} />
    <Route path="new" element={<VocabularyUpdate />} />
    <Route path=":id">
      <Route index element={<VocabularyDetail />} />
      <Route path="edit" element={<VocabularyUpdate />} />
      <Route path="delete" element={<VocabularyDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default VocabularyRoutes;
