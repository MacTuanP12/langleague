import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface IUser {
  id?: string;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: string[];
  createdDate?: string;
}

export interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  loginSuccess: boolean;
  loginError: boolean;
  account: IUser;
  errorMessage: string | null;
  redirectMessage: string | null;
  sessionHasBeenFetched: boolean;
  logoutUrl: string | null;
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false,
  account: {} as IUser,
  errorMessage: null,
  redirectMessage: null,
  sessionHasBeenFetched: false,
  logoutUrl: null,
};

// Async actions
export const getSession = createAsyncThunk('authentication/get_session', async () => {
  const response = await axios.get<IUser>('/api/account');
  return response.data;
});

export const login = createAsyncThunk(
  'authentication/login',
  async (credentials: { username: string; password: string; rememberMe?: boolean }) => {
    const response = await axios.post('/api/authenticate', credentials);
    return response.data;
  },
);

export const logout = createAsyncThunk('authentication/logout', async () => {
  await axios.post('/api/logout', {});
});

// Slice
const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    logoutSession(state) {
      state.isAuthenticated = false;
      state.loading = false;
      state.account = {} as IUser;
    },
    clearAuth(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.loginSuccess = false;
      state.loginError = false;
      state.errorMessage = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getSession.pending, state => {
        state.loading = true;
      })
      .addCase(getSession.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.sessionHasBeenFetched = true;
        state.account = action.payload;
      })
      .addCase(getSession.rejected, state => {
        state.loading = false;
        state.isAuthenticated = false;
        state.sessionHasBeenFetched = true;
      })
      .addCase(login.pending, state => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.loginSuccess = true;
        state.loginError = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.loginError = true;
        state.errorMessage = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, state => {
        state.isAuthenticated = false;
        state.loading = false;
        state.account = {} as IUser;
      });
  },
});

export const { logoutSession, clearAuth } = authSlice.actions;

export default authSlice.reducer;
