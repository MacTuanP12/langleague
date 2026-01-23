import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './app.scss';
import 'app/config/dayjs';

import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { checkStreak } from 'app/shared/reducers/user-profile.reducer';
import ErrorBoundary from 'app/shared/error/error-boundary';
import AppRoutes from 'app/routes';
import { ThemeProvider } from 'app/shared/context/ThemeContext';
import { translate } from 'react-jhipster';

// Safe DOM access with fallback
const baseHref = document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '') || '';

export const App = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  // Fixed: Added dispatch to dependencies
  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, [dispatch]);

  // Fixed: Added dispatch to dependencies and used optional chaining
  // Only check streak for students, not for admins or teachers
  useEffect(() => {
    if (isAuthenticated && account) {
      const isStudent = account.authorities?.includes('ROLE_STUDENT');
      const isAdminOrTeacher = account.authorities?.some(auth => auth === 'ROLE_ADMIN' || auth === 'ROLE_TEACHER');

      if (isStudent && !isAdminOrTeacher) {
        dispatch(checkStreak()).then((action: { payload?: { milestoneReached?: boolean; streakCount?: number }; type: string }) => {
          if (action.payload?.milestoneReached) {
            Swal.fire({
              icon: 'success',
              title: translate('langleague.student.dashboard.streak.milestone.title'),
              text: translate('langleague.student.dashboard.streak.milestone.message', { count: action.payload.streakCount }),
              confirmButtonText: translate('langleague.student.dashboard.streak.milestone.confirmButton'),
            });
          }
        });
      }
    }
  }, [isAuthenticated, account, dispatch]);

  return (
    <ThemeProvider>
      <BrowserRouter basename={baseHref}>
        {/* Skip to main content link for accessibility (WCAG 2.4.1) */}
        <a href="#main-content" className="skip-link">
          {translate('global.menu.skipToContent', 'Skip to main content')}
        </a>
        <div className="app-container" key={currentLocale}>
          <ToastContainer position="top-right" className="toastify-container" toastClassName="toastify-toast" />
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
