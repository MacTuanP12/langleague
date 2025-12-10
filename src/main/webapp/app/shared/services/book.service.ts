import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IBook } from '../model/models';
import { IPaginationBaseState } from 'src/main/webapp/app/shared/utils/reducer.utils';

const API_URL = '/api/books';

// Action to get all books with pagination
export const getEntities = createAsyncThunk('book/fetch_entity_list', async ({ page, size, sort }: IPaginationBaseState) => {
  const requestUrl = `${API_URL}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return axios.get<IBook[]>(requestUrl);
});

// Get a single book by ID
export const getEntity = createAsyncThunk('book/fetch_entity', async (id: string | number) => {
  const requestUrl = `${API_URL}/${id}`;
  return axios.get<IBook>(requestUrl);
});

// Create a new book
export const createEntity = createAsyncThunk(
  'book/create_entity',
  async (entity: IBook, thunkAPI) => {
    const result = await axios.post<IBook>(API_URL, entity);
    thunkAPI.dispatch(getEntities({})); // Refetch list after creation
    return result;
  },
  {
    // Option to skip if the same request is already running
    condition: (entity, { getState }) => {
      const { loading } = getState().book;
      if (loading) {
        return false;
      }
    },
  }
);

// Update an existing book
export const updateEntity = createAsyncThunk('book/update_entity', async (entity: IBook, thunkAPI) => {
  const result = await axios.put<IBook>(`${API_URL}/${entity.id}`, entity);
  thunkAPI.dispatch(getEntities({})); // Refetch list after update
  return result;
});

// Partially update a book
export const partialUpdateEntity = createAsyncThunk('book/partial_update_entity', async (entity: IBook, thunkAPI) => {
  const result = await axios.patch<IBook>(`${API_URL}/${entity.id}`, entity);
  thunkAPI.dispatch(getEntities({})); // Refetch list after partial update
  return result;
});

// Delete a book
export const deleteEntity = createAsyncThunk('book/delete_entity', async (id: string | number, thunkAPI) => {
  const requestUrl = `${API_URL}/${id}`;
  const result = await axios.delete<IBook>(requestUrl);
  thunkAPI.dispatch(getEntities({})); // Refetch list after deletion
  return result;
});
