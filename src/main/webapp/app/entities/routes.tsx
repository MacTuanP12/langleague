import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import UserProfile from './user-profile';
import Book from './book';
import Enrollment from './enrollment';
import Unit from './unit';
import Vocabulary from './vocabulary';
import Grammar from './grammar';
import Exercise from './exercise';
import ExerciseOption from './exercise-option';
import Progress from './progress';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="user-profile/*" element={<UserProfile />} />
        <Route path="book/*" element={<Book />} />
        <Route path="enrollment/*" element={<Enrollment />} />
        <Route path="unit/*" element={<Unit />} />
        <Route path="vocabulary/*" element={<Vocabulary />} />
        <Route path="grammar/*" element={<Grammar />} />
        <Route path="exercise/*" element={<Exercise />} />
        <Route path="exercise-option/*" element={<ExerciseOption />} />
        <Route path="progress/*" element={<Progress />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
