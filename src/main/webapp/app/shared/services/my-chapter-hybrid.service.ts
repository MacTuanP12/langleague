import axios from 'axios';

const API_URL_PROGRESS = '/api/chapter-progresses';
const API_URL_SAVED = '/api/user/saved-chapters';

export interface MyChapterDTO {
  chapterId: number;
  chapterTitle: string;
  chapterOrderIndex: number;
  bookId: number;
  bookTitle: string;
  bookThumbnail?: string;
  bookLevel?: string;
  progressPercent: number;
  completed: boolean;
  lastAccessed: string;
}

export interface UserChapterDTO {
  id?: number;
  savedAt: string;
  learningStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  lastAccessedAt?: string;
  isFavorite?: boolean;
  notes?: string;
  tags?: string;
  chapterTitle: string;
  chapterOrderIndex: number;
  bookId: number;
  bookTitle: string;
  bookThumbnail?: string;
  bookLevel?: string;
  progressPercent?: number;
  completed?: boolean;
}

/**
 * Service for user's chapter progress and saved chapters
 * Supports BOTH ChapterProgress and UserChapter
 */

// ========== ChapterProgress APIs (Auto-tracked) ==========

// Get all chapters user has learned (from ChapterProgress)
export const getMyChapters = () => {
  return axios.get<MyChapterDTO[]>(`${API_URL_PROGRESS}/my-chapters`);
};

// Get chapters in progress
export const getMyInProgressChapters = () => {
  return axios.get<MyChapterDTO[]>(`${API_URL_PROGRESS}/my-chapters/in-progress`);
};

// Get completed chapters
export const getMyCompletedChapters = () => {
  return axios.get<MyChapterDTO[]>(`${API_URL_PROGRESS}/my-chapters/completed`);
};

// Mark chapter as completed
export const markChapterComplete = (chapterId: number) => {
  return axios.post(`${API_URL_PROGRESS}/chapter/${chapterId}/complete`);
};

// Update chapter progress
export const updateChapterProgress = (chapterId: number, percent: number) => {
  return axios.put(`${API_URL_PROGRESS}/chapter/${chapterId}/progress`, null, {
    params: { percent },
  });
};

// ========== UserChapter APIs (User-saved) ==========

// Get all saved chapters (from UserChapter)
export const getSavedChapters = () => {
  return axios.get<UserChapterDTO[]>(`${API_URL_SAVED}`);
};

// Get favorite chapters
export const getFavoriteChapters = () => {
  return axios.get<UserChapterDTO[]>(`${API_URL_SAVED}/favorites`);
};

// Get chapters by status
export const getChaptersByStatus = (status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED') => {
  return axios.get<UserChapterDTO[]>(`${API_URL_SAVED}/status/${status}`);
};

// Save chapter to library
export const saveChapter = (chapterId: number) => {
  return axios.post<UserChapterDTO>(`${API_URL_SAVED}/${chapterId}`);
};

// Remove chapter from library
export const removeChapter = (chapterId: number) => {
  return axios.delete(`${API_URL_SAVED}/${chapterId}`);
};

// Toggle favorite - calls the UserChapter endpoint for saved chapters
export const toggleFavorite = (chapterId: number) => {
  return axios.put<UserChapterDTO>(`${API_URL_SAVED}/${chapterId}/favorite`);
};

// Update notes
export const updateNotes = (chapterId: number, notes: string) => {
  return axios.put<UserChapterDTO>(`${API_URL_SAVED}/${chapterId}/notes`, { notes });
};

// Update tags
export const updateTags = (chapterId: number, tags: string) => {
  return axios.put<UserChapterDTO>(`${API_URL_SAVED}/${chapterId}/tags`, { tags });
};

// Check if chapter is saved
export const isChapterSaved = (chapterId: number) => {
  return axios.get<boolean>(`${API_URL_SAVED}/${chapterId}/is-saved`);
};

export default {
  // ChapterProgress (auto-tracked)
  getMyChapters,
  getMyInProgressChapters,
  getMyCompletedChapters,
  markChapterComplete,
  updateChapterProgress,

  // UserChapter (user-saved)
  getSavedChapters,
  getFavoriteChapters,
  getChaptersByStatus,
  saveChapter,
  removeChapter,
  toggleFavorite,
  updateNotes,
  updateTags,
  isChapterSaved,
};
