import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/v1/business-analytics';

export const getBusinessAnalytics = createAsyncThunk(
  'businessAnalytics/fetch_summary',
  async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    try {
      const response = await axios.get(`${API_URL}/summary`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching business analytics:', error);
      throw error;
    }
  },
);
