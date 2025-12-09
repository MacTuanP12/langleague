import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/comments';

// ==================== DTOs ====================

export interface CommentDTO {
  id?: number;
  content?: string;
  createdAt?: string;
  appUser?: {
    id?: number;
    login?: string;
    displayName?: string;
    avatarUrl?: string;
  };
  chapter?: {
    id?: number;
    title?: string;
  };
  parentCommentId?: number;
  replies?: CommentDTO[];
}

// ==================== APIs ====================

// Get comments for a specific chapter - Matches GET /api/comments/chapter/{chapterId}
export const getChapterComments = createAsyncThunk(
  'comment/fetch_by_chapter',
  async (params: { chapterId: number; page?: number; size?: number; sort?: string }) => {
    try {
      const response = await axios.get<any>(`${API_URL}/chapter/${params.chapterId}`, {
        params: {
          page: params.page || 0,
          size: params.size || 50,
          sort: params.sort || 'createdAt,desc',
        },
      });
      return {
        content: response.data.content || response.data,
        totalElements: parseInt(response.headers['x-total-count'] || '0', 10),
      };
    } catch (error: any) {
      console.error('Error fetching chapter comments:', error);
      return { content: [], totalElements: 0 };
    }
  },
);

// Get my comments - Matches GET /api/comments/my
export const getMyComments = createAsyncThunk('comment/fetch_my', async (params?: { page?: number; size?: number }) => {
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
    console.error('Error fetching my comments:', error);
    return { content: [], totalElements: 0 };
  }
});

// Get a single comment - Matches GET /api/comments/{id}
export const getComment = createAsyncThunk('comment/fetch_entity', async (id: number) => {
  const response = await axios.get<CommentDTO>(`${API_URL}/${id}`);
  return response.data;
});

// Create comment - Matches POST /api/comments
export const createComment = createAsyncThunk('comment/create', async (comment: CommentDTO) => {
  const response = await axios.post<CommentDTO>(API_URL, comment);
  return response.data;
});

// Update comment - Matches PUT /api/comments/{id}
export const updateComment = createAsyncThunk('comment/update', async ({ id, comment }: { id: number; comment: CommentDTO }) => {
  const response = await axios.put<CommentDTO>(`${API_URL}/${id}`, comment);
  return response.data;
});

// Delete comment - Matches DELETE /api/comments/{id}
export const deleteComment = createAsyncThunk('comment/delete', async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return { id };
});

// Get replies for a comment - Matches GET /api/comments/{id}/replies
export const getCommentReplies = createAsyncThunk('comment/fetch_replies', async (commentId: number) => {
  try {
    const response = await axios.get<CommentDTO[]>(`${API_URL}/${commentId}/replies`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching comment replies:', error);
    return [];
  }
});

export default {
  getChapterComments,
  getMyComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  getCommentReplies,
};
