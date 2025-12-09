import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/achievements';
const USER_ACHIEVEMENT_URL = '/api/user-achievements';

// ==================== DTOs ====================

export interface AchievementDTO {
  id?: number;
  name?: string;
  description?: string;
  iconUrl?: string;
  badgeColor?: string;
  category?: 'STREAK' | 'COMPLETION' | 'VOCABULARY' | 'GRAMMAR' | 'EXERCISE' | 'SOCIAL' | 'SPECIAL';
  requirement?: number;
  points?: number;
  rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  isActive?: boolean;
}

export interface UserAchievementDTO {
  id?: number;
  appUserId?: number;
  userLogin?: string;
  achievement?: AchievementDTO;
  achievementId?: number;
  unlockedDate?: string;
  progress?: number;
  completed?: boolean;
}

// ==================== ACHIEVEMENT APIs ====================

export const getAchievements = createAsyncThunk(
  'achievement/fetch_all',
  async (params?: { page?: number; size?: number; category?: string }) => {
    try {
      const response = await axios.get<any>(API_URL, {
        params: {
          page: params?.page || 0,
          size: params?.size || 100,
          category: params?.category,
        },
      });
      return {
        content: response.data.content || response.data,
        totalElements: parseInt(response.headers['x-total-count'] || '0', 10),
      };
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      return { content: [], totalElements: 0 };
    }
  },
);

export const getAchievement = createAsyncThunk('achievement/fetch_entity', async (id: number) => {
  const response = await axios.get<AchievementDTO>(`${API_URL}/${id}`);
  return response.data;
});

export const getAvailableAchievements = createAsyncThunk('achievement/fetch_available', async () => {
  try {
    const response = await axios.get<AchievementDTO[]>(`${API_URL}/available`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching available achievements:', error);
    return [];
  }
});

export const getAchievementsByCategory = createAsyncThunk('achievement/fetch_by_category', async (category: string) => {
  try {
    const response = await axios.get<AchievementDTO[]>(`${API_URL}/category/${category}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching achievements by category:', error);
    return [];
  }
});

export const createAchievement = createAsyncThunk('achievement/create', async (achievement: AchievementDTO) => {
  const response = await axios.post<AchievementDTO>(API_URL, achievement);
  return response.data;
});

export const updateAchievement = createAsyncThunk(
  'achievement/update',
  async ({ id, achievement }: { id: number; achievement: AchievementDTO }) => {
    const response = await axios.put<AchievementDTO>(`${API_URL}/${id}`, achievement);
    return response.data;
  },
);

export const deleteAchievement = createAsyncThunk('achievement/delete', async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return { id };
});

// ==================== USER ACHIEVEMENT APIs ====================

export const getMyAchievements = createAsyncThunk('userAchievement/fetch_my', async () => {
  try {
    const response = await axios.get<UserAchievementDTO[]>(`${USER_ACHIEVEMENT_URL}/my`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching my achievements:', error);
    return [];
  }
});

export const getUserAchievement = createAsyncThunk('userAchievement/fetch_entity', async (id: number) => {
  const response = await axios.get<UserAchievementDTO>(`${USER_ACHIEVEMENT_URL}/${id}`);
  return response.data;
});

export const getUserAchievementsByUser = createAsyncThunk('userAchievement/fetch_by_user', async (userId: number) => {
  try {
    const response = await axios.get<UserAchievementDTO[]>(`${USER_ACHIEVEMENT_URL}/user/${userId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching user achievements:', error);
    return [];
  }
});

export const unlockAchievement = createAsyncThunk('userAchievement/unlock', async (achievementId: number) => {
  try {
    const response = await axios.post<UserAchievementDTO>(`${USER_ACHIEVEMENT_URL}/unlock`, { achievementId });
    return response.data;
  } catch (error: any) {
    console.error('Error unlocking achievement:', error);
    throw error;
  }
});

export const getAchievementProgress = createAsyncThunk('userAchievement/fetch_progress', async (achievementId: number) => {
  try {
    const response = await axios.get<{ progress: number; total: number; percent: number }>(
      `${USER_ACHIEVEMENT_URL}/progress/${achievementId}`,
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching achievement progress:', error);
    return { progress: 0, total: 0, percent: 0 };
  }
});

// ==================== HELPER FUNCTIONS ====================

export const getAchievementsApi = async (params?: {
  page?: number;
  size?: number;
  category?: string;
}): Promise<{ content: AchievementDTO[]; totalElements: number }> => {
  try {
    const response = await axios.get<any>(API_URL, {
      params: {
        page: params?.page || 0,
        size: params?.size || 100,
        category: params?.category,
      },
    });
    return {
      content: response.data.content || response.data,
      totalElements: parseInt(response.headers['x-total-count'] || '0', 10),
    };
  } catch (error: any) {
    console.error('Error fetching achievements:', error);
    return { content: [], totalElements: 0 };
  }
};

export const getMyAchievementsApi = async (): Promise<UserAchievementDTO[]> => {
  try {
    const response = await axios.get<UserAchievementDTO[]>(`${USER_ACHIEVEMENT_URL}/my`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching my achievements:', error);
    return [];
  }
};

export const getAvailableAchievementsApi = async (): Promise<AchievementDTO[]> => {
  try {
    const response = await axios.get<AchievementDTO[]>(`${API_URL}/available`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching available achievements:', error);
    return [];
  }
};

export const unlockAchievementApi = async (achievementId: number): Promise<UserAchievementDTO> => {
  const response = await axios.post<UserAchievementDTO>(`${USER_ACHIEVEMENT_URL}/unlock`, { achievementId });
  return response.data;
};
