import * as React from 'react';
import { ToastContainer } from 'react-toastify';
import { ConfigProvider, theme as antdTheme } from 'antd';
import ErrorBoundary from './shared/error/error-boundary';
import AppRoutes from './routes';
import { useAppSelector } from './config/store';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

const App = () => {
  const themeMode = useAppSelector(state => state.theme.actualTheme);

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#667eea',
          borderRadius: 8,
        },
      }}
    >
      <div className="app-container">
        <ToastContainer position="top-left" className="toastify-container" />
        <ErrorBoundary>
          <React.Suspense fallback={<div className="loading-spinner">Loading...</div>}>
            <AppRoutes />
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </ConfigProvider>
  );
};

export default App;
