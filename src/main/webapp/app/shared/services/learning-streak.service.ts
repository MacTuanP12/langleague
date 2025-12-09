import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/learning-streaks';

// Get current streak
export const getCurrentStreak = createAsyncThunk('learningStreak/fetch_current', async () => {
  try {
    const response = await axios.get<number>(`${API_URL}/current`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching current streak:', error);
    return 0;
  }
});

// Get longest streak
export const getLongestStreak = createAsyncThunk('learningStreak/fetch_longest', async () => {
  try {
    const response = await axios.get<number>(`${API_URL}/longest`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching longest streak:', error);
    return 0;
  }
});

// Record study activity
export const recordStudyActivity = createAsyncThunk('learningStreak/record', async () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await axios.post(`${API_URL}/record`, null, {
      headers: {
        'X-Timezone': timezone,
      },
    });
    return true;
  } catch (error: any) {
    console.error('Error recording study activity:', error);
    return false;
  }
});
