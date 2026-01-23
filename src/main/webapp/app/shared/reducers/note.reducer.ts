import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { INote, defaultValue } from 'app/shared/model/note.model';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';

interface INoteWithUnit extends INote {
  unit?: {
    id: number;
  };
}

const initialState = {
  loading: false,
  errorMessage: null as string | null,
  entities: [] as ReadonlyArray<INote>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0,
};

const apiUrl = 'api/notes';

// Actions

// 1. STANDARD FETCH (Required for unit-notes.tsx to fetch all items)
export const getEntities = createAsyncThunk('note/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`;
  return axios.get<INote[]>(requestUrl, {
    params: {
      page,
      size,
      sort,
    },
  });
});

// 2. CUSTOM FETCH BY UNIT (Optional, kept for compatibility)
export const getNotesByUnit = createAsyncThunk('note/fetch_by_unit', async (unitId: string | number) => {
  const requestUrl = `${apiUrl}?unitId.equals=${unitId}&sort=createdAt,desc`;
  return axios.get<INote[]>(requestUrl);
});

export const checkNoteForUnit = createAsyncThunk('note/check_unit', async (unitId: string | number) => {
  const requestUrl = `${apiUrl}/check-unit/${unitId}`;
  return axios.get<boolean>(requestUrl);
});

export const getNoteByUnit = createAsyncThunk('note/get_by_unit', async (unitId: string | number) => {
  const requestUrl = `${apiUrl}/by-unit/${unitId}`;
  return axios.get<INote>(requestUrl);
});

export const createNote = createAsyncThunk(
  'note/create_entity',
  async (entity: INote, thunkAPI) => {
    const result = await axios.post<INote>(apiUrl, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateNote = createAsyncThunk(
  'note/update_entity',
  async (entity: INote, thunkAPI) => {
    const result = await axios.put<INote>(`${apiUrl}/${entity.id}`, entity);
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteNote = createAsyncThunk(
  'note/delete_entity',
  async ({ id, unitId }: { id: number; unitId: number }, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.delete(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// Slice

export const NoteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    clearError(state) {
      state.errorMessage = null;
    },
  },
  extraReducers(builder) {
    builder
      // --- READ ACTIONS ---

      // Handle Standard getEntities
      .addCase(getEntities.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
        state.totalItems = parseInt(action.payload.headers['x-total-count'], 10);
      })

      // Handle Custom getNotesByUnit
      .addCase(getNotesByUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
      })

      .addCase(checkNoteForUnit.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getNoteByUnit.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedNote = action.payload.data;
        const existingNoteIndex = state.entities.findIndex(note => note.id === fetchedNote.id);
        if (existingNoteIndex !== -1) {
          state.entities[existingNoteIndex] = fetchedNote;
        } else {
          state.entities.push(fetchedNote);
        }
      })
      .addCase(getNoteByUnit.rejected, state => {
        state.loading = false;
      })

      // --- WRITE ACTIONS ---
      .addCase(createNote.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;

        const createdNote = action.payload.data as INoteWithUnit;
        if (!createdNote.unitId && !createdNote.unit && action.meta.arg.unitId) {
          createdNote.unitId = action.meta.arg.unitId;
        }

        state.entities = [createdNote, ...state.entities];
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;

        const updatedNote = action.payload.data as INoteWithUnit;
        if (!updatedNote.unitId && !updatedNote.unit && action.meta.arg.unitId) {
          updatedNote.unitId = action.meta.arg.unitId;
        } else if (!updatedNote.unitId && !updatedNote.unit) {
          const existing = state.entities.find(n => n.id === updatedNote.id);
          if (existing && existing.unitId) {
            updatedNote.unitId = existing.unitId;
          }
        }

        state.entities = state.entities.map(note => (note.id === updatedNote.id ? updatedNote : note));
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entities = state.entities.filter(note => note.id !== action.meta.arg.id);
      })

      // --- MATCHERS ---

      // 1. Pending for WRITE actions
      .addMatcher(isPending(createNote, updateNote, deleteNote), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.loading = true;
      })

      // 2. Pending for READ actions (Including getEntities)
      .addMatcher(isPending(getEntities, getNotesByUnit, checkNoteForUnit, getNoteByUnit), state => {
        state.errorMessage = null;
        state.loading = true;
      })

      // 3. Rejected for ALL actions
      .addMatcher(
        isRejected(getEntities, getNotesByUnit, createNote, updateNote, deleteNote, checkNoteForUnit, getNoteByUnit),
        (state, action) => {
          state.loading = false;
          state.updating = false;
          state.updateSuccess = false;
          if (action.error.name !== 'AbortError' && !axios.isCancel(action.error)) {
            state.errorMessage = action.error.message;
          }
        },
      );
  },
});

export const { reset, clearError } = NoteSlice.actions;

export default NoteSlice.reducer;
