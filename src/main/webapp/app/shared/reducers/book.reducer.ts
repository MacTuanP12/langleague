import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IBook } from 'app/shared/model/book.model';

interface BookState {
  books: IBook[];
  selectedBook: IBook | null;
  loading: boolean;
  updating: boolean;
  errorMessage: string | null;
}

const initialState: BookState = {
  books: [],
  selectedBook: null,
  loading: false,
  updating: false,
  errorMessage: null,
};

// Async thunks
export const fetchBooks = createAsyncThunk('book/fetchBooks', async () => {
  const response = await axios.get<IBook[]>('/api/books');
  return response.data;
});

export const fetchBookById = createAsyncThunk('book/fetchBookById', async (id: number) => {
  const response = await axios.get<IBook>(`/api/books/${id}`);
  return response.data;
});

export const createBook = createAsyncThunk('book/createBook', async (book: IBook) => {
  const response = await axios.post<IBook>('/api/books', book);
  return response.data;
});

export const updateBook = createAsyncThunk('book/updateBook', async (book: IBook) => {
  const response = await axios.put<IBook>(`/api/books/${book.id}`, book);
  return response.data;
});

export const deleteBook = createAsyncThunk('book/deleteBook', async (id: number) => {
  await axios.delete(`/api/books/${id}`);
  return id;
});

// Slice
const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    reset: () => initialState,
    clearSelectedBook: state => {
      state.selectedBook = null;
    },
  },
  extraReducers: builder => {
    builder
      // fetchBooks
      .addCase(fetchBooks.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<IBook[]>) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch books';
      })
      // fetchBookById
      .addCase(fetchBookById.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action: PayloadAction<IBook>) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch book';
      })
      // createBook
      .addCase(createBook.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createBook.fulfilled, (state, action: PayloadAction<IBook>) => {
        state.updating = false;
        state.books.push(action.payload);
        state.selectedBook = action.payload;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create book';
      })
      // updateBook
      .addCase(updateBook.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateBook.fulfilled, (state, action: PayloadAction<IBook>) => {
        state.updating = false;
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        state.selectedBook = action.payload;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update book';
      })
      // deleteBook
      .addCase(deleteBook.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<number>) => {
        state.updating = false;
        state.books = state.books.filter(book => book.id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete book';
      });
  },
});

export const { reset, clearSelectedBook } = bookSlice.actions;

export default bookSlice.reducer;

