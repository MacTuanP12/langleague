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
};

const apiUrl = 'api/notes';

// Actions

export const getNotesByUnit = createAsyncThunk('note/fetch_entity_list', async (unitId: string | number) => {
  // Giả định backend hỗ trợ filter hoặc trả về notes của user hiện tại cho unit này
  // Trong thực tế bạn cần đảm bảo Backend Controller hỗ trợ param này
  const requestUrl = `${apiUrl}?unitId.equals=${unitId}&sort=createdAt,desc`;
  return axios.get<INote[]>(requestUrl);
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
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getNotesByUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
      })
      .addMatcher(isFulfilled(createNote, updateNote, deleteNote), state => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isPending(getNotesByUnit, createNote, updateNote, deleteNote), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.loading = true;
      })
      .addMatcher(isRejected(getNotesByUnit, createNote, updateNote, deleteNote), (state, action) => {
        state.loading = false;
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset } = NoteSlice.actions;

// Reducer
export default NoteSlice.reducer;
