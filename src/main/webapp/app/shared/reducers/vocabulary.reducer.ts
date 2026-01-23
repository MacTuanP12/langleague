import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IVocabulary } from 'app/shared/model/vocabulary.model';

interface VocabularyState {
  vocabularies: IVocabulary[];
  loading: boolean;
  updating: boolean;
  updateSuccess: boolean;
  errorMessage: string | null;
}

const initialState: VocabularyState = {
  vocabularies: [],
  loading: false,
  updating: false,
  updateSuccess: false,
  errorMessage: null,
};

// Async thunks
export const fetchVocabulariesByUnitId = createAsyncThunk('vocabulary/fetchByUnitId', async (unitId: number | string) => {
  const response = await axios.get<IVocabulary[]>(`/api/vocabularies/by-unit/${unitId}`);
  return response.data;
});

export const createVocabulary = createAsyncThunk('vocabulary/create', async (vocabulary: IVocabulary) => {
  const response = await axios.post<IVocabulary>('/api/vocabularies', vocabulary);
  return response.data;
});

export const updateVocabulary = createAsyncThunk('vocabulary/update', async (vocabulary: IVocabulary) => {
  const response = await axios.put<IVocabulary>(`/api/vocabularies/${vocabulary.id}`, vocabulary);
  return response.data;
});

export const deleteVocabulary = createAsyncThunk('vocabulary/delete', async (id: number) => {
  await axios.delete(`/api/vocabularies/${id}`);
  return id;
});

export const bulkCreateVocabularies = createAsyncThunk('vocabulary/bulkCreate', async (vocabularies: IVocabulary[]) => {
  const response = await axios.post<IVocabulary[]>('/api/vocabularies/bulk', vocabularies);
  return response.data;
});

export const bulkUpdateVocabularies = createAsyncThunk('vocabulary/bulkUpdate', async (vocabularies: IVocabulary[]) => {
  const response = await axios.put<IVocabulary[]>('/api/vocabularies/bulk', vocabularies);
  return response.data;
});

// Slice
const vocabularySlice = createSlice({
  name: 'vocabulary',
  initialState,
  reducers: {
    reset(state) {
      state.loading = false;
      state.updating = false;
      state.updateSuccess = false;
      state.errorMessage = null;
    },
    resetAll(state) {
      state.vocabularies = [];
      state.loading = false;
      state.updating = false;
      state.updateSuccess = false;
      state.errorMessage = null;
    },
  },
  extraReducers(builder) {
    builder
      // fetchVocabulariesByUnitId
      .addCase(fetchVocabulariesByUnitId.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchVocabulariesByUnitId.fulfilled, (state, action: PayloadAction<IVocabulary[]>) => {
        state.loading = false;
        state.vocabularies = action.payload;
      })
      .addCase(fetchVocabulariesByUnitId.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch vocabularies';
      })
      // createVocabulary
      .addCase(createVocabulary.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(createVocabulary.fulfilled, (state, action: PayloadAction<IVocabulary>) => {
        state.updating = false;
        state.updateSuccess = true;
        state.vocabularies.push(action.payload);
      })
      .addCase(createVocabulary.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to create vocabulary';
      })
      // updateVocabulary
      .addCase(updateVocabulary.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(updateVocabulary.fulfilled, (state, action: PayloadAction<IVocabulary>) => {
        state.updating = false;
        state.updateSuccess = true;
        const index = state.vocabularies.findIndex(vocab => vocab.id === action.payload.id);
        if (index !== -1) {
          state.vocabularies[index] = action.payload;
        }
      })
      .addCase(updateVocabulary.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to update vocabulary';
      })
      // deleteVocabulary
      .addCase(deleteVocabulary.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(deleteVocabulary.fulfilled, (state, action: PayloadAction<number>) => {
        state.updating = false;
        state.updateSuccess = true;
        state.vocabularies = state.vocabularies.filter(vocab => vocab.id !== action.payload);
      })
      .addCase(deleteVocabulary.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to delete vocabulary';
      })
      // bulkCreateVocabularies
      .addCase(bulkCreateVocabularies.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(bulkCreateVocabularies.fulfilled, (state, action: PayloadAction<IVocabulary[]>) => {
        state.updating = false;
        state.updateSuccess = true;
        state.vocabularies = [...state.vocabularies, ...action.payload];
      })
      .addCase(bulkCreateVocabularies.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to bulk create vocabularies';
      })
      // bulkUpdateVocabularies
      .addCase(bulkUpdateVocabularies.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(bulkUpdateVocabularies.fulfilled, (state, action: PayloadAction<IVocabulary[]>) => {
        state.updating = false;
        state.updateSuccess = true;
        state.vocabularies = action.payload;
      })
      .addCase(bulkUpdateVocabularies.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to bulk update vocabularies';
      });
  },
});

export const { reset, resetAll } = vocabularySlice.actions;

export default vocabularySlice.reducer;
