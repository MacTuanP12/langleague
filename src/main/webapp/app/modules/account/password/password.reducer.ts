import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null,
  successMessage: null,
  updateSuccess: false,
  updateFailure: false,
};

export type PasswordState = Readonly<typeof initialState>;

const apiUrl = 'api/account';

interface IPassword {
  currentPassword: string;
  newPassword: string;
}

interface JHipsterErrorResponse {
  errorKey?: string;
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
}

// Actions

export const savePassword = createAsyncThunk(
  'password/update_password',
  async (password: IPassword) => axios.post(`${apiUrl}/change-password`, password),
  {
    serializeError(error) {
      const axiosError = serializeAxiosError(error);
      // Extract custom error message from JHipster's problem details
      const errorResponse = (axiosError as AxiosError)?.response?.data as JHipsterErrorResponse;

      // Handle specific invalid-password error type from Spring Security/JHipster
      if (errorResponse?.type?.includes('invalid-password')) {
        // Use errorKey to map to proper translation: error.invalidpassword
        return { ...axiosError, message: errorResponse.errorKey ? `error.${errorResponse.errorKey}` : 'error.invalidpassword' };
      }

      if (errorResponse?.errorKey) {
        return { ...axiosError, message: `error.${errorResponse.errorKey}` };
      }
      return axiosError;
    },
  },
);

export const PasswordSlice = createSlice({
  name: 'password',
  initialState: initialState as PasswordState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(savePassword.pending, state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addCase(savePassword.rejected, (state, action) => {
        state.loading = false;
        state.updateSuccess = false;
        state.updateFailure = true;
        state.errorMessage = action.error.message || 'password.messages.error';
      })
      .addCase(savePassword.fulfilled, state => {
        state.loading = false;
        state.updateSuccess = true;
        state.updateFailure = false;
        state.successMessage = 'password.messages.success';
      });
  },
});

export const { reset } = PasswordSlice.actions;

// Reducer
export default PasswordSlice.reducer;
