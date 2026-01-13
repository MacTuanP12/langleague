import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUnit } from 'app/shared/model/unit.model';
import { IVocabulary } from 'app/shared/model/vocabulary.model';
import { IGrammar } from 'app/shared/model/grammar.model';
import { IExercise } from 'app/shared/model/exercise.model';

/**
 * Unit Editor State
 * Consolidated state management for editing a single unit's content
 * including vocabulary, grammar, and exercises
 */
interface UnitEditorState {
  currentUnit: IUnit | null;
  vocabList: IVocabulary[];
  grammarList: IGrammar[];
  exerciseList: IExercise[];
  loading: boolean;
  updating: boolean;
  errorMessage: string | null;
}

const initialState: UnitEditorState = {
  currentUnit: null,
  vocabList: [],
  grammarList: [],
  exerciseList: [],
  loading: false,
  updating: false,
  errorMessage: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Fetch unit details along with all its content (vocabulary, grammar, exercises)
 * Makes parallel requests for efficiency
 */
export const fetchUnitDetails = createAsyncThunk('unitEditor/fetchUnitDetails', async (unitId: number | string) => {
  const [unitResponse, vocabResponse, grammarResponse, exerciseResponse] = await Promise.all([
    axios.get<IUnit>(`/api/units/${unitId}`),
    axios.get<IVocabulary[]>(`/api/vocabularies/by-unit/${unitId}`),
    axios.get<IGrammar[]>(`/api/grammars/by-unit/${unitId}`),
    axios.get<IExercise[]>(`/api/exercises/by-unit/${unitId}`),
  ]);

  return {
    unit: unitResponse.data,
    vocabularies: vocabResponse.data,
    grammars: grammarResponse.data,
    exercises: exerciseResponse.data,
  };
});

// ----------------------------------------------------------------------------
// Vocabulary Thunks
// ----------------------------------------------------------------------------

export const createVocabulary = createAsyncThunk('unitEditor/createVocabulary', async (vocabulary: IVocabulary) => {
  const response = await axios.post<IVocabulary>('/api/vocabularies', vocabulary);
  return response.data;
});

export const updateVocabulary = createAsyncThunk('unitEditor/updateVocabulary', async (vocabulary: IVocabulary) => {
  const response = await axios.put<IVocabulary>(`/api/vocabularies/${vocabulary.id}`, vocabulary);
  return response.data;
});

export const deleteVocabulary = createAsyncThunk('unitEditor/deleteVocabulary', async (id: number) => {
  await axios.delete(`/api/vocabularies/${id}`);
  return id;
});

export const bulkCreateVocabularies = createAsyncThunk('unitEditor/bulkCreateVocabularies', async (vocabularies: IVocabulary[]) => {
  const response = await axios.post<IVocabulary[]>('/api/vocabularies/bulk', vocabularies);
  return response.data;
});

// ----------------------------------------------------------------------------
// Grammar Thunks
// ----------------------------------------------------------------------------

export const createGrammar = createAsyncThunk('unitEditor/createGrammar', async (grammar: IGrammar) => {
  const response = await axios.post<IGrammar>('/api/grammars', grammar);
  return response.data;
});

export const updateGrammar = createAsyncThunk('unitEditor/updateGrammar', async (grammar: IGrammar) => {
  const response = await axios.put<IGrammar>(`/api/grammars/${grammar.id}`, grammar);
  return response.data;
});

export const deleteGrammar = createAsyncThunk('unitEditor/deleteGrammar', async (id: number) => {
  await axios.delete(`/api/grammars/${id}`);
  return id;
});

export const bulkCreateGrammars = createAsyncThunk('unitEditor/bulkCreateGrammars', async (grammars: IGrammar[]) => {
  const response = await axios.post<IGrammar[]>('/api/grammars/bulk', grammars);
  return response.data;
});

// ----------------------------------------------------------------------------
// Exercise Thunks
// ----------------------------------------------------------------------------

export const createExercise = createAsyncThunk('unitEditor/createExercise', async (exercise: IExercise) => {
  const response = await axios.post<IExercise>('/api/exercises', exercise);
  return response.data;
});

export const updateExercise = createAsyncThunk('unitEditor/updateExercise', async (exercise: IExercise) => {
  const response = await axios.put<IExercise>(`/api/exercises/${exercise.id}`, exercise);
  return response.data;
});

export const deleteExercise = createAsyncThunk('unitEditor/deleteExercise', async (id: number) => {
  await axios.delete(`/api/exercises/${id}`);
  return id;
});

export const bulkCreateExercises = createAsyncThunk(
  'unitEditor/bulkCreateExercises',
  async ({ unitId, exercises }: { unitId: string | number; exercises: IExercise[] }) => {
    const response = await axios.post<IExercise[]>(`/api/exercises/bulk/${unitId}`, exercises);
    return response.data;
  },
);

// ============================================================================
// SLICE
// ============================================================================

const unitEditorSlice = createSlice({
  name: 'unitEditor',
  initialState,
  reducers: {
    reset: () => initialState,
    clearCurrentUnit(state) {
      state.currentUnit = null;
      state.vocabList = [];
      state.grammarList = [];
      state.exerciseList = [];
    },
    setCurrentUnit(state, action: PayloadAction<IUnit>) {
      state.currentUnit = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // --------------------------------------------------------------------
      // Fetch Unit Details
      // --------------------------------------------------------------------
      .addCase(fetchUnitDetails.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUnitDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUnit = action.payload.unit;
        state.vocabList = action.payload.vocabularies;
        state.grammarList = action.payload.grammars;
        state.exerciseList = action.payload.exercises;
      })
      .addCase(fetchUnitDetails.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch unit details';
      })

      // --------------------------------------------------------------------
      // Vocabulary CRUD
      // --------------------------------------------------------------------
      .addCase(createVocabulary.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createVocabulary.fulfilled, (state, action) => {
        state.updating = false;
        state.vocabList.push(action.payload);
      })
      .addCase(createVocabulary.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create vocabulary';
      })

      .addCase(updateVocabulary.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateVocabulary.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.vocabList.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.vocabList[index] = action.payload;
        }
      })
      .addCase(updateVocabulary.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update vocabulary';
      })

      .addCase(deleteVocabulary.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteVocabulary.fulfilled, (state, action) => {
        state.updating = false;
        state.vocabList = state.vocabList.filter(v => v.id !== action.payload);
      })
      .addCase(deleteVocabulary.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete vocabulary';
      })

      .addCase(bulkCreateVocabularies.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(bulkCreateVocabularies.fulfilled, (state, action) => {
        state.updating = false;
        state.vocabList.push(...action.payload);
      })
      .addCase(bulkCreateVocabularies.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to bulk create vocabularies';
      })

      // --------------------------------------------------------------------
      // Grammar CRUD
      // --------------------------------------------------------------------
      .addCase(createGrammar.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createGrammar.fulfilled, (state, action) => {
        state.updating = false;
        state.grammarList.push(action.payload);
      })
      .addCase(createGrammar.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create grammar';
      })

      .addCase(updateGrammar.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateGrammar.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.grammarList.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.grammarList[index] = action.payload;
        }
      })
      .addCase(updateGrammar.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update grammar';
      })

      .addCase(deleteGrammar.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteGrammar.fulfilled, (state, action) => {
        state.updating = false;
        state.grammarList = state.grammarList.filter(g => g.id !== action.payload);
      })
      .addCase(deleteGrammar.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete grammar';
      })

      .addCase(bulkCreateGrammars.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(bulkCreateGrammars.fulfilled, (state, action) => {
        state.updating = false;
        state.grammarList.push(...action.payload);
      })
      .addCase(bulkCreateGrammars.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to bulk create grammars';
      })

      // --------------------------------------------------------------------
      // Exercise CRUD
      // --------------------------------------------------------------------
      .addCase(createExercise.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.updating = false;
        state.exerciseList.push(action.payload);
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create exercise';
      })

      .addCase(updateExercise.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateExercise.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.exerciseList.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.exerciseList[index] = action.payload;
        }
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update exercise';
      })

      .addCase(deleteExercise.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.updating = false;
        state.exerciseList = state.exerciseList.filter(e => e.id !== action.payload);
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete exercise';
      })

      .addCase(bulkCreateExercises.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(bulkCreateExercises.fulfilled, (state, action) => {
        state.updating = false;
        state.exerciseList.push(...action.payload);
      })
      .addCase(bulkCreateExercises.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to bulk create exercises';
      });
  },
});

export const { reset, clearCurrentUnit, setCurrentUnit } = unitEditorSlice.actions;

export default unitEditorSlice.reducer;
