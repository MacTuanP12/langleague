import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser } from 'app/shared/model/user.model';
import { IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';

interface UserManagementState {
  users: IUser[];
  user: IUser | null;
  loading: boolean;
  updating: boolean;
  errorMessage: string | null;
  totalItems: number;
}

const initialState: UserManagementState = {
  users: [],
  user: null,
  loading: false,
  updating: false,
  errorMessage: null,
  totalItems: 0,
};

const apiUrl = 'api/admin/users';

export interface IUserQueryParams extends IQueryParams {
  login?: string;
  role?: string;
  status?: string;
}

// Async thunks
export const getUsersAsAdmin = createAsyncThunk(
  'userManagement/fetchAll',
  async ({ page = 0, size = 10, sort = 'id,asc', login, role, status }: IUserQueryParams) => {
    let requestUrl = `${apiUrl}?page=${page}&size=${size}&sort=${sort}`;
    if (login) {
      requestUrl += `&login=${login}`;
    }
    if (role && role !== 'all') {
      requestUrl += `&role=${role}`;
    }
    if (status && status !== 'all') {
      requestUrl += `&status=${status}`;
    }
    return axios.get<IUser[]>(requestUrl);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const getUser = createAsyncThunk(
  'userManagement/fetch',
  async (login: string) => {
    const requestUrl = `${apiUrl}/${login}`;
    const response = await axios.get<IUser>(requestUrl);
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const createUser = createAsyncThunk(
  'userManagement/create',
  async (user: IUser, thunkAPI) => {
    const response = await axios.post<IUser>(apiUrl, user);
    thunkAPI.dispatch(getUsersAsAdmin({ page: 0, size: 10, sort: 'id,asc' }));
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const updateUser = createAsyncThunk(
  'userManagement/update',
  async (user: IUser, thunkAPI) => {
    const response = await axios.put<IUser>(apiUrl, user);
    thunkAPI.dispatch(getUsersAsAdmin({ page: 0, size: 10, sort: 'id,asc' }));
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteUser = createAsyncThunk(
  'userManagement/delete',
  async (login: string, thunkAPI) => {
    const requestUrl = `${apiUrl}/${login}`;
    const response = await axios.delete<IUser>(requestUrl);
    thunkAPI.dispatch(getUsersAsAdmin({ page: 0, size: 10, sort: 'id,asc' }));
    return response.data;
  },
  {
    serializeError: serializeAxiosError,
  },
);

// Slice
const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getUsersAsAdmin.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getUsersAsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalItems = parseInt(action.payload.headers['x-total-count'], 10);
      })
      .addCase(getUsersAsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getUser.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(createUser.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createUser.fulfilled, state => {
        state.updating = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message;
      })
      .addCase(updateUser.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateUser.fulfilled, state => {
        state.updating = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message;
      })
      .addCase(deleteUser.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteUser.fulfilled, state => {
        state.updating = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset } = userManagementSlice.actions;

export default userManagementSlice.reducer;
