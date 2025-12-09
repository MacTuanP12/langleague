import { createSlice } from '@reduxjs/toolkit';
import { IChapter } from '../model/models';
import { getChapters, getChaptersByBookId, getChapter, createChapter, updateChapter, deleteChapter } from '../services/chapter.service';

export interface ChapterState {
  loading: boolean;
  entities: IChapter[];
  entity: IChapter | null;
  updating: boolean;
  updateSuccess: boolean;
  errorMessage: string | null;
}

const initialState: ChapterState = {
  loading: false,
  entities: [],
  entity: null,
  updating: false,
  updateSuccess: false,
  errorMessage: null,
};

export const ChapterSlice = createSlice({
  name: 'chapter',
  initialState,
  reducers: {
    resetChapter(state) {
      state.entity = null;
      state.updating = false;
      state.updateSuccess = false;
      state.errorMessage = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getChapters.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getChapters.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload;
      })
      .addCase(getChapters.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch chapters';
      })
      .addCase(getChaptersByBookId.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getChaptersByBookId.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload;
      })
      .addCase(getChaptersByBookId.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch chapters';
      })
      .addCase(getChapter.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getChapter.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
      })
      .addCase(getChapter.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch chapter';
      })
      .addCase(createChapter.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(createChapter.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entities.push(action.payload);
      })
      .addCase(createChapter.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to create chapter';
      })
      .addCase(updateChapter.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(updateChapter.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entities = state.entities.map(entity => (entity.id === action.payload.id ? action.payload : entity));
      })
      .addCase(updateChapter.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to update chapter';
      })
      .addCase(deleteChapter.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(deleteChapter.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entities = state.entities.filter(entity => entity.id !== action.payload.id);
      })
      .addCase(deleteChapter.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to delete chapter';
      });
  },
});

export const { resetChapter } = ChapterSlice.actions;
export default ChapterSlice.reducer;
export { getChapters, getChaptersByBookId, getChapter, createChapter, updateChapter, deleteChapter };
