import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Storage } from 'react-jhipster';
import { getSession } from 'app/shared/reducers/authentication';
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

export const updateAccount = createAsyncThunk('settings/update_account', async (account: IUser) => axios.post<IUser>(apiUrl, account), {
  serializeError: serializeAxiosError,
});

export const saveAccountSettings = createAsyncThunk(
  'settings/save_account_settings',
  async (account: IUser, { dispatch }) => {
    await dispatch(updateAccount(account)).unwrap();

    if (Storage.session.get(`locale`)) {
      Storage.session.remove(`locale`);
    }

    dispatch(getSession());
    return account;
  },
  {
    serializeError: serializeAxiosError,
  },
);

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
      .addCase(saveAccountSettings.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updateFailure = false;
      })
      .addCase(saveAccountSettings.rejected, (state, action) => {
        state.loading = false;
        state.updateFailure = true;
        state.errorMessage = action.error.message;
      })
      .addCase(saveAccountSettings.fulfilled, state => {
        state.loading = false;
        state.updateSuccess = true;
        state.updateFailure = false;
        state.successMessage = 'settings.messages.success';
      })
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
