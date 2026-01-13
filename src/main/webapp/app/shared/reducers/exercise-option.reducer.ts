import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IExerciseOption } from 'app/shared/model/exercise-option.model';

interface ExerciseOptionState {
  exerciseOptions: { [exerciseId: number]: IExerciseOption[] };
  loading: boolean;
  updating: boolean;
  errorMessage: string | null;
}

const initialState: ExerciseOptionState = {
  exerciseOptions: {},
  loading: false,
  updating: false,
  errorMessage: null,
};

// Async thunks
export const fetchExerciseOptions = createAsyncThunk('exerciseOption/fetchByExercise', async (exerciseId: number) => {
  const response = await axios.get<IExerciseOption[]>(`/api/exercises/${exerciseId}/options`);
  return { exerciseId, options: response.data };
});

export const fetchExerciseOptionById = createAsyncThunk('exerciseOption/fetchById', async (id: number) => {
  const response = await axios.get<IExerciseOption>(`/api/exercise-options/${id}`);
  return response.data;
});

export const createExerciseOption = createAsyncThunk('exerciseOption/create', async (option: IExerciseOption) => {
  const response = await axios.post<IExerciseOption>('/api/exercise-options', option);
  return response.data;
});

export const updateExerciseOption = createAsyncThunk('exerciseOption/update', async (option: IExerciseOption) => {
  const response = await axios.put<IExerciseOption>(`/api/exercise-options/${option.id}`, option);
  return response.data;
});

export const deleteExerciseOption = createAsyncThunk(
  'exerciseOption/delete',
  async ({ exerciseId, optionId }: { exerciseId: number; optionId: number }) => {
    await axios.delete(`/api/exercise-options/${optionId}`);
    return { exerciseId, optionId };
  },
);

export const bulkCreateExerciseOptions = createAsyncThunk(
  'exerciseOption/bulkCreate',
  async ({ exerciseId, options }: { exerciseId: number; options: IExerciseOption[] }) => {
    const response = await axios.post<IExerciseOption[]>(`/api/exercises/${exerciseId}/options/bulk`, options);
    return { exerciseId, options: response.data };
  },
);

export const bulkUpdateExerciseOptions = createAsyncThunk(
  'exerciseOption/bulkUpdate',
  async ({ exerciseId, options }: { exerciseId: number; options: IExerciseOption[] }) => {
    const response = await axios.put<IExerciseOption[]>(`/api/exercises/${exerciseId}/options/bulk`, options);
    return { exerciseId, options: response.data };
  },
);

// Slice
const exerciseOptionSlice = createSlice({
  name: 'exerciseOption',
  initialState,
  reducers: {
    reset: () => initialState,
    clearExerciseOptions(state, action: PayloadAction<number>) {
      delete state.exerciseOptions[action.payload];
    },
  },
  extraReducers(builder) {
    builder
      // fetchExerciseOptions
      .addCase(fetchExerciseOptions.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchExerciseOptions.fulfilled, (state, action: PayloadAction<{ exerciseId: number; options: IExerciseOption[] }>) => {
        state.loading = false;
        state.exerciseOptions[action.payload.exerciseId] = action.payload.options;
      })
      .addCase(fetchExerciseOptions.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch exercise options';
      })
      // createExerciseOption
      .addCase(createExerciseOption.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createExerciseOption.fulfilled, (state, action: PayloadAction<IExerciseOption>) => {
        state.updating = false;
        const exerciseId = action.payload.exerciseId;
        if (exerciseId) {
          if (!state.exerciseOptions[exerciseId]) {
            state.exerciseOptions[exerciseId] = [];
          }
          state.exerciseOptions[exerciseId].push(action.payload);
        }
      })
      .addCase(createExerciseOption.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create exercise option';
      })
      // updateExerciseOption
      .addCase(updateExerciseOption.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateExerciseOption.fulfilled, (state, action: PayloadAction<IExerciseOption>) => {
        state.updating = false;
        const exerciseId = action.payload.exerciseId;
        if (exerciseId && state.exerciseOptions[exerciseId]) {
          const index = state.exerciseOptions[exerciseId].findIndex(opt => opt.id === action.payload.id);
          if (index !== -1) {
            state.exerciseOptions[exerciseId][index] = action.payload;
          }
        }
      })
      .addCase(updateExerciseOption.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update exercise option';
      })
      // deleteExerciseOption
      .addCase(deleteExerciseOption.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteExerciseOption.fulfilled, (state, action: PayloadAction<{ exerciseId: number; optionId: number }>) => {
        state.updating = false;
        const { exerciseId, optionId } = action.payload;
        if (state.exerciseOptions[exerciseId]) {
          state.exerciseOptions[exerciseId] = state.exerciseOptions[exerciseId].filter(opt => opt.id !== optionId);
        }
      })
      .addCase(deleteExerciseOption.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete exercise option';
      })
      // bulkCreateExerciseOptions
      .addCase(bulkCreateExerciseOptions.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(bulkCreateExerciseOptions.fulfilled, (state, action: PayloadAction<{ exerciseId: number; options: IExerciseOption[] }>) => {
        state.updating = false;
        state.exerciseOptions[action.payload.exerciseId] = action.payload.options;
      })
      .addCase(bulkCreateExerciseOptions.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to bulk create exercise options';
      })
      // bulkUpdateExerciseOptions
      .addCase(bulkUpdateExerciseOptions.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(bulkUpdateExerciseOptions.fulfilled, (state, action: PayloadAction<{ exerciseId: number; options: IExerciseOption[] }>) => {
        state.updating = false;
        state.exerciseOptions[action.payload.exerciseId] = action.payload.options;
      })
      .addCase(bulkUpdateExerciseOptions.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to bulk update exercise options';
      });
  },
});

export const { reset, clearExerciseOptions } = exerciseOptionSlice.actions;

export default exerciseOptionSlice.reducer;
