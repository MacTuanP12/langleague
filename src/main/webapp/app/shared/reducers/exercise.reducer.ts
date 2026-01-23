import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IExercise } from 'app/shared/model/exercise.model';
import { IExerciseOption } from 'app/shared/model/exercise-option.model';

interface ExerciseState {
  exercises: IExercise[];
  exerciseOptions: { [exerciseId: number]: IExerciseOption[] };
  loading: boolean;
  updating: boolean;
  updateSuccess: boolean;
  errorMessage: string | null;
}

const initialState: ExerciseState = {
  exercises: [],
  exerciseOptions: {},
  loading: false,
  updating: false,
  updateSuccess: false,
  errorMessage: null,
};

// Async thunks
export const fetchExercisesByUnitId = createAsyncThunk('exercise/fetchByUnitId', async (unitId: number | string) => {
  // Use the new backend endpoint that returns exercises with options in a single query
  const response = await axios.get<IExercise[]>(`/api/exercises/by-unit/${unitId}`);
  return response.data;
});

/**
 * @deprecated Use fetchExercisesByUnitId instead, which now returns exercises with options included
 */
export const fetchExerciseOptions = createAsyncThunk('exercise/fetchOptions', async (exerciseId: number) => {
  // This endpoint is deprecated but kept for backward compatibility
  const response = await axios.get<IExerciseOption[]>(`/api/exercises/${exerciseId}/options`);
  return { exerciseId, options: response.data };
});

