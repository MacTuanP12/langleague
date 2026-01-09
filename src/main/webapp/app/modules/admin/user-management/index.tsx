import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import UserManagement from './user-management';
import UserManagementDetail from './user-management-detail';
import UserManagementCreate from './user-management-create';
import UserManagementEdit from './user-management-edit';
import UserManagementDeleteDialog from './user-management-delete-dialog';

const UserManagementRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<UserManagement />} />
    <Route path="new" element={<UserManagementCreate />} />
    <Route path=":login">
      <Route index element={<UserManagementDetail />} />
      <Route path="edit" element={<UserManagementEdit />} />
      <Route path="delete" element={<UserManagementDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default UserManagementRoutes;
