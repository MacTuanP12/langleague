import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUnit } from 'app/shared/model/unit.model';

interface UnitState {
  units: IUnit[];
  selectedUnit: IUnit | null;
  loading: boolean;
  updating: boolean;
  errorMessage: string | null;
}

const initialState: UnitState = {
  units: [],
  selectedUnit: null,
  loading: false,
  updating: false,
  errorMessage: null,
};

// Async thunks
export const fetchUnitById = createAsyncThunk('unit/fetchUnitById', async (id: number | string) => {
  const response = await axios.get<IUnit>(`/api/units/${id}`);
  return response.data;
});

export const fetchUnitsByBookId = createAsyncThunk('unit/fetchUnitsByBookId', async (bookId: number | string) => {
  const response = await axios.get<IUnit[]>(`/api/units/by-book/${bookId}`);
  return response.data;
});

export const createUnit = createAsyncThunk('unit/createUnit', async (unit: IUnit) => {
  const response = await axios.post<IUnit>('/api/units', unit);
  return response.data;
});

export const updateUnit = createAsyncThunk('unit/updateUnit', async (unit: IUnit) => {
  const response = await axios.put<IUnit>(`/api/units/${unit.id}`, unit);
  return response.data;
});

export const deleteUnit = createAsyncThunk('unit/deleteUnit', async (id: number) => {
  await axios.delete(`/api/units/${id}`);
  return id;
});

export const reorderUnits = createAsyncThunk(
  'unit/reorderUnits',
  async ({ bookId, unitIds }: { bookId: number | string; unitIds: (number | undefined)[] }) => {
    await axios.put(`/api/books/${bookId}/units/reorder`, { unitIds });
    return unitIds;
  },
);

// Slice
const unitSlice = createSlice({
  name: 'unit',
  initialState,
  reducers: {
    reset: () => initialState,
    clearSelectedUnit(state) {
      state.selectedUnit = null;
    },
  },
  extraReducers(builder) {
    builder
      // fetchUnitById
      .addCase(fetchUnitById.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUnitById.fulfilled, (state, action: PayloadAction<IUnit>) => {
        state.loading = false;
        state.selectedUnit = action.payload;
      })
      .addCase(fetchUnitById.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch unit';
      })
      // fetchUnitsByBookId
      .addCase(fetchUnitsByBookId.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUnitsByBookId.fulfilled, (state, action: PayloadAction<IUnit[]>) => {
        state.loading = false;
        state.units = action.payload;
      })
      .addCase(fetchUnitsByBookId.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch units';
      })
      // createUnit
      .addCase(createUnit.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createUnit.fulfilled, (state, action: PayloadAction<IUnit>) => {
        state.updating = false;
        state.units.push(action.payload);
        state.selectedUnit = action.payload;
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create unit';
      })
      // updateUnit
      .addCase(updateUnit.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateUnit.fulfilled, (state, action: PayloadAction<IUnit>) => {
        state.updating = false;
        const index = state.units.findIndex(unit => unit.id === action.payload.id);
        if (index !== -1) {
          state.units[index] = action.payload;
        }
        state.selectedUnit = action.payload;
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update unit';
      })
      // deleteUnit
      .addCase(deleteUnit.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteUnit.fulfilled, (state, action: PayloadAction<number>) => {
        state.updating = false;
        state.units = state.units.filter(unit => unit.id !== action.payload);
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete unit';
      })
      // reorderUnits
      .addCase(reorderUnits.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(reorderUnits.fulfilled, (state, action) => {
        state.updating = false;
        // The order is already updated optimistically in the UI
      })
      .addCase(reorderUnits.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to reorder units';
      });
  },
});

export const { reset, clearSelectedUnit } = unitSlice.actions;

export default unitSlice.reducer;
