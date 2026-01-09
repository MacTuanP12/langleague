import React from 'react';
import { Route } from 'react-router';

import Loadable from 'react-loadable';

import AuthSlider from 'app/modules/account/auth-slider';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/account/logout';
import Home from 'app/modules/home/home';
import EntitiesRoutes from 'app/entities/routes';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';

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
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route index element={<Home />} />
        <Route path="login" element={<AuthSlider />} />
        <Route path="logout" element={<Logout />} />
        <Route path="account">
          {/* Temporarily PUBLIC - No authentication required */}
          <Route path="*" element={<Account />} />
          <Route path="register" element={<AuthSlider />} />
          <Route path="activate" element={<Activate />} />
          <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route>
        </Route>

        {/* Temporarily PUBLIC - All role-based routes accessible without login */}
        <Route path="admin/*" element={<Admin />} />
        <Route path="teacher/*" element={<Teacher />} />
        <Route path="student/*" element={<Student />} />
        <Route path="*" element={<EntitiesRoutes />} />
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
