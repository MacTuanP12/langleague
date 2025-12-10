import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/exercise-results';

export interface ExerciseResultDTO {
  id?: number;
  userId?: number;
  exerciseId?: number;
  exerciseType?: string;
  score?: number;
  isCorrect?: boolean;
  submittedAt?: string;
  completionTime?: number; // in seconds
  userAnswer?: string;
}

// Save exercise result
export const saveExerciseResult = createAsyncThunk(
  'exerciseResult/save',
  async (result: ExerciseResultDTO, { dispatch }) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      const response = await axios.post<ExerciseResultDTO>(API_URL, result, {
        headers: {
          'X-Timezone': timezone,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error saving exercise result:', error);
      throw error;
    }
  },
);