export const fetchExercisesWithOptions = createAsyncThunk('exercise/fetchWithOptions', async (unitId: number | string) => {
  // Use the new optimized endpoint that fetches exercises with options in a single request
  const response = await axios.get<IExercise[]>(`/api/exercises/by-unit/${unitId}`);
  const exercises = response.data;

  const optionsMap: { [exerciseId: number]: IExerciseOption[] } = {};

  for (const exercise of exercises) {
    if (exercise.id && exercise.options) {
      optionsMap[exercise.id] = exercise.options;
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

export const deleteExerciseOption = createAsyncThunk(
  'exercise/deleteOption',
  async ({ exerciseId, optionId }: { exerciseId: number; optionId: number }) => {
    await axios.delete(`/api/exercise-options/${optionId}`);
    return { exerciseId, optionId };
  },
);

export const bulkCreateExercises = createAsyncThunk(
  'exercise/bulkCreate',
  async ({ unitId, exercises }: { unitId: string | number; exercises: IExercise[] }) => {
    // Backend endpoint expects unitId in request body, not in path
    const response = await axios.post<IExercise[]>('/api/exercises/bulk', exercises);
    return response.data;
  },
);

export const bulkUpdateExercises = createAsyncThunk('exercise/bulkUpdate', async (exercises: IExercise[]) => {
  // Use the new bulk update endpoint for better performance
  const response = await axios.put<IExercise[]>('/api/exercises/bulk', exercises);
  return response.data;
});

export const checkAnswer = createAsyncThunk(
  'exercise/checkAnswer',
  async ({ exerciseId, studentAnswer }: { exerciseId: number; studentAnswer: string }, { getState }) => {
    // WORKAROUND: BE missing check endpoint
    // We have to fetch options and check isCorrect flag
    // This assumes we have fetched options already or fetch them now

    // Try to get options from state first
    interface RootState {
      exercise: { exerciseOptions: Record<number, IExerciseOption[]> };
    }
    const state = getState() as RootState;
    let options = state.exercise.exerciseOptions[exerciseId];

    if (!options || options.length === 0) {
      const response = await axios.get<IExerciseOption[]>('/api/exercise-options');
      options = response.data.filter(opt => opt.exercise?.id === exerciseId);
    }

    // Simple check logic (can be extended for multiple choice, text input etc)
    // Assuming studentAnswer is the ID of the selected option for Multiple Choice
    // Or the text value for Fill in Blank

    const correctOption = options.find(opt => opt.isCorrect);

    if (!correctOption) {
      // No correct option defined?
      return 'ERROR: No correct answer defined';
    }

    // Check if answer matches (assuming ID comparison for now as common case)
    // If studentAnswer is text, compare text
    const isCorrect =
      String(correctOption.id) === String(studentAnswer) ||
      correctOption.optionText?.trim().toLowerCase() === studentAnswer.trim().toLowerCase();

    return isCorrect ? 'CORRECT' : 'INCORRECT';
  },
);

// Slice
const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    reset(state) {
      state.loading = false;
      state.updating = false;
      state.updateSuccess = false;
      state.errorMessage = null;
    },
    resetAll(state) {
      state.exercises = [];
      state.exerciseOptions = {};
      state.loading = false;
      state.updating = false;
      state.updateSuccess = false;
      state.errorMessage = null;
    },
  },
  extraReducers(builder) {
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
      .addCase(
        fetchExercisesWithOptions.fulfilled,
        (state, action: PayloadAction<{ exercises: IExercise[]; optionsMap: { [exerciseId: number]: IExerciseOption[] } }>) => {
          state.loading = false;
          state.exercises = action.payload.exercises;
          state.exerciseOptions = action.payload.optionsMap;
        },
      )
      .addCase(fetchExercisesWithOptions.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch exercises with options';
      })
      // createExercise
      .addCase(createExercise.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(createExercise.fulfilled, (state, action: PayloadAction<IExercise>) => {
        state.updating = false;
        state.updateSuccess = true;
        state.exercises.push(action.payload);
        if (action.payload.id && action.payload.options) {
          state.exerciseOptions[action.payload.id] = action.payload.options;
        }
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to create exercise';
      })
      // updateExercise
      .addCase(updateExercise.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(updateExercise.fulfilled, (state, action: PayloadAction<IExercise>) => {
        state.updating = false;
        state.updateSuccess = true;
        const index = state.exercises.findIndex(ex => ex.id === action.payload.id);
        if (index !== -1) {
          state.exercises[index] = action.payload;
        }
        if (action.payload.id && action.payload.options) {
          state.exerciseOptions[action.payload.id] = action.payload.options;
        }
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to update exercise';
      })
      // deleteExercise
      .addCase(deleteExercise.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(deleteExercise.fulfilled, (state, action: PayloadAction<number>) => {
        state.updating = false;
        state.updateSuccess = true;
        state.exercises = state.exercises.filter(ex => ex.id !== action.payload);
        delete state.exerciseOptions[action.payload];
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to delete exercise';
      })
      // createExerciseOption
      .addCase(createExerciseOption.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(createExerciseOption.fulfilled, (state, action: PayloadAction<IExerciseOption>) => {
        state.updating = false;
        state.updateSuccess = true;
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
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to create exercise option';
      })
      // updateExerciseOption
      .addCase(updateExerciseOption.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(updateExerciseOption.fulfilled, (state, action: PayloadAction<IExerciseOption>) => {
        state.updating = false;
        state.updateSuccess = true;
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
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to update exercise option';
      })
      // deleteExerciseOption
      .addCase(deleteExerciseOption.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(deleteExerciseOption.fulfilled, (state, action: PayloadAction<{ exerciseId: number; optionId: number }>) => {
        state.updating = false;
        state.updateSuccess = true;
        const { exerciseId, optionId } = action.payload;
        if (state.exerciseOptions[exerciseId]) {
          state.exerciseOptions[exerciseId] = state.exerciseOptions[exerciseId].filter(opt => opt.id !== optionId);
        }
      })
      .addCase(deleteExerciseOption.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to delete exercise option';
      })
      // bulkCreateExercises
      .addCase(bulkCreateExercises.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(bulkCreateExercises.fulfilled, (state, action: PayloadAction<IExercise[]>) => {
        state.updating = false;
        state.updateSuccess = true;
        state.exercises = [...state.exercises, ...action.payload];
      })
      .addCase(bulkCreateExercises.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to bulk create exercises';
      })
      // bulkUpdateExercises
      .addCase(bulkUpdateExercises.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(bulkUpdateExercises.fulfilled, (state, action: PayloadAction<IExercise[]>) => {
        state.updating = false;
        state.updateSuccess = true;
        state.exercises = action.payload;
      })
      .addCase(bulkUpdateExercises.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to bulk update exercises';
      });
  },
});

export const { reset, resetAll } = exerciseSlice.actions;

export default exerciseSlice.reducer;
