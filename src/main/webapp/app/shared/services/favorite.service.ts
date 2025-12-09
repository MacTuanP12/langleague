import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/favorites';

// ==================== DTOs ====================

export interface FavoriteChapterDTO {
  id?: number;
  title?: string;
  description?: string;
  book?: {
    id?: number;
    title?: string;
    coverImageUrl?: string;
  };
  isFavorite?: boolean;
}

// ==================== APIs ====================

// Get all favorites - Matches GET /api/favorites
export const getFavorites = createAsyncThunk('favorite/fetch_all', async () => {
  try {
    const response = await axios.get<FavoriteChapterDTO[]>(API_URL);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return [];
  }
});

// Add to favorites - Matches POST /api/favorites/chapter/{chapterId}
export const addFavorite = createAsyncThunk('favorite/add', async (chapterId: number) => {
  await axios.post(`${API_URL}/chapter/${chapterId}`);
  return { chapterId };
});

// Remove from favorites - Matches DELETE /api/favorites/chapter/{chapterId}
export const removeFavorite = createAsyncThunk('favorite/remove', async (chapterId: number) => {
  await axios.delete(`${API_URL}/chapter/${chapterId}`);
  return { chapterId };
});

// Check if favorite - Matches GET /api/favorites/chapter/{chapterId}/check
export const checkFavorite = createAsyncThunk('favorite/check', async (chapterId: number) => {
  const response = await axios.get<boolean>(`${API_URL}/chapter/${chapterId}/check`);
  return { chapterId, isFavorite: response.data };
});

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
};
