import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IProgress } from 'app/shared/model/progress.model';

interface ProgressState {
  progresses: IProgress[];
  userProgresses: IProgress[];
  loading: boolean;
  updating: boolean;
  errorMessage: string | null;
}

const initialState: ProgressState = {
  progresses: [],
  userProgresses: [],
  loading: false,
  updating: false,
  errorMessage: null,
};

// Async thunks

export const fetchProgressByUserAndUnit = createAsyncThunk(
  'progress/fetchByUserAndUnit',
  async ({ userProfileId, unitId }: { userProfileId: number; unitId: number }) => {
    // Use the dedicated endpoint for fetching by user and unit
    const response = await axios.get<IProgress>(`/api/progresses/user/${userProfileId}/unit/${unitId}`);
    return response.data;
  },
);

export const fetchProgressesByUser = createAsyncThunk('progress/fetchByUser', async (userProfileId: number) => {
  // Use the dedicated endpoint for fetching by user
  const response = await axios.get<IProgress[]>(`/api/progresses/user/${userProfileId}`);
  return response.data;
});

export const fetchProgressesByUnit = createAsyncThunk('progress/fetchByUnit', async (unitId: number) => {
  // Use the dedicated endpoint for fetching by unit
  const response = await axios.get<IProgress[]>(`/api/progresses/unit/${unitId}`);
  return response.data;
});

export const fetchMyProgresses = createAsyncThunk('progress/fetchMy', async () => {
  // Use the secure endpoint that returns only the current user's progresses
  const response = await axios.get<IProgress[]>('/api/progresses/my-progresses');
  return response.data;
});

export const fetchMyProgressByUnit = createAsyncThunk('progress/fetchMyByUnit', async (unitId: number) => {
  // Use the secure endpoint that returns only the current user's progress for a specific unit
  const response = await axios.get<IProgress>(`/api/progresses/my-progresses/unit/${unitId}`);
  return response.data;
});

export const createProgress = createAsyncThunk('progress/create', async (progress: IProgress) => {
  const response = await axios.post<IProgress>('/api/progresses', progress);
  return response.data;
});

export const updateProgress = createAsyncThunk('progress/update', async (progress: IProgress) => {
  const response = await axios.put<IProgress>(`/api/progresses/${progress.id}`, progress);
  return response.data;
});

export const markUnitComplete = createAsyncThunk('progress/markComplete', async (unitId: number) => {
  // Use the dedicated endpoint that handles completion logic on the backend
  const response = await axios.post<IProgress>(`/api/progresses/complete-unit/${unitId}`);
  return response.data;
});

export const deleteProgress = createAsyncThunk('progress/delete', async (id: number) => {
  await axios.delete(`/api/progresses/${id}`);
  return id;
});

// Slice
const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    reset: () => initialState,
    clearProgresses(state) {
      state.progresses = [];
    },
    // Optimistic update for better UX - updates UI immediately
    updateProgressOptimistic(state, action: PayloadAction<Partial<IProgress> & { id: number }>) {
      const { id, ...updates } = action.payload;

      // Update in progresses array
      const index = state.progresses.findIndex(p => p.id === id);
      if (index !== -1) {
        state.progresses[index] = { ...state.progresses[index], ...updates };
      }

      // Update in userProgresses array
      const userIndex = state.userProgresses.findIndex(p => p.id === id);
      if (userIndex !== -1) {
        state.userProgresses[userIndex] = { ...state.userProgresses[userIndex], ...updates };
      }
    },
  },
  extraReducers(builder) {
    builder
      // fetchProgressByUserAndUnit
      .addCase(fetchProgressByUserAndUnit.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchProgressByUserAndUnit.fulfilled, (state, action: PayloadAction<IProgress>) => {
        state.loading = false;
        const existingIndex = state.progresses.findIndex(p => p.id === action.payload.id);
        if (existingIndex !== -1) {
          state.progresses[existingIndex] = action.payload;
        } else {
          state.progresses.push(action.payload);
        }
      })
      .addCase(fetchProgressByUserAndUnit.rejected, (state, action) => {
        state.loading = false;
        // Don't set error for not found in this context
      })
      // fetchProgressesByUser
      .addCase(fetchProgressesByUser.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchProgressesByUser.fulfilled, (state, action: PayloadAction<IProgress[]>) => {
        state.loading = false;
        state.progresses = action.payload;
      })
      .addCase(fetchProgressesByUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch progresses';
      })
      // fetchProgressesByUnit
      .addCase(fetchProgressesByUnit.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchProgressesByUnit.fulfilled, (state, action: PayloadAction<IProgress[]>) => {
        state.loading = false;
        state.progresses = action.payload;
      })
      .addCase(fetchProgressesByUnit.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch progresses';
      })
      // fetchMyProgresses
      .addCase(fetchMyProgresses.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchMyProgresses.fulfilled, (state, action: PayloadAction<IProgress[]>) => {
        state.loading = false;
        state.userProgresses = action.payload;
      })
      .addCase(fetchMyProgresses.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch my progresses';
      })
      // fetchMyProgressByUnit
      .addCase(fetchMyProgressByUnit.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchMyProgressByUnit.fulfilled, (state, action: PayloadAction<IProgress>) => {
        state.loading = false;
        const existingIndex = state.userProgresses.findIndex(p => p.id === action.payload.id);
        if (existingIndex !== -1) {
          state.userProgresses[existingIndex] = action.payload;
        } else {
          state.userProgresses.push(action.payload);
        }
      })
      .addCase(fetchMyProgressByUnit.rejected, (state, action) => {
        state.loading = false;
        // Don't set error for not found
      })
      // createProgress
      .addCase(createProgress.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createProgress.fulfilled, (state, action: PayloadAction<IProgress>) => {
        state.updating = false;
        state.progresses.push(action.payload);
        state.userProgresses.push(action.payload);
      })
      .addCase(createProgress.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create progress';
      })
      // updateProgress
      .addCase(updateProgress.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateProgress.fulfilled, (state, action: PayloadAction<IProgress>) => {
        state.updating = false;
        const index = state.progresses.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.progresses[index] = action.payload;
        }
        const userIndex = state.userProgresses.findIndex(p => p.id === action.payload.id);
        if (userIndex !== -1) {
          state.userProgresses[userIndex] = action.payload;
        }
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update progress';
      })
      // markUnitComplete
      .addCase(markUnitComplete.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(markUnitComplete.fulfilled, (state, action: PayloadAction<IProgress>) => {
        state.updating = false;
        const index = state.progresses.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.progresses[index] = action.payload;
        } else {
          state.progresses.push(action.payload);
        }
        const userIndex = state.userProgresses.findIndex(p => p.id === action.payload.id);
        if (userIndex !== -1) {
          state.userProgresses[userIndex] = action.payload;
        } else {
          state.userProgresses.push(action.payload);
        }
      })
      .addCase(markUnitComplete.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to mark unit as complete';
      })
      // deleteProgress
      .addCase(deleteProgress.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteProgress.fulfilled, (state, action: PayloadAction<number>) => {
        state.updating = false;
        state.progresses = state.progresses.filter(p => p.id !== action.payload);
        state.userProgresses = state.userProgresses.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProgress.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete progress';
      });
  },
});

export const { reset, clearProgresses, updateProgressOptimistic } = progressSlice.actions;

export default progressSlice.reducer;
