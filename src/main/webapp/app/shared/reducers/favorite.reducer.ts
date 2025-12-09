import { createSlice } from '@reduxjs/toolkit';
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from '../services/favorite.service';
import { FavoriteChapterDTO } from '../services/favorite.service';

interface FavoriteState {
  entities: FavoriteChapterDTO[];
  loading: boolean;
  updating: boolean;
  favoriteMap: Record<number, boolean>; // chapterId -> isFavorite
  errorMessage: string | null;
}

const initialState: FavoriteState = {
  entities: [],
  loading: false,
  updating: false,
  favoriteMap: {},
  errorMessage: null,
};

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      // Get favorites
      .addCase(getFavorites.pending, state => {
        state.loading = true;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload;
        // Build favorite map
        state.favoriteMap = {};
        action.payload.forEach(chapter => {
          if (chapter.id) {
            state.favoriteMap[chapter.id] = true;
          }
        });
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch favorites';
      })
      // Add favorite
      .addCase(addFavorite.pending, state => {
        state.updating = true;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.updating = false;
        state.favoriteMap[action.payload.chapterId] = true;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to add favorite';
      })
      // Remove favorite
      .addCase(removeFavorite.pending, state => {
        state.updating = true;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.updating = false;
        state.favoriteMap[action.payload.chapterId] = false;
        state.entities = state.entities.filter(e => e.id !== action.payload.chapterId);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to remove favorite';
      })
      // Check favorite
      .addCase(checkFavorite.fulfilled, (state, action) => {
        state.favoriteMap[action.payload.chapterId] = action.payload.isFavorite;
      });
  },
});

export const { reset } = favoriteSlice.actions;
export default favoriteSlice.reducer;
