import { createSlice } from '@reduxjs/toolkit';
import {
  getChapterComments,
  getMyComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  getCommentReplies,
} from '../services/comment.service';
import { CommentDTO } from '../services/comment.service';

interface CommentState {
  entities: CommentDTO[];
  entity: CommentDTO | null;
  loading: boolean;
  updating: boolean;
  totalItems: number;
  errorMessage: string | null;
}

const initialState: CommentState = {
  entities: [],
  entity: null,
  loading: false,
  updating: false,
  totalItems: 0,
  errorMessage: null,
};

export const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      // Get chapter comments
      .addCase(getChapterComments.pending, state => {
        state.loading = true;
      })
      .addCase(getChapterComments.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.content;
        state.totalItems = action.payload.totalElements;
      })
      .addCase(getChapterComments.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch comments';
      })
      // Get my comments
      .addCase(getMyComments.pending, state => {
        state.loading = true;
      })
      .addCase(getMyComments.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.content;
        state.totalItems = action.payload.totalElements;
      })
      .addCase(getMyComments.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch my comments';
      })
      // Get single comment
      .addCase(getComment.pending, state => {
        state.loading = true;
      })
      .addCase(getComment.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
      })
      .addCase(getComment.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch comment';
      })
      // Create comment
      .addCase(createComment.pending, state => {
        state.updating = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.updating = false;
        state.entities.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create comment';
      })
      // Update comment
      .addCase(updateComment.pending, state => {
        state.updating = true;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.entities.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update comment';
      })
      // Delete comment
      .addCase(deleteComment.pending, state => {
        state.updating = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.updating = false;
        state.entities = state.entities.filter(e => e.id !== action.payload.id);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete comment';
      })
      // Get replies
      .addCase(getCommentReplies.fulfilled, (state, action) => {
        // Store replies in entity for now
        if (state.entity) {
          state.entity.replies = action.payload;
        }
      });
  },
});

export const { reset } = commentSlice.actions;
export default commentSlice.reducer;
