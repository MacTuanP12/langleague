import React from 'react';
import { Route } from 'react-router';

import Loadable from 'react-loadable';

import AuthSlider from 'app/modules/account/auth-slider';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/account/logout';
import Home from 'app/modules/home/home';
import PublicBookList from 'app/modules/home/public-book-list';
import PublicBookDetail from 'app/modules/home/public-book-detail';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

const loading = <div>loading ...</div>;

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => loading,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "admin" */ 'app/modules/admin'),
  loading: () => loading,
});

const Teacher = Loadable({
  loader: () => import(/* webpackChunkName: "teacher" */ 'app/modules/teacher'),
  loading: () => loading,
});

const Student = Loadable({
  loader: () => import(/* webpackChunkName: "student" */ 'app/modules/student'),
  loading: () => loading,
});
const AppRoutes = () => {
  return (
    <main id="main-content" className="view-routes" role="main">
      <ErrorBoundaryRoutes>
        <Route index element={<Home />} />
        <Route path="login" element={<AuthSlider />} />
        <Route path="logout" element={<Logout />} />
        <Route path="account">
          {/* Public routes - no authentication required */}
          <Route path="register" element={<AuthSlider />} />
          <Route path="activate" element={<Activate />} />
          <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route>

          {/* Protected account routes - require authentication */}
          <Route
            path="*"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.TEACHER, AUTHORITIES.STUDENT]}>
                <Account />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Public Book Routes */}
        <Route path="books" element={<PublicBookList />} />
        <Route path="book/:id" element={<PublicBookDetail />} />

        {/* ============================================
         * PROTECTED ROUTES - ROLE-BASED ACCESS CONTROL
         * ============================================ */}

        {/* Protected Admin Routes - Only accessible by ROLE_ADMIN */}
        <Route
          path="admin/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Admin />
            </PrivateRoute>
          }
        />

        {/* Protected Teacher Routes - Only accessible by ROLE_TEACHER */}
        <Route
          path="teacher/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.TEACHER]}>
              <Teacher />
            </PrivateRoute>
          }
        />

        {/* Protected Student Routes - Only accessible by ROLE_STUDENT */}
        <Route
          path="student/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.STUDENT]}>
              <Student />
            </PrivateRoute>
          }
        />

        {/* DEPRECATED: Old entity CRUD routes - now integrated into role-specific modules */}
        {/* <Route path="*" element={<EntitiesRoutes />} /> */}

        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </main>
  );
};

export default AppRoutes;
