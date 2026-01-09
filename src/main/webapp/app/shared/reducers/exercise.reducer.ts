import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IExercise } from 'app/shared/model/exercise.model';
import { IExerciseOption } from 'app/shared/model/exercise-option.model';

interface ExerciseState {
  exercises: IExercise[];
  exerciseOptions: { [exerciseId: number]: IExerciseOption[] };
  loading: boolean;
  updating: boolean;
  errorMessage: string | null;
}

const initialState: ExerciseState = {
  exercises: [],
  exerciseOptions: {},
  loading: false,
  updating: false,
  errorMessage: null,
};

// Async thunks
export const fetchExercisesByUnitId = createAsyncThunk('exercise/fetchByUnitId', async (unitId: number | string) => {
  const response = await axios.get<IExercise[]>(`/api/units/${unitId}/exercises`);
  return response.data;
});

export const fetchExerciseOptions = createAsyncThunk('exercise/fetchOptions', async (exerciseId: number) => {
  const response = await axios.get<IExerciseOption[]>(`/api/exercises/${exerciseId}/options`);
  return { exerciseId, options: response.data };
});

export const fetchExercisesWithOptions = createAsyncThunk('exercise/fetchWithOptions', async (unitId: number | string) => {
  const exercisesResponse = await axios.get<IExercise[]>(`/api/units/${unitId}/exercises`);
  const exercises = exercisesResponse.data;

  const optionsMap: { [exerciseId: number]: IExerciseOption[] } = {};
  for (const exercise of exercises) {
    if (exercise.id) {
      try {
        const optionsResponse = await axios.get<IExerciseOption[]>(`/api/exercises/${exercise.id}/options`);
        optionsMap[exercise.id] = optionsResponse.data;
      } catch (error) {
        console.error(`Failed to fetch options for exercise ${exercise.id}`, error);
        optionsMap[exercise.id] = [];
      }
    }
  }

  return { exercises, optionsMap };
});

export const createExercise = createAsyncThunk('exercise/create', async (exercise: IExercise) => {
  const response = await axios.post<IExercise>('/api/exercises', exercise);
  return response.data;
});

export const updateExercise = createAsyncThunk('exercise/update', async (exercise: IExercise) => {
  const response = await axios.put<IExercise>(`/api/exercises/${exercise.id}`, exercise);
  return response.data;
});

export const deleteExercise = createAsyncThunk('exercise/delete', async (id: number) => {
  await axios.delete(`/api/exercises/${id}`);
  return id;
});

export const createExerciseOption = createAsyncThunk('exercise/createOption', async (option: IExerciseOption) => {
  const response = await axios.post<IExerciseOption>('/api/exercise-options', option);
  return response.data;
});

export const updateExerciseOption = createAsyncThunk('exercise/updateOption', async (option: IExerciseOption) => {
  const response = await axios.put<IExerciseOption>(`/api/exercise-options/${option.id}`, option);
  return response.data;
});

export const deleteExerciseOption = createAsyncThunk('exercise/deleteOption', async ({ exerciseId, optionId }: { exerciseId: number; optionId: number }) => {
  await axios.delete(`/api/exercise-options/${optionId}`);
  return { exerciseId, optionId };
});

export const bulkCreateExercises = createAsyncThunk('exercise/bulkCreate', async (exercises: IExercise[]) => {
  const response = await axios.post<IExercise[]>('/api/exercises/bulk', exercises);
  return response.data;
});

export const bulkUpdateExercises = createAsyncThunk('exercise/bulkUpdate', async (exercises: IExercise[]) => {
  const response = await axios.put<IExercise[]>('/api/exercises/bulk', exercises);
  return response.data;
});

// Slice
const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      // fetchExercisesByUnitId
      .addCase(fetchExercisesByUnitId.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchExercisesByUnitId.fulfilled, (state, action: PayloadAction<IExercise[]>) => {
        state.loading = false;
        state.exercises = action.payload;
      })
      .addCase(fetchExercisesByUnitId.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch exercises';
      })
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
      // fetchExercisesWithOptions
      .addCase(fetchExercisesWithOptions.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchExercisesWithOptions.fulfilled, (state, action: PayloadAction<{ exercises: IExercise[]; optionsMap: { [exerciseId: number]: IExerciseOption[] } }>) => {
        state.loading = false;
        state.exercises = action.payload.exercises;
        state.exerciseOptions = action.payload.optionsMap;
      })
      .addCase(fetchExercisesWithOptions.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch exercises with options';
      })
      // createExercise
      .addCase(createExercise.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createExercise.fulfilled, (state, action: PayloadAction<IExercise>) => {
        state.updating = false;
        state.exercises.push(action.payload);
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create exercise';
      })
      // updateExercise
      .addCase(updateExercise.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateExercise.fulfilled, (state, action: PayloadAction<IExercise>) => {
        state.updating = false;
        const index = state.exercises.findIndex(ex => ex.id === action.payload.id);
        if (index !== -1) {
          state.exercises[index] = action.payload;
        }
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update exercise';
      })
      // deleteExercise
      .addCase(deleteExercise.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteExercise.fulfilled, (state, action: PayloadAction<number>) => {
        state.updating = false;
        state.exercises = state.exercises.filter(ex => ex.id !== action.payload);
        delete state.exerciseOptions[action.payload];
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete exercise';
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
      // bulkCreateExercises
      .addCase(bulkCreateExercises.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(bulkCreateExercises.fulfilled, (state, action: PayloadAction<IExercise[]>) => {
        state.updating = false;
        state.exercises = [...state.exercises, ...action.payload];
      })
      .addCase(bulkCreateExercises.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to bulk create exercises';
      })
      // bulkUpdateExercises
      .addCase(bulkUpdateExercises.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(bulkUpdateExercises.fulfilled, (state, action: PayloadAction<IExercise[]>) => {
        state.updating = false;
        state.exercises = action.payload;
      })
      .addCase(bulkUpdateExercises.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to bulk update exercises';
      });
  },
});

export const { reset } = exerciseSlice.actions;

export default exerciseSlice.reducer;

