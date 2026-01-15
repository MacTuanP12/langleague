import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { INote, defaultValue } from 'app/shared/model/note.model';

const initialState = {
  loading: false,
  errorMessage: null as string | null,
  entities: [] as ReadonlyArray<INote>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  hasNoteForUnit: false, // New: track if unit has note
  currentNote: null as INote | null, // New: single note for unit
};

const apiUrl = 'api/notes';

// Actions

export const getNotesByUnit = createAsyncThunk('note/fetch_entity_list', async (unitId: string | number) => {
  // Backend returns notes filtered by current user and unitId
  const requestUrl = `${apiUrl}?unitId.equals=${unitId}&sort=createdAt,desc`;
  return axios.get<INote[]>(requestUrl);
});

// New: Check if user has note for this unit (returns boolean)
export const checkNoteForUnit = createAsyncThunk('note/check_unit', async (unitId: string | number) => {
  const requestUrl = `${apiUrl}/check-unit/${unitId}`;
  return axios.get<boolean>(requestUrl);
});

// New: Get single note for current user and unit
export const getNoteByUnit = createAsyncThunk('note/get_by_unit', async (unitId: string | number) => {
  const requestUrl = `${apiUrl}/by-unit/${unitId}`;
  return axios.get<INote>(requestUrl);
});

export const createNote = createAsyncThunk(
  'note/create_entity',
  async (entity: INote, thunkAPI) => {
    const result = await axios.post<INote>(apiUrl, entity);
    thunkAPI.dispatch(getNotesByUnit(entity.unitId));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateNote = createAsyncThunk(
  'note/update_entity',
  async (entity: INote, thunkAPI) => {
    const result = await axios.put<INote>(`${apiUrl}/${entity.id}`, entity);
    thunkAPI.dispatch(getNotesByUnit(entity.unitId));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteNote = createAsyncThunk(
  'note/delete_entity',
  async ({ id, unitId }: { id: number; unitId: number }, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<INote>(requestUrl);
    thunkAPI.dispatch(getNotesByUnit(unitId));
    return result;
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
      .addCase(getNotesByUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
        // Update hasNoteForUnit and currentNote
        state.hasNoteForUnit = action.payload.data.length > 0;
        state.currentNote = action.payload.data.length > 0 ? action.payload.data[0] : null;
      })
      .addCase(checkNoteForUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.hasNoteForUnit = action.payload.data;
      })
      .addCase(getNoteByUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNote = action.payload.data;
        state.hasNoteForUnit = true;
      })
      .addCase(getNoteByUnit.rejected, state => {
        state.loading = false;
        state.currentNote = null;
        state.hasNoteForUnit = false;
      })
      .addMatcher(isFulfilled(createNote, updateNote), state => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.hasNoteForUnit = true;
      })
      .addMatcher(isFulfilled(deleteNote), state => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.hasNoteForUnit = false;
        state.currentNote = null;
      })
      .addMatcher(isPending(getNotesByUnit, createNote, updateNote, deleteNote, checkNoteForUnit, getNoteByUnit), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.loading = true;
      })
      .addMatcher(isRejected(getNotesByUnit, createNote, updateNote, deleteNote, checkNoteForUnit), (state, action) => {
        state.loading = false;
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset, clearError } = NoteSlice.actions;

// Reducer
export default NoteSlice.reducer;
