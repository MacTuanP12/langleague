import 'react-toastify/dist/ReactToastify.css';
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

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(checkStreak()).then((action: { payload?: { milestoneReached?: boolean; streakCount?: number }; type: string }) => {
        if (action.payload && action.payload.milestoneReached) {
          Swal.fire({
            icon: 'success',
            title: 'Chúc mừng!',
            text: `🎉 Chúc mừng! Bạn đã đạt chuỗi ${action.payload.streakCount} ngày liên tiếp!`,
            confirmButtonText: 'Tuyệt vời!',
          });
        }
      });
    }
  }, [isAuthenticated]);

  return (
    <ThemeProvider>
      <BrowserRouter basename={baseHref}>
        <div className="app-container">
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
