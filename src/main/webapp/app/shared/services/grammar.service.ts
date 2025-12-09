import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IGrammar, IGrammarExample } from '../model/models';

const API_URL = '/api/grammars';

// ==================== Grammar APIs ====================

// Get all grammars by chapter
export const getGrammarsByChapter = createAsyncThunk('grammar/fetch_by_chapter', async (chapterId: number) => {
  const response = await axios.get<IGrammar[]>(`${API_URL}/chapter/${chapterId}`);
  return response.data;
});

// Get a single grammar
export const getGrammar = createAsyncThunk('grammar/fetch_entity', async (id: number) => {
  const response = await axios.get<IGrammar>(`${API_URL}/${id}`);
  return response.data;
});

// Create a new grammar
export const createGrammar = createAsyncThunk('grammar/create_entity', async (grammar: IGrammar) => {
  const response = await axios.post<IGrammar>(API_URL, grammar);
  return response.data;
});

// Update an existing grammar
export const updateGrammar = createAsyncThunk('grammar/update_entity', async ({ id, grammar }: { id: number; grammar: IGrammar }) => {
  const response = await axios.put<IGrammar>(`${API_URL}/${id}`, grammar);
  return response.data;
});

// Delete a grammar
export const deleteGrammar = createAsyncThunk('grammar/delete_entity', async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return { id };
});

// ==================== Grammar Example APIs ====================

const EXAMPLE_API_URL = '/api/grammar-examples';

// Get examples for a grammar
export const getGrammarExamples = createAsyncThunk('grammarExample/fetch_by_grammar', async (grammarId: number) => {
  const response = await axios.get<IGrammarExample[]>(`${EXAMPLE_API_URL}/grammar/${grammarId}`);
  return response.data;
});

// Create a grammar example
export const createGrammarExample = createAsyncThunk('grammarExample/create_entity', async (example: IGrammarExample) => {
  const response = await axios.post<IGrammarExample>(EXAMPLE_API_URL, example);
  return response.data;
});

// Update a grammar example
export const updateGrammarExample = createAsyncThunk(
  'grammarExample/update_entity',
  async ({ id, example }: { id: number; example: IGrammarExample }) => {
    const response = await axios.put<IGrammarExample>(`${EXAMPLE_API_URL}/${id}`, example);
    return response.data;
  },
);

// Delete a grammar example
export const deleteGrammarExample = createAsyncThunk('grammarExample/delete_entity', async (id: number) => {
  await axios.delete(`${EXAMPLE_API_URL}/${id}`);
  return { id };
});
