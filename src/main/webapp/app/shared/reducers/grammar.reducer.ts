import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IGrammar } from 'app/shared/model/grammar.model';

interface GrammarState {
  grammars: IGrammar[];
  loading: boolean;
  updating: boolean;
  errorMessage: string | null;
}

const initialState: GrammarState = {
  grammars: [],
  loading: false,
  updating: false,
  errorMessage: null,
};

// Async thunks
export const fetchGrammarsByUnitId = createAsyncThunk('grammar/fetchByUnitId', async (unitId: number | string) => {
  const response = await axios.get<IGrammar[]>(`/api/units/${unitId}/grammars`);
  return response.data;
});

export const createGrammar = createAsyncThunk('grammar/create', async (grammar: IGrammar) => {
  const response = await axios.post<IGrammar>('/api/grammars', grammar);
  return response.data;
});

export const updateGrammar = createAsyncThunk('grammar/update', async (grammar: IGrammar) => {
  const response = await axios.put<IGrammar>(`/api/grammars/${grammar.id}`, grammar);
  return response.data;
});

export const deleteGrammar = createAsyncThunk('grammar/delete', async (id: number) => {
  await axios.delete(`/api/grammars/${id}`);
  return id;
});

export const bulkCreateGrammars = createAsyncThunk('grammar/bulkCreate', async (grammars: IGrammar[]) => {
  const response = await axios.post<IGrammar[]>('/api/grammars/bulk', grammars);
  return response.data;
});

export const bulkUpdateGrammars = createAsyncThunk('grammar/bulkUpdate', async (grammars: IGrammar[]) => {
  const response = await axios.put<IGrammar[]>('/api/grammars/bulk', grammars);
  return response.data;
});

// Slice
const grammarSlice = createSlice({
  name: 'grammar',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      // fetchGrammarsByUnitId
      .addCase(fetchGrammarsByUnitId.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchGrammarsByUnitId.fulfilled, (state, action: PayloadAction<IGrammar[]>) => {
        state.loading = false;
        state.grammars = action.payload;
      })
      .addCase(fetchGrammarsByUnitId.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch grammars';
      })
      // createGrammar
      .addCase(createGrammar.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createGrammar.fulfilled, (state, action: PayloadAction<IGrammar>) => {
        state.updating = false;
        state.grammars.push(action.payload);
      })
      .addCase(createGrammar.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create grammar';
      })
      // updateGrammar
      .addCase(updateGrammar.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateGrammar.fulfilled, (state, action: PayloadAction<IGrammar>) => {
        state.updating = false;
        const index = state.grammars.findIndex(grammar => grammar.id === action.payload.id);
        if (index !== -1) {
          state.grammars[index] = action.payload;
        }
      })
      .addCase(updateGrammar.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update grammar';
      })
      // deleteGrammar
      .addCase(deleteGrammar.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteGrammar.fulfilled, (state, action: PayloadAction<number>) => {
        state.updating = false;
        state.grammars = state.grammars.filter(grammar => grammar.id !== action.payload);
      })
      .addCase(deleteGrammar.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete grammar';
      })
      // bulkCreateGrammars
      .addCase(bulkCreateGrammars.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(bulkCreateGrammars.fulfilled, (state, action: PayloadAction<IGrammar[]>) => {
        state.updating = false;
        state.grammars = [...state.grammars, ...action.payload];
      })
      .addCase(bulkCreateGrammars.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to bulk create grammars';
      })
      // bulkUpdateGrammars
      .addCase(bulkUpdateGrammars.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(bulkUpdateGrammars.fulfilled, (state, action: PayloadAction<IGrammar[]>) => {
        state.updating = false;
        state.grammars = action.payload;
      })
      .addCase(bulkUpdateGrammars.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to bulk update grammars';
      });
  },
});

export const { reset } = grammarSlice.actions;

export default grammarSlice.reducer;

