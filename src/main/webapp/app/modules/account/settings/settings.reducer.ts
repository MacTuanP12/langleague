import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Storage } from 'react-jhipster';
import { getSession } from 'app/shared/reducers/authentication';
import { AppThunk } from 'app/config/store';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IUser } from 'app/shared/model/user.model';

const initialState = {
  loading: false,
  errorMessage: null,
  successMessage: null,
  updateSuccess: false,
  updateFailure: false,
  avatarUploading: false,
};

export type SettingsState = Readonly<typeof initialState>;

// Actions
const apiUrl = 'api/account';

export const saveAccountSettings: (account: IUser) => AppThunk = account => async dispatch => {
  await dispatch(updateAccount(account));

  if (Storage.session.get(`locale`)) {
    Storage.session.remove(`locale`);
  }

  dispatch(getSession());
};

export const updateAccount = createAsyncThunk('settings/update_account', async (account: IUser) => axios.post<IUser>(apiUrl, account), {
  serializeError: serializeAxiosError,
});

export const uploadAvatar = createAsyncThunk(
  'settings/upload_avatar',
  async (imageUrl: string) => {
    const response = await axios.post<IUser>(`${apiUrl}/avatar`, imageUrl, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const SettingsSlice = createSlice({
  name: 'settings',
  initialState: initialState as SettingsState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(updateAccount.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.updateSuccess = false;
      })
      .addCase(updateAccount.rejected, state => {
        state.loading = false;
        state.updateSuccess = false;
        state.updateFailure = true;
      })
      .addCase(updateAccount.fulfilled, state => {
        state.loading = false;
        state.updateSuccess = true;
        state.updateFailure = false;
        state.successMessage = 'settings.messages.success';
      })
      .addCase(uploadAvatar.pending, state => {
        state.avatarUploading = true;
        state.errorMessage = null;
      })
      .addCase(uploadAvatar.rejected, state => {
        state.avatarUploading = false;
        state.updateFailure = true;
        state.errorMessage = 'settings.messages.avatarUploadError';
      })
      .addCase(uploadAvatar.fulfilled, state => {
        state.avatarUploading = false;
        state.updateSuccess = true;
        state.successMessage = 'settings.messages.avatarUploadSuccess';
      });
  },
});

export const { reset } = SettingsSlice.actions;

// Reducer
export default SettingsSlice.reducer;
