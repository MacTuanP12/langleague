import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import { UnitUpdate } from './unit-update';
import { UnitVocabulary } from './unit-vocabulary';
import { UnitGrammar } from './unit-grammar';
import { UnitExercise } from './unit-exercise';

const UnitRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path="new" element={<UnitUpdate />} />
    <Route path=":unitId">
      <Route path="edit" element={<UnitUpdate />} />
      <Route path="vocabulary" element={<UnitVocabulary />} />
      <Route path="grammar" element={<UnitGrammar />} />
      <Route path="exercise" element={<UnitExercise />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default UnitRoutes;
