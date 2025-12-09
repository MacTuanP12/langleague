import { createSlice } from '@reduxjs/toolkit';
import { ILesson } from '../model/models';
// Backend only uses chapters - lesson.service.ts has been removed
import { getChapters, getChaptersByBookId, getChapter, createChapter, updateChapter, deleteChapter } from '../services/chapter.service';

// Create aliases for backward compatibility with existing code
export const getLessons = getChapters;
export const getLessonsByChapterId = getChaptersByBookId;
export const getLesson = getChapter;
export const createLesson = createChapter;
export const updateLesson = updateChapter;
export const deleteLesson = deleteChapter;

export interface LessonState {
  loading: boolean;
  entities: ILesson[];
  entity: ILesson | null;
  lesson: ILesson | null;
  updating: boolean;
  updateSuccess: boolean;
  errorMessage: string | null;
}

const initialState: LessonState = {
  loading: false,
  entities: [],
  entity: null,
  lesson: null,
  updating: false,
  updateSuccess: false,
  errorMessage: null,
};

export const LessonSlice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {
    resetLesson(state) {
      state.entity = null;
      state.updating = false;
      state.updateSuccess = false;
      state.errorMessage = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getLessons.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload;
      })
      .addCase(getLessons.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch lessons';
      })
      .addCase(getLessonsByChapterId.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload;
      })
      .addCase(getLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.lesson = action.payload;
      })
      .addCase(createLesson.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
        state.errorMessage = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entities.push(action.payload);
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message || 'Failed to create lesson';
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entities = state.entities.map(entity => (entity.id === action.payload.id ? action.payload : entity));
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entities = state.entities.filter(entity => entity.id !== action.payload.id);
      });
  },
});

export const { resetLesson } = LessonSlice.actions;
export default LessonSlice.reducer;
// Exports are already defined at the top as aliases to chapter actions
