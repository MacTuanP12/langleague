import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUserProgress } from '../model/models';

export type { IUserProgress };

export interface IDashboardStats {
  wordsLearned: number;
  quizzesCompleted: number;
  courseProgress: number;
  languagesStudying: number;
  totalLessons: number;
  completedLessons: number;
  currentStreak: number;
  longestStreak: number;
}

export const getDashboardStats = async (): Promise<IDashboardStats> => {
  try {
    // Sử dụng nhiều API có sẵn thay vì tạo endpoint mới
    const [reportRes, currentStreakRes, longestStreakRes, wordsCountRes, exercisesCountRes] = await Promise.all([
      axios.get('/api/learning-reports/my-progress'),
      axios.get('/api/learning-streaks/current'),
      axios.get('/api/learning-streaks/longest'),
      axios.get('/api/user-vocabularies/count'),
      axios.get('/api/exercise-results/count'),
    ]);

    const report = reportRes.data;

    const stats: IDashboardStats = {
      wordsLearned: wordsCountRes.data || 0,
      quizzesCompleted: exercisesCountRes.data || 0,
      courseProgress: Math.round(report.averageProgress || 0),
      languagesStudying: 1,
      totalLessons: report.totalChaptersStarted || 0,
      completedLessons: report.totalChaptersCompleted || 0,
      currentStreak: currentStreakRes.data || 0,
      longestStreak: longestStreakRes.data || 0,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values on error
    return {
      wordsLearned: 0,
      quizzesCompleted: 0,
      courseProgress: 0,
      languagesStudying: 1,
      totalLessons: 0,
      completedLessons: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  }
};

export const getWeeklyProgress = async (): Promise<any[]> => {
  try {
    // Lấy study sessions và tính weekly progress ở frontend
    const response = await axios.get('/api/study-sessions', {
      params: { page: 0, size: 100, sort: 'startTime,desc' },
    });

    const sessions = response.data;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter last 7 days
    const weeklySessions = sessions.filter((s: any) => {
      if (!s.startTime) return false;
      const sessionDate = new Date(s.startTime);
      return sessionDate >= weekAgo && sessionDate <= now;
    });

    // Group by day of week
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyHours = dayMap.map(day => ({ day, hours: 0 }));

    weeklySessions.forEach((session: any) => {
      if (session.startTime && session.durationMinutes) {
        const dayIndex = new Date(session.startTime).getDay();
        dailyHours[dayIndex].hours += session.durationMinutes / 60;
      }
    });

    return dailyHours;
  } catch (error) {
    console.error('Error fetching weekly progress:', error);
    // Return empty data for 7 days
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({ day, hours: 0 }));
  }
};

export const getUserProgress = async (): Promise<IUserProgress[]> => {
  const response = await axios.get<IUserProgress[]>('api/chapter-progresses/my-chapters');
  return response.data;
};

export const getAllUserProgress = createAsyncThunk('userProgress/fetch_all', async () => {
  const response = await axios.get<IUserProgress[]>('api/chapter-progresses/my-chapters');
  return response.data;
});

export const createUserProgress = createAsyncThunk('userProgress/create', async (progress: IUserProgress) => {
  const response = await axios.post<IUserProgress>('api/user-progresses', progress);
  return response.data;
});
