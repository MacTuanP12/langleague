import axios from 'axios';

const API_URL = '/api/chapter-progresses';

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

/**
 * Service for user's chapter progress
 */

// Get all chapters user has saved and is learning
export const getMyChapters = () => {
  return axios.get<MyChapterDTO[]>(`${API_URL}/my-chapters`);
};

// Get chapters that user is currently learning (not completed)
export const getMyInProgressChapters = () => {
  return axios.get<MyChapterDTO[]>(`${API_URL}/my-chapters/in-progress`);
};

// Get chapters that user has completed
export const getMyCompletedChapters = () => {
  return axios.get<MyChapterDTO[]>(`${API_URL}/my-chapters/completed`);
};

// Mark chapter as completed
export const markChapterComplete = (chapterId: number) => {
  return axios.post(`${API_URL}/chapter/${chapterId}/complete`);
};

// Update chapter progress
export const updateChapterProgress = (chapterId: number, percent: number) => {
  return axios.put(`${API_URL}/chapter/${chapterId}/progress`, null, {
    params: { percent },
  });
};

export default {
  getMyChapters,
  getMyInProgressChapters,
  getMyCompletedChapters,
  markChapterComplete,
  updateChapterProgress,
};
