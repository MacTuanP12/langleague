import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUserProfile } from 'app/shared/model/user-profile.model';
import { ThemeMode } from 'app/shared/model/enumerations/enums.model';

interface UserProfileState {
  userProfile: IUserProfile | null;
  loading: boolean;
  updating: boolean;
  errorMessage: string | null;
}

const initialState: UserProfileState = {
  userProfile: null,
  loading: false,
  updating: false,
  errorMessage: null,
};

// Async thunks
export const fetchCurrentUserProfile = createAsyncThunk('userProfile/fetchCurrent', async () => {
  // Use the secure endpoint that returns only the current user's profile
  const response = await axios.get<IUserProfile>('/api/user-profiles/current');
  return response.data;
});

export const fetchUserProfileById = createAsyncThunk('userProfile/fetchById', async (id: number) => {
  const response = await axios.get<IUserProfile>(`/api/user-profiles/${id}`);
  return response.data;
});

export const createUserProfile = createAsyncThunk('userProfile/create', async (userProfile: IUserProfile) => {
  const response = await axios.post<IUserProfile>('/api/user-profiles', userProfile);
  return response.data;
});

export const updateUserProfile = createAsyncThunk('userProfile/update', async (userProfile: IUserProfile) => {
  const response = await axios.put<IUserProfile>(`/api/user-profiles/${userProfile.id}`, userProfile);
  return response.data;
});

export const updateUserProfileTheme = createAsyncThunk('userProfile/updateTheme', async (theme: ThemeMode, { getState, dispatch }) => {
  // WORKAROUND: BE missing /api/user-profiles/theme PATCH endpoint
  // 1. Get current profile
  // 2. Update theme field
  // 3. PUT update

  // We can try to use the profile in state if available
  interface RootState {
    userProfile: { userProfile: IUserProfile | null };
  }
  const state = getState() as RootState;
  let profile = state.userProfile.userProfile;

  if (!profile) {
    // Try to fetch it first
    const action = await dispatch(fetchCurrentUserProfile());
    if (fetchCurrentUserProfile.fulfilled.match(action)) {
      profile = action.payload;
    } else {
      throw new Error('Could not fetch profile to update theme');
    }
  }

  if (profile) {
    const updatedProfile = { ...profile, themeMode: theme };
    const response = await axios.put<IUserProfile>(`/api/user-profiles/${profile.id}`, updatedProfile);
    return response.data;
  }

  throw new Error('No profile to update');
});

export const checkStreak = createAsyncThunk('userProfile/checkStreak', async () => {
  const response = await axios.post<{ streakCount: number; milestoneReached: boolean }>('/api/user-profiles/sync-streak');
  return response.data;
});

export const deleteUserProfile = createAsyncThunk('userProfile/delete', async (id: number) => {
  await axios.delete(`/api/user-profiles/${id}`);
  return id;
});

// Slice
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    reset: () => initialState,
    clearUserProfile(state) {
      state.userProfile = null;
    },
  },
  extraReducers(builder) {
    builder
      // fetchCurrentUserProfile
      .addCase(fetchCurrentUserProfile.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchCurrentUserProfile.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchCurrentUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch user profile';
      })
      // fetchUserProfileById
      .addCase(fetchUserProfileById.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUserProfileById.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfileById.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Failed to fetch user profile';
      })
      // createUserProfile
      .addCase(createUserProfile.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(createUserProfile.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
        state.updating = false;
        state.userProfile = action.payload;
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to create user profile';
      })
      // updateUserProfile
      .addCase(updateUserProfile.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
        state.updating = false;
        state.userProfile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update user profile';
      })
      // updateUserProfileTheme
      .addCase(updateUserProfileTheme.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(updateUserProfileTheme.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
        state.updating = false;
        state.userProfile = action.payload;
      })
      .addCase(updateUserProfileTheme.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to update theme';
      })
      // checkStreak
      .addCase(checkStreak.fulfilled, (state, action) => {
        if (state.userProfile) {
          state.userProfile.streakCount = action.payload.streakCount;
        }
      })
      // deleteUserProfile
      .addCase(deleteUserProfile.pending, state => {
        state.updating = true;
        state.errorMessage = null;
      })
      .addCase(deleteUserProfile.fulfilled, state => {
        state.updating = false;
        state.userProfile = null;
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.error.message || 'Failed to delete user profile';
      });
  },
});

export const { reset, clearUserProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;
