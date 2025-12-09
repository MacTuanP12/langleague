import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = '/api/notifications';

// Notification DTO
export interface NotificationDTO {
  id?: number;
  title?: string;
  message?: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead?: boolean;
  createdDate?: string;
  userId?: number;
  userLogin?: string;
}

// Get unread notification count
export const getUnreadCount = createAsyncThunk('notification/unread_count', async () => {
  try {
    const response = await axios.get<number>(`${apiUrl}/count-unread`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
});

// Get unread notifications
export const getUnreadNotifications = createAsyncThunk(
  'notification/unread_list',
  async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}) => {
    try {
      const response = await axios.get<any>(`${apiUrl}/unread`, {
        params: { page, size },
      });
      return {
        content: response.data.content || response.data,
        totalElements: parseInt(response.headers['x-total-count'] || '0', 10),
      };
    } catch (error: any) {
      console.error('Error fetching unread notifications:', error);
      return { content: [], totalElements: 0 };
    }
  },
);

// Get all notifications
export const getAllNotifications = createAsyncThunk(
  'notification/all_list',
  async ({ page = 0, size = 20 }: { page?: number; size?: number } = {}) => {
    try {
      const response = await axios.get<any>(apiUrl, {
        params: { page, size },
      });
      return {
        content: response.data.content || response.data,
        totalElements: parseInt(response.headers['x-total-count'] || '0', 10),
      };
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return { content: [], totalElements: 0 };
    }
  },
);

// Mark notification as read
export const markAsRead = createAsyncThunk('notification/mark_read', async (id: number) => {
  try {
    await axios.put(`${apiUrl}/${id}/read`);
    return id;
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
});

// Mark all as read
export const markAllAsRead = createAsyncThunk('notification/mark_all_read', async () => {
  try {
    const response = await axios.put<number>(`${apiUrl}/mark-all-read`);
    return response.data;
  } catch (error: any) {
    console.error('Error marking all as read:', error);
    throw error;
  }
});
