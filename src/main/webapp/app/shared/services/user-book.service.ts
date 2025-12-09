import axios from 'axios';

const API_URL = '/api/user/my-books';

export interface UserBookDTO {
  id?: number;
  savedAt: string;
  learningStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  currentChapterId?: number;
  currentChapterTitle?: string;
  lastAccessedAt?: string;
  progressPercentage?: number;
  isFavorite?: boolean;
  appUserId?: number;
  appUserDisplayName?: string;
  bookId: number;
  bookTitle: string;
  bookThumbnail?: string;
  bookLevel?: string;
  bookDescription?: string;
}

export interface UserBookStatisticsDTO {
  totalBooks: number;
  booksInProgress: number;
  booksCompleted: number;
  favoriteBooks: number;
}

/**
 * Service for user's book library
 */
export const getMyBooks = () => {
  return axios.get<UserBookDTO[]>(API_URL);
};

export const getFavoriteBooks = () => {
  return axios.get<UserBookDTO[]>(`${API_URL}/favorites`);
};

export const getBooksByStatus = (status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED') => {
  return axios.get<UserBookDTO[]>(`${API_URL}/status/${status}`);
};

export const getStatistics = () => {
  return axios.get<UserBookStatisticsDTO>(`${API_URL}/statistics`);
};

export const saveBook = (bookId: number) => {
  return axios.post<UserBookDTO>(`${API_URL}/${bookId}`);
};

export const removeBook = (bookId: number) => {
  return axios.delete(`${API_URL}/${bookId}`);
};

export const updateLearningStatus = (bookId: number, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED') => {
  return axios.put<UserBookDTO>(`${API_URL}/${bookId}/status`, { status });
};

export const updateCurrentChapter = (bookId: number, chapterId: number) => {
  return axios.put<UserBookDTO>(`${API_URL}/${bookId}/chapter`, { chapterId });
};

export const updateProgress = (bookId: number, progressPercentage: number) => {
  return axios.put<UserBookDTO>(`${API_URL}/${bookId}/progress`, { progressPercentage });
};

export const toggleFavorite = (bookId: number) => {
  return axios.put<UserBookDTO>(`${API_URL}/${bookId}/favorite`);
};

export default {
  getMyBooks,
  getFavoriteBooks,
  getBooksByStatus,
  getStatistics,
  saveBook,
  removeBook,
  updateLearningStatus,
  updateCurrentChapter,
  updateProgress,
  toggleFavorite,
};
