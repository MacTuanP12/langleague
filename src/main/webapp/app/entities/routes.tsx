import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

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
        {/* Admin only - User Profile management */}
        <Route
          path="user-profile/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <UserProfile />
            </PrivateRoute>
          }
        />

        {/* Teacher only - Content management (không có enrollment và progress) */}
        <Route
          path="book/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.TEACHER]}>
              <Book />
            </PrivateRoute>
          }
        />
        <Route
          path="unit/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.TEACHER]}>
              <Unit />
            </PrivateRoute>
          }
        />
        <Route
          path="vocabulary/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.TEACHER]}>
              <Vocabulary />
            </PrivateRoute>
          }
        />
        <Route
          path="grammar/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.TEACHER]}>
              <Grammar />
            </PrivateRoute>
          }
        />
        <Route
          path="exercise/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.TEACHER]}>
              <Exercise />
            </PrivateRoute>
          }
        />
        <Route
          path="exercise-option/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.TEACHER]}>
              <ExerciseOption />
            </PrivateRoute>
          }
        />

        {/* Student only - Enrollment và Progress (chỉ Student có quyền truy cập) */}
        <Route
          path="enrollment/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.STUDENT]}>
              <Enrollment />
            </PrivateRoute>
          }
        />
        <Route
          path="progress/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.STUDENT]}>
              <Progress />
            </PrivateRoute>
          }
        />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
