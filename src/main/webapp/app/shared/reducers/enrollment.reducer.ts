import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IEnrollment } from 'app/shared/model/enrollment.model';

interface EnrollmentState {
  enrollments: IEnrollment[];
  selectedEnrollment: IEnrollment | null;
  loading: boolean;
  updating: boolean;
  errorMessage: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  selectedEnrollment: null,
  loading: false,
  updating: false,
  errorMessage: null,
};

// Async thunks
export const fetchMyEnrollments = createAsyncThunk('enrollment/fetchMyEnrollments', async () => {
  const response = await axios.get<IEnrollment[]>('/api/enrollments?filter=my-books');
  return response.data;
});

export const fetchEnrollmentByBookId = createAsyncThunk('enrollment/fetchEnrollmentByBookId', async (bookId: number | string) => {
  const response = await axios.get<IEnrollment>(`/api/enrollments/book/${bookId}`);
  return response.data;
});

export const createEnrollment = createAsyncThunk('enrollment/createEnrollment', async (data: { bookId: number; userId?: number }) => {
  const response = await axios.post<IEnrollment>('/api/enrollments', data);
  return response.data;
});

export const enrollInBook = createAsyncThunk('enrollment/enrollInBook', async (bookId: number) => {
  const response = await axios.post<IEnrollment>(`/api/enrollments/enroll/${bookId}`);
  return response.data;
});

export const deleteEnrollment = createAsyncThunk('enrollment/deleteEnrollment', async (id: number) => {
  await axios.delete(`/api/enrollments/${id}`);
  return id;
});

// Slice
const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    reset: () => initialState,
    clearSelectedEnrollment(state) {
      state.selectedEnrollment = null;
    },
  },
  extraReducers(builder) {
    builder
      // fetchMyEnrollments
      .addCase(fetchMyEnrollments.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action: PayloadAction<IEnrollment[]>) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch enrollments';
      })
      // fetchEnrollmentByBookId
      .addCase(fetchEnrollmentByBookId.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchEnrollmentByBookId.fulfilled, (state, action: PayloadAction<IEnrollment>) => {
        state.loading = false;
        state.selectedEnrollment = action.payload;
      })
      .addCase(fetchEnrollmentByBookId.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch enrollment';
        state.selectedEnrollment = null;
      })
      // createEnrollment
      .addCase(createEnrollment.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createEnrollment.fulfilled, (state, action: PayloadAction<IEnrollment>) => {
        state.updating = false;
        state.enrollments.push(action.payload);
        state.selectedEnrollment = action.payload;
      })
      .addCase(createEnrollment.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create enrollment';
      })
      // enrollInBook
      .addCase(enrollInBook.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(enrollInBook.fulfilled, (state, action: PayloadAction<IEnrollment>) => {
        state.updating = false;
        state.selectedEnrollment = action.payload;
        // Optionally add to enrollments list if needed
        if (!state.enrollments.find(e => e.id === action.payload.id)) {
          state.enrollments.push(action.payload);
        }
      })
      .addCase(enrollInBook.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to enroll in book';
      })
      // deleteEnrollment
      .addCase(deleteEnrollment.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteEnrollment.fulfilled, (state, action: PayloadAction<number>) => {
        state.updating = false;
        state.enrollments = state.enrollments.filter(enrollment => enrollment.id !== action.payload);
      })
      .addCase(deleteEnrollment.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete enrollment';
      });
  },
});

export const { reset, clearSelectedEnrollment } = enrollmentSlice.actions;

export default enrollmentSlice.reducer;
