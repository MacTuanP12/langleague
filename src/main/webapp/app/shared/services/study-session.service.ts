import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/study-sessions';

export interface StudySessionDTO {
  id?: number;
  userId?: number;
  userLogin?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  activityType?: string;
  chapterId?: number;
  wordsLearned?: number;
  exercisesCompleted?: number;
  score?: number;
  notes?: string;
}

// Get all study sessions for current user
export const getStudySessions = createAsyncThunk(
  'studySession/fetch_all',
  async ({ page = 0, size = 100 }: { page?: number; size?: number } = {}) => {
    try {
      const response = await axios.get<StudySessionDTO[]>(API_URL, {
        params: { page, size, sort: 'startTime,desc' },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching study sessions:', error);
      return [];
    }
  },
);

// Get study sessions for last 7 days
export const getWeeklyStudySessions = createAsyncThunk('studySession/fetch_weekly', async () => {
  try {
    const response = await axios.get<StudySessionDTO[]>(API_URL, {
      params: {
        page: 0,
        size: 100,
        sort: 'startTime,desc',
      },
    });

    const sessions = Array.isArray(response.data) ? response.data : [];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter last 7 days
    const weeklySessions = sessions.filter(session => {
      if (!session.startTime) return false;
      const sessionDate = new Date(session.startTime);
      return sessionDate >= weekAgo && sessionDate <= now;
    });

    // Group by day of week
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyHours = dayMap.map(day => ({ day, hours: 0 }));

    weeklySessions.forEach(session => {
      if (session.startTime && session.durationMinutes) {
        const dayIndex = new Date(session.startTime).getDay();
        dailyHours[dayIndex].hours += session.durationMinutes / 60;
      }
    });

    return dailyHours;
  } catch (error: any) {
    console.error('Error fetching weekly study sessions:', error);
    // Return mock data as fallback
    return [
      { day: 'Sun', hours: 0 },
      { day: 'Mon', hours: 0 },
      { day: 'Tue', hours: 0 },
      { day: 'Wed', hours: 0 },
      { day: 'Thu', hours: 0 },
      { day: 'Fri', hours: 0 },
      { day: 'Sat', hours: 0 },
    ];
  }
});

// Create study session
export const createStudySession = createAsyncThunk('studySession/create', async (session: StudySessionDTO) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const response = await axios.post<StudySessionDTO>(API_URL, session, {
    headers: {
      'X-Timezone': timezone,
    },
  });
  return response.data;
});

// Update study session
export const updateStudySession = createAsyncThunk(
  'studySession/update',
  async ({ id, session }: { id: number; session: StudySessionDTO }) => {
    const response = await axios.put<StudySessionDTO>(`${API_URL}/${id}`, session);
    return response.data;
  },
);
