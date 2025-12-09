import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/app-users';

export interface IAppUser {
  id?: number;
  userId?: number;
  displayName?: string;
  bio?: string;
  targetLevel?: string;
  studyGoal?: string;
  dailyGoalMinutes?: number;
  preferredStudyTime?: string;
  avatarUrl?: string;
  points?: number;
  level?: number;
  streakDays?: number;
  lastStudyDate?: string;
  totalStudyTime?: number;
  createdDate?: string;
  lastModifiedDate?: string;
  // Notification Settings
  emailNotificationEnabled?: boolean;
  dailyReminderEnabled?: boolean;
}

// Get current user's app user profile
export const getCurrentAppUser = createAsyncThunk('appUser/fetch_current', async () => {
  const response = await axios.get<IAppUser>(`${API_URL}/me`);
  return response.data;
});

// Update current user's app user profile
export const updateCurrentAppUser = createAsyncThunk('appUser/update_current', async (appUser: Partial<IAppUser>) => {
  if (appUser.id) {
    const response = await axios.put<IAppUser>(`${API_URL}/${appUser.id}`, appUser);
    return response.data;
  }
  throw new Error('App user ID is required for update');
});

// Get app user by ID
export const getAppUser = createAsyncThunk('appUser/fetch_entity', async (id: number) => {
  const response = await axios.get<IAppUser>(`${API_URL}/${id}`);
  return response.data;
});

// Create app user
export const createAppUser = createAsyncThunk('appUser/create_entity', async (appUser: IAppUser) => {
  const response = await axios.post<IAppUser>(API_URL, appUser);
  return response.data;
});
