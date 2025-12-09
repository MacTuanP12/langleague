import { createSlice } from '@reduxjs/toolkit';
import {
  getAchievements,
  getAchievement,
  getAvailableAchievements,
  getAchievementsByCategory,
  getMyAchievements,
  getUserAchievement,
  getUserAchievementsByUser,
  unlockAchievement,
  getAchievementProgress,
  AchievementDTO,
  UserAchievementDTO,
} from '../services/achievement.service';

interface AchievementState {
  achievements: AchievementDTO[];
  myAchievements: UserAchievementDTO[];
  availableAchievements: AchievementDTO[];
  entity: AchievementDTO | null;
  userEntity: UserAchievementDTO | null;
  loading: boolean;
  updating: boolean;
  totalItems: number;
  errorMessage: string | null;
  recentUnlock: UserAchievementDTO | null; // For showing unlock notifications
}

const initialState: AchievementState = {
  achievements: [],
  myAchievements: [],
  availableAchievements: [],
  entity: null,
  userEntity: null,
  loading: false,
  updating: false,
  totalItems: 0,
  errorMessage: null,
  recentUnlock: null,
};

export const achievementSlice = createSlice({
  name: 'achievement',
  initialState,
  reducers: {
    reset: () => initialState,
    clearRecentUnlock(state) {
      state.recentUnlock = null;
    },
  },
  extraReducers(builder) {
    builder
      // Get all achievements
      .addCase(getAchievements.pending, state => {
        state.loading = true;
      })
      .addCase(getAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.achievements = action.payload.content;
        state.totalItems = action.payload.totalElements;
      })
      .addCase(getAchievements.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch achievements';
      })
      // Get single achievement
      .addCase(getAchievement.pending, state => {
        state.loading = true;
      })
      .addCase(getAchievement.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
      })
      .addCase(getAchievement.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch achievement';
      })
      // Get available achievements
      .addCase(getAvailableAchievements.pending, state => {
        state.loading = true;
      })
      .addCase(getAvailableAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.availableAchievements = action.payload;
      })
      .addCase(getAvailableAchievements.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch available achievements';
      })
      // Get achievements by category
      .addCase(getAchievementsByCategory.pending, state => {
        state.loading = true;
      })
      .addCase(getAchievementsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.achievements = action.payload;
      })
      .addCase(getAchievementsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch achievements by category';
      })
      // Get my achievements
      .addCase(getMyAchievements.pending, state => {
        state.loading = true;
      })
      .addCase(getMyAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.myAchievements = action.payload;
      })
      .addCase(getMyAchievements.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch my achievements';
      })
      // Get user achievement
      .addCase(getUserAchievement.pending, state => {
        state.loading = true;
      })
      .addCase(getUserAchievement.fulfilled, (state, action) => {
        state.loading = false;
        state.userEntity = action.payload;
      })
      .addCase(getUserAchievement.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch user achievement';
      })
      // Get user achievements by user
      .addCase(getUserAchievementsByUser.fulfilled, (state, action) => {
        state.myAchievements = action.payload;
      })
      // Unlock achievement
      .addCase(unlockAchievement.pending, state => {
        state.updating = true;
      })
      .addCase(unlockAchievement.fulfilled, (state, action) => {
        state.updating = false;
        state.myAchievements.push(action.payload);
        state.recentUnlock = action.payload; // Store for notification
      })
      .addCase(unlockAchievement.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to unlock achievement';
      })
      // Get achievement progress
      .addCase(getAchievementProgress.fulfilled, (state, action) => {
        // Update progress in the state if needed
        // Could be extended to track progress for multiple achievements
      });
  },
});

export const { reset, clearRecentUnlock } = achievementSlice.actions;
export default achievementSlice.reducer;
