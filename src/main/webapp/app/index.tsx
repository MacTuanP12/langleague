import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Storage } from 'react-jhipster';
import App from './app';
import store from './config/store';
import setupAxiosInterceptors from './config/axios-interceptor';
import { logoutSession } from './shared/auth/auth.reducer';
// Initialize i18n with JSON loader
import './config/i18n-loader';
// Use Ant Design reset stylesheet (AntD v5 ships reset.css)
import 'antd/dist/reset.css';
// Custom dashboard / global tweaks (load after AntD reset)
import '../content/css/dashboard.css';

// Setup axios interceptors for JWT token handling
const onUnauthenticated = () => {
  Storage.local.remove('jhi-authenticationToken');
  Storage.session.remove('jhi-authenticationToken');
  store.dispatch(logoutSession());
};

setupAxiosInterceptors(onUnauthenticated);

// Global handlers to help debug runtime promise errors (AggregateError etc.)
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    // Log the reason; AggregateError often contains an `errors` array
    // which helps identify all underlying causes.
    // Keep this in dev only to avoid noisy logs in production.
    console.error('Unhandled promise rejection (global):', event.reason);
    // Avoid unnecessary type assertions to satisfy ESLint rule
    const _reason: any = event.reason;
    if (_reason && _reason.errors) {
      console.error('AggregateError.errors:', _reason.errors);
    }
  });

  window.addEventListener('error', (ev: ErrorEvent) => {
    console.error('Global error caught:', ev.error || ev.message, ev.filename, ev.lineno, ev.colno);
  });
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
