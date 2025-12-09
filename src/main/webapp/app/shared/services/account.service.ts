import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUser } from '../model/models';

const API_URL = '/api/account';

// ==================== ACCOUNT MANAGEMENT APIs ====================

// Get current user account - Matches GET /api/account
export const getAccount = createAsyncThunk('account/fetch', async () => {
  const response = await axios.get<IUser>(API_URL);
  return response.data;
});

// Update current user account - Matches POST /api/account or PUT /api/account
export const updateAccount = createAsyncThunk('account/update', async (user: Partial<IUser>) => {
  const response = await axios.post<IUser>(API_URL, user);
  return response.data;
});

// Change password - Matches POST /api/account/change-password
export const changePassword = createAsyncThunk(
  'account/change_password',
  async (passwords: { currentPassword: string; newPassword: string }) => {
    const response = await axios.post(`${API_URL}/change-password`, passwords);
    return response.data;
  },
);

// Update avatar - Matches PUT /api/account/avatar
export const updateAvatar = createAsyncThunk('account/update_avatar', async (imageUrl: string) => {
  const response = await axios.put<{ url: string }>(`${API_URL}/avatar`, { imageUrl });
  return response.data;
});

// Lock account - Matches POST /api/account/lock
export const lockAccount = createAsyncThunk('account/lock', async () => {
  const response = await axios.post(`${API_URL}/lock`);
  return response.data;
});

// Unlock account - Matches POST /api/account/unlock
export const unlockAccount = createAsyncThunk('account/unlock', async () => {
  const response = await axios.post(`${API_URL}/unlock`);
  return response.data;
});

// ==================== AUTHENTICATION APIs ====================

// Login with captcha - Matches POST /api/authenticate
export const authenticate = createAsyncThunk(
  'account/authenticate',
  async (credentials: { username: string; password: string; rememberMe?: boolean; captchaId?: string; captchaValue?: string }) => {
    const response = await axios.post<{ id_token: string }>('/api/authenticate', credentials);
    return response.data;
  },
);

// Register new account - Matches POST /api/register
export const register = createAsyncThunk(
  'account/register',
  async (user: { login: string; email: string; password: string; firstName?: string; lastName?: string; langKey?: string }) => {
    const response = await axios.post<void>('/api/register', user);
    return response.data;
  },
);

// Activate account - Matches GET /api/activate?key=xxx
export const activateAccount = createAsyncThunk('account/activate', async (key: string) => {
  const response = await axios.get<void>(`/api/activate`, {
    params: { key },
  });
  return response.data;
});

// ==================== PASSWORD RESET APIs ====================

// Request password reset - Matches POST /api/account/reset-password/init
export const requestPasswordReset = createAsyncThunk('account/reset_password_init', async (email: string) => {
  const response = await axios.post<void>(`${API_URL}/reset-password/init`, email, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
  return response.data;
});

// Finish password reset - Matches POST /api/account/reset-password/finish
export const finishPasswordReset = createAsyncThunk('account/reset_password_finish', async (data: { key: string; newPassword: string }) => {
  const response = await axios.post<void>(`${API_URL}/reset-password/finish`, data);
  return response.data;
});

// ==================== PUBLIC USER APIs ====================

// Get public users list - Matches GET /api/users
export const getPublicUsers = createAsyncThunk(
  'account/fetch_public_users',
  async (params?: { page?: number; size?: number; sort?: string }) => {
    const response = await axios.get<IUser[]>('/api/users', {
      params: {
        page: params?.page || 0,
        size: params?.size || 20,
        sort: params?.sort || 'id,asc',
      },
    });
    return response.data;
  },
);

// Get public user by login - Matches GET /api/users/{login}
export const getPublicUser = createAsyncThunk('account/fetch_public_user', async (login: string) => {
  const response = await axios.get<IUser>(`/api/users/${login}`);
  return response.data;
});
