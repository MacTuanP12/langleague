import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IWord, IWordExample } from '../model/models';

const API_URL = '/api/words';

// ==================== Word APIs ====================

// Get all words by chapter
export const getWordsByChapter = createAsyncThunk('word/fetch_by_chapter', async (chapterId: number) => {
  const response = await axios.get<IWord[]>(`${API_URL}/chapter/${chapterId}`);
  return response.data;
});

// Get a single word
export const getWord = createAsyncThunk('word/fetch_entity', async (id: number) => {
  const response = await axios.get<IWord>(`${API_URL}/${id}`);
  return response.data;
});

// Create a new word
export const createWord = createAsyncThunk('word/create_entity', async (word: IWord) => {
  const response = await axios.post<IWord>(API_URL, word);
  return response.data;
});

// Update an existing word
export const updateWord = createAsyncThunk('word/update_entity', async ({ id, word }: { id: number; word: IWord }) => {
  const response = await axios.put<IWord>(`${API_URL}/${id}`, word);
  return response.data;
});

// Delete a word
export const deleteWord = createAsyncThunk('word/delete_entity', async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return { id };
});

// ==================== Word Example APIs ====================

const EXAMPLE_API_URL = '/api/word-examples';

// Get examples for a word
export const getWordExamples = createAsyncThunk('wordExample/fetch_by_word', async (wordId: number) => {
  const response = await axios.get<IWordExample[]>(`${EXAMPLE_API_URL}/word/${wordId}`);
  return response.data;
});

// Create a word example
export const createWordExample = createAsyncThunk('wordExample/create_entity', async (example: IWordExample) => {
  const response = await axios.post<IWordExample>(EXAMPLE_API_URL, example);
  return response.data;
});

// Update a word example
export const updateWordExample = createAsyncThunk(
  'wordExample/update_entity',
  async ({ id, example }: { id: number; example: IWordExample }) => {
    const response = await axios.put<IWordExample>(`${EXAMPLE_API_URL}/${id}`, example);
    return response.data;
  },
);

// Delete a word example
export const deleteWordExample = createAsyncThunk('wordExample/delete_entity', async (id: number) => {
  await axios.delete(`${EXAMPLE_API_URL}/${id}`);
  return { id };
});
