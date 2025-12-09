import { createSlice } from '@reduxjs/toolkit';
import { IBook } from '../model/models';
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../services/book.service';

export interface BookState {
  loading: boolean;
  entities: IBook[];
  entity: IBook | null;
  updating: boolean;
  updateSuccess: boolean;
  errorMessage: string | null;
  totalItems: number;
}

const initialState: BookState = {
  loading: false,
  entities: [],
  entity: null,
  updating: false,
  updateSuccess: false,
  errorMessage: null,
  totalItems: 0,
};

export const BookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    resetBook(state) {
      state.entity = null;
      state.updating = false;
      state.updateSuccess = false;
      state.errorMessage = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getBooks.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload;
        state.totalItems = action.payload.length;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch books';
      })
      .addCase(getBook.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getBook.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
      })
      .addCase(getBook.rejected, state => {
        state.loading = false;
      })
      .addCase(createBook.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entities.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create book';
      })
      .addCase(updateBook.pending, state => {
        state.updating = true;
        state.updateSuccess = false;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entities = state.entities.map(entity => (entity.id === action.payload.id ? action.payload : entity));
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update book';
      })
      .addCase(deleteBook.pending, state => {
        state.updating = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entities = state.entities.filter(entity => entity.id !== action.payload.id);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete book';
      });
  },
});

export const { resetBook } = BookSlice.actions;
export default BookSlice.reducer;
export { getBooks, getBook, createBook, updateBook, deleteBook };
