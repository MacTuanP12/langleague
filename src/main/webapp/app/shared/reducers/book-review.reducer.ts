import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getBookReviews,
  getMyReviews,
  getBookReview,
  createBookReview,
  updateBookReview,
  deleteBookReview,
  markReviewHelpful,
} from '../services/book-review.service';
import { BookReviewDTO } from '../services/book-review.service';

interface BookReviewState {
  entities: BookReviewDTO[];
  entity: BookReviewDTO | null;
  loading: boolean;
  updating: boolean;
  totalItems: number;
  errorMessage: string | null;
}

const initialState: BookReviewState = {
  entities: [],
  entity: null,
  loading: false,
  updating: false,
  totalItems: 0,
  errorMessage: null,
};

export const bookReviewSlice = createSlice({
  name: 'bookReview',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      // Get book reviews
      .addCase(getBookReviews.pending, state => {
        state.loading = true;
      })
      .addCase(getBookReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.content;
        state.totalItems = action.payload.totalElements;
      })
      .addCase(getBookReviews.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch reviews';
      })
      // Get my reviews
      .addCase(getMyReviews.pending, state => {
        state.loading = true;
      })
      .addCase(getMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.content;
        state.totalItems = action.payload.totalElements;
      })
      .addCase(getMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch my reviews';
      })
      // Get single review
      .addCase(getBookReview.pending, state => {
        state.loading = true;
      })
      .addCase(getBookReview.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
      })
      .addCase(getBookReview.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch review';
      })
      // Create review
      .addCase(createBookReview.pending, state => {
        state.updating = true;
      })
      .addCase(createBookReview.fulfilled, (state, action) => {
        state.updating = false;
        state.entities.unshift(action.payload);
      })
      .addCase(createBookReview.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create review';
      })
      // Update review
      .addCase(updateBookReview.pending, state => {
        state.updating = true;
      })
      .addCase(updateBookReview.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.entities.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
      })
      .addCase(updateBookReview.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update review';
      })
      // Delete review
      .addCase(deleteBookReview.pending, state => {
        state.updating = true;
      })
      .addCase(deleteBookReview.fulfilled, (state, action) => {
        state.updating = false;
        state.entities = state.entities.filter(e => e.id !== action.payload.id);
      })
      .addCase(deleteBookReview.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete review';
      })
      // Mark helpful
      .addCase(markReviewHelpful.fulfilled, (state, action) => {
        const index = state.entities.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
      });
  },
});

export const { reset } = bookReviewSlice.actions;
export default bookReviewSlice.reducer;
