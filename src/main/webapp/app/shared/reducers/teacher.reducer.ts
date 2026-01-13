import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface TeacherStats {
  totalBooks: number;
  totalStudents: number;
  averageScore: number;
  bookStats: {
    bookTitle: string;
    enrollmentCount: number;
  }[];
}

export interface StudentDTO {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  bookTitle: string;
  enrollmentDate: string;
  status: string;
}

interface TeacherState {
  stats: TeacherStats;
  students: StudentDTO[];
  loading: boolean;
  errorMessage: string | null;
}

const initialState: TeacherState = {
  stats: {
    totalBooks: 0,
    totalStudents: 0,
    averageScore: 0,
    bookStats: [],
  },
  students: [],
  loading: false,
  errorMessage: null,
};

// Async thunks
export const fetchTeacherStats = createAsyncThunk('teacher/fetchStats', async () => {
  const response = await axios.get<TeacherStats>('/api/teacher/analytics/dashboard');
  return response.data;
});

export const fetchMyStudents = createAsyncThunk('teacher/fetchMyStudents', async () => {
  const response = await axios.get<StudentDTO[]>('/api/teacher/analytics/students');
  return response.data;
});

// Slice
const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      // fetchTeacherStats
      .addCase(fetchTeacherStats.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchTeacherStats.fulfilled, (state, action: PayloadAction<TeacherStats>) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTeacherStats.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch teacher stats';
      })
      // fetchMyStudents
      .addCase(fetchMyStudents.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchMyStudents.fulfilled, (state, action: PayloadAction<StudentDTO[]>) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchMyStudents.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch students';
      });
  },
});

export const { reset } = teacherSlice.actions;

export default teacherSlice.reducer;
