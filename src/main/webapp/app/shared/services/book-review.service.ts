import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/book-reviews';

// ==================== DTOs ====================

export interface BookReviewDTO {
  id?: number;
  bookId?: number;
  bookTitle?: string;
  appUserId?: number;
  userLogin?: string;
  userDisplayName?: string;
  userAvatarUrl?: string;
  rating?: number; // 1-5 stars
  title?: string;
  content?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  helpfulCount?: number;
  isHelpful?: boolean; // Current user marked as helpful
}

// ==================== APIs ====================

// Get reviews for a specific book - Matches GET /api/book-reviews/book/{bookId}
export const getBookReviews = createAsyncThunk(
  'bookReview/fetch_by_book',
  async (params: { bookId: number; page?: number; size?: number; sort?: string }) => {
    try {
      const response = await axios.get<any>(`${API_URL}/book/${params.bookId}`, {
        params: {
          page: params.page || 0,
          size: params.size || 20,
          sort: params.sort || 'createdDate,desc',
        },
      });
      return {
        content: response.data.content || response.data,
        totalElements: parseInt(response.headers['x-total-count'] || '0', 10),
      };
    } catch (error: any) {
      console.error('Error fetching book reviews:', error);
      return { content: [], totalElements: 0 };
    }
  },
);

// Get my reviews - Matches GET /api/book-reviews/my
export const getMyReviews = createAsyncThunk('bookReview/fetch_my', async (params?: { page?: number; size?: number }) => {
  try {
    const response = await axios.get<any>(`${API_URL}/my`, {
      params: {
        page: params?.page || 0,
        size: params?.size || 20,
      },
    });
    return {
      content: response.data.content || response.data,
      totalElements: parseInt(response.headers['x-total-count'] || '0', 10),
    };
  } catch (error: any) {
    console.error('Error fetching my reviews:', error);
    return { content: [], totalElements: 0 };
  }
});

// Get a single review - Matches GET /api/book-reviews/{id}
export const getBookReview = createAsyncThunk('bookReview/fetch_entity', async (id: number) => {
  const response = await axios.get<BookReviewDTO>(`${API_URL}/${id}`);
  return response.data;
});

// Create review - Matches POST /api/book-reviews
export const createBookReview = createAsyncThunk('bookReview/create', async (review: BookReviewDTO) => {
  const response = await axios.post<BookReviewDTO>(API_URL, review);
  return response.data;
});

// Update review - Matches PUT /api/book-reviews/{id}
export const updateBookReview = createAsyncThunk('bookReview/update', async ({ id, review }: { id: number; review: BookReviewDTO }) => {
  const response = await axios.put<BookReviewDTO>(`${API_URL}/${id}`, review);
  return response.data;
});

// Delete review - Matches DELETE /api/book-reviews/{id}
export const deleteBookReview = createAsyncThunk('bookReview/delete', async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return { id };
});

// Mark review as helpful - Matches POST /api/book-reviews/{id}/helpful
export const markReviewHelpful = createAsyncThunk('bookReview/mark_helpful', async (id: number) => {
  try {
    const response = await axios.post<BookReviewDTO>(`${API_URL}/${id}/helpful`);
    return response.data;
  } catch (error: any) {
    console.error('Error marking review as helpful:', error);
    throw error;
  }
});

// Get review statistics for a book - Matches GET /api/book-reviews/book/{bookId}/stats
export const getBookReviewStats = createAsyncThunk('bookReview/fetch_stats', async (bookId: number) => {
  try {
    const response = await axios.get<{
      totalReviews: number;
      averageRating: number;
      ratingDistribution: { [key: number]: number };
    }>(`${API_URL}/book/${bookId}/stats`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching review stats:', error);
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }
});

// ==================== HELPER FUNCTIONS ====================

// Plain async functions for direct usage
export const getBookReviewsApi = async (params: {
  bookId: number;
  page?: number;
  size?: number;
  sort?: string;
}): Promise<{ content: BookReviewDTO[]; totalElements: number }> => {
  try {
    const response = await axios.get<any>(`${API_URL}/book/${params.bookId}`, {
      params: {
        page: params.page || 0,
        size: params.size || 20,
        sort: params.sort || 'createdDate,desc',
      },
    });
    return {
      content: response.data.content || response.data,
      totalElements: parseInt(response.headers['x-total-count'] || '0', 10),
    };
  } catch (error: any) {
    console.error('Error fetching book reviews:', error);
    return { content: [], totalElements: 0 };
  }
};

export const createBookReviewApi = async (review: BookReviewDTO): Promise<BookReviewDTO> => {
  const response = await axios.post<BookReviewDTO>(API_URL, review);
  return response.data;
};

export const updateBookReviewApi = async (id: number, review: BookReviewDTO): Promise<BookReviewDTO> => {
  const response = await axios.put<BookReviewDTO>(`${API_URL}/${id}`, review);
  return response.data;
};

export const deleteBookReviewApi = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
