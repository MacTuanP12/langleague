import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/learning-reports';

// ==================== DTOs ====================

export interface MyProgressDTO {
  // Personal statistics
  totalStudyTime?: number; // minutes
  totalWords?: number;
  totalGrammars?: number;
  totalExercises?: number;
  booksStarted?: number;
  booksCompleted?: number;
  chaptersCompleted?: number;
  currentStreak?: number;
  longestStreak?: number;
  totalPoints?: number;
  currentLevel?: number;

  // Recent activities
  recentActivities?: ActivityDTO[];

  // Charts data
  weeklyProgress?: ChartDataDTO[];
  skillsProgress?: SkillProgressDTO[];
}

export interface ActivityDTO {
  id?: number;
  type?: 'CHAPTER_COMPLETED' | 'EXERCISE_COMPLETED' | 'ACHIEVEMENT_UNLOCKED' | 'STREAK_MILESTONE';
  title?: string;
  description?: string;
  timestamp?: string;
  points?: number;
}

export interface ChartDataDTO {
  label?: string;
  value?: number;
}

export interface SkillProgressDTO {
  skill?: 'LISTENING' | 'SPEAKING' | 'READING' | 'WRITING';
  completed?: number;
  total?: number;
  percent?: number;
}

export interface LearningHistoryDTO {
  date?: string;
  activities?: ActivityDTO[];
  studyTime?: number;
  exercisesCompleted?: number;
  wordsLearned?: number;
}

// Admin statistics
export interface AdminStatisticsDTO {
  // User statistics
  totalUsers?: number;
  activeUsers?: number;
  newUsers?: number;
  userGrowthRate?: number;

  // Course statistics
  totalCourses?: number;
  publishedCourses?: number;
  draftCourses?: number;
  totalCompletions?: number;

  // Progress statistics
  completionRate?: number;
  engagementRate?: number;
  averageRating?: number;
  retentionRate?: number;

  // Charts data
  userGrowthData?: ChartDataDTO[];
  courseCompletionData?: ChartDataDTO[];

  // Recent activities
  recentActivities?: ActivityDTO[];
}

export interface UserVisitDTO {
  date?: string;
  visits?: number;
  uniqueVisitors?: number;
  averageSessionTime?: number;
}

export interface CompletionStatsDTO {
  bookId?: number;
  bookTitle?: string;
  totalUsers?: number;
  completedUsers?: number;
  completionRate?: number;
  averageCompletionTime?: number;
}

export interface EngagementStatsDTO {
  date?: string;
  activeUsers?: number;
  exercisesCompleted?: number;
  studyTime?: number;
  avgExercisesPerUser?: number;
}

// ==================== USER APIs ====================

// Get my learning progress - Matches GET /api/learning-reports/my-progress
export const getMyProgress = createAsyncThunk('learningReport/fetch_my_progress', async () => {
  try {
    const response = await axios.get<MyProgressDTO>(`${API_URL}/my-progress`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching my progress:', error);
    // Return mock data as fallback
    return {
      totalStudyTime: 0,
      totalWords: 0,
      totalGrammars: 0,
      totalExercises: 0,
      booksStarted: 0,
      booksCompleted: 0,
      chaptersCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      currentLevel: 1,
      recentActivities: [],
      weeklyProgress: [],
      skillsProgress: [],
    };
  }
});

// Export progress report as PDF - Matches GET /api/learning-reports/export
export const exportProgressReport = createAsyncThunk('learningReport/export', async () => {
  const response = await axios.get(`${API_URL}/export`, {
    responseType: 'blob',
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `learning-report-${new Date().toISOString().split('T')[0]}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  return response.data;
});

// Get learning history - Matches GET /api/learning-reports/history
export const getLearningHistory = createAsyncThunk(
  'learningReport/fetch_history',
  async (params?: { startDate?: string; endDate?: string; page?: number; size?: number }) => {
    try {
      const response = await axios.get<LearningHistoryDTO[]>(`${API_URL}/history`, {
        params: {
          startDate: params?.startDate,
          endDate: params?.endDate,
          page: params?.page || 0,
          size: params?.size || 30,
        },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching learning history:', error);
      return [];
    }
  },
);

// ==================== ADMIN APIs ====================

// Get admin statistics - Matches GET /api/learning-reports/admin/statistics
export const getAdminStatistics = createAsyncThunk('learningReport/fetch_admin_stats', async () => {
  try {
    const response = await axios.get<AdminStatisticsDTO>(`${API_URL}/admin/statistics`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching admin statistics:', error);
    throw error;
  }
});

// Get user visit statistics - Matches GET /api/learning-reports/admin/user-visits
export const getUserVisits = createAsyncThunk(
  'learningReport/fetch_user_visits',
  async (params?: { startDate?: string; endDate?: string }) => {
    try {
      const response = await axios.get<UserVisitDTO[]>(`${API_URL}/admin/user-visits`, {
        params: {
          startDate: params?.startDate,
          endDate: params?.endDate,
        },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching user visits:', error);
      return [];
    }
  },
);

// Get completion statistics - Matches GET /api/learning-reports/admin/completion-stats
export const getCompletionStats = createAsyncThunk('learningReport/fetch_completion_stats', async () => {
  try {
    const response = await axios.get<CompletionStatsDTO[]>(`${API_URL}/admin/completion-stats`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching completion stats:', error);
    return [];
  }
});

// Get engagement statistics - Matches GET /api/learning-reports/admin/engagement-stats
export const getEngagementStats = createAsyncThunk(
  'learningReport/fetch_engagement_stats',
  async (params?: { startDate?: string; endDate?: string }) => {
    try {
      const response = await axios.get<EngagementStatsDTO[]>(`${API_URL}/admin/engagement-stats`, {
        params: {
          startDate: params?.startDate,
          endDate: params?.endDate,
        },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching engagement stats:', error);
      return [];
    }
  },
);

// ==================== HELPER FUNCTIONS ====================

// Plain async functions for direct usage
export const getMyProgressApi = async (): Promise<MyProgressDTO> => {
  try {
    const response = await axios.get<MyProgressDTO>(`${API_URL}/my-progress`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching my progress:', error);
    return {
      totalStudyTime: 0,
      totalWords: 0,
      totalGrammars: 0,
      totalExercises: 0,
      booksStarted: 0,
      booksCompleted: 0,
      chaptersCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      currentLevel: 1,
      recentActivities: [],
      weeklyProgress: [],
      skillsProgress: [],
    };
  }
};

export const getLearningHistoryApi = async (params?: {
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}): Promise<LearningHistoryDTO[]> => {
  try {
    const response = await axios.get<LearningHistoryDTO[]>(`${API_URL}/history`, {
      params: {
        startDate: params?.startDate,
        endDate: params?.endDate,
        page: params?.page || 0,
        size: params?.size || 30,
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching learning history:', error);
    return [];
  }
};
