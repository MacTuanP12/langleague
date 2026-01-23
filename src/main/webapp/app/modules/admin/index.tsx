import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { AdminLayout } from './layout';
import AdminDashboard from './dashboard/admin-dashboard';
import UserManagement from './user-management';
// import Docs from './system-config/docs'; // Removed unused import

const AdminRoutes = () => {
  return (
    <ErrorBoundaryRoutes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="user-management/*" element={<UserManagement />} />
        {/* <Route path="docs" element={<Docs />} /> // Removed API Docs route */}
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default AdminRoutes;
