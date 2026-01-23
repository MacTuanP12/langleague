import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null as string | null,
  totalBooks: 0,
  totalEnrollments: 0,
  completionRate: 0,
};

export type AdminDashboardState = Readonly<typeof initialState>;

// Actions

export const countAllBooks = createAsyncThunk(
  'adminDashboard/count_all_books',
  async () => {
    const requestUrl = 'api/books/count';
    return axios.get<number>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const countAllEnrollments = createAsyncThunk(
  'adminDashboard/count_all_enrollments',
  async () => {
    const requestUrl = 'api/enrollments/count';
    return axios.get<number>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getSystemCompletionRate = createAsyncThunk(
  'adminDashboard/get_system_completion_rate',
  async () => {
    const requestUrl = 'api/progresses/stats/completion-rate';
    return axios.get<number>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const AdminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(countAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.totalBooks = action.payload.data;
      })
      .addCase(countAllEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.totalEnrollments = action.payload.data;
      })
      .addCase(getSystemCompletionRate.fulfilled, (state, action) => {
        state.loading = false;
        state.completionRate = action.payload.data;
      })
      .addMatcher(isPending(countAllBooks, countAllEnrollments, getSystemCompletionRate), state => {
        state.errorMessage = null;
        state.loading = true;
      })
      .addMatcher(isRejected(countAllBooks, countAllEnrollments, getSystemCompletionRate), (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset } = AdminDashboardSlice.actions;

export default AdminDashboardSlice.reducer;
