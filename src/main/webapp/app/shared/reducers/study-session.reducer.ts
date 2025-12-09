import axios from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { serializeAxiosError } from '../utils/reducer.utils';
import { IStudySession } from '../model/models';

export type StudySession = IStudySession;

export interface StudySessionState {
  loading: boolean;
  errorMessage: string | null;
  currentSession: StudySession | null;
  sessions: StudySession[];
  updating: boolean;
  updateSuccess: boolean;
  totalItems: number;
}

const initialState: StudySessionState = {
  loading: false,
  errorMessage: null,
  currentSession: null,
  sessions: [],
  updating: false,
  updateSuccess: false,
  totalItems: 0,
};

// Actions

export const startStudySession = createAsyncThunk(
  'studySession/start',
  async (lessonId: number) => {
    const response = await axios.post('api/study-sessions/start', lessonId);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

export const completeStudySession = createAsyncThunk(
  'studySession/complete',
  async (sessionId: number) => {
    const response = await axios.put(`api/study-sessions/${sessionId}/complete`);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

export const updateProgress = createAsyncThunk(
  'studySession/updateProgress',
  async ({ sessionId, progress }: { sessionId: number; progress: any }) => {
    const response = await axios.put(`api/study-sessions/${sessionId}/progress`, progress);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

export const getMyStudySessions = createAsyncThunk(
  'studySession/getMySessions',
  async ({ page, size, sort }: { page?: number; size?: number; sort?: string } = {}) => {
    const requestUrl = `api/study-sessions/my${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
    const response = await axios.get(requestUrl);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

export const getMyStats = createAsyncThunk(
  'studySession/getMyStats',
  async ({ startDate, endDate }: { startDate?: string; endDate?: string } = {}) => {
    const requestUrl = `api/study-sessions/my/stats${startDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`;
    const response = await axios.get(requestUrl);
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

// Slice

export const StudySessionSlice = createSlice({
  name: 'studySession',
  initialState,
  reducers: {
    reset(state) {
      state.loading = false;
      state.errorMessage = null;
      state.currentSession = null;
      state.updating = false;
      state.updateSuccess = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(startStudySession.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.updateSuccess = false;
      })
      .addCase(startStudySession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
        state.updateSuccess = true;
      })
      .addCase(startStudySession.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Could not start session';
      })
      .addCase(completeStudySession.fulfilled, (state, action) => {
        state.currentSession = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.currentSession = action.payload;
        state.updateSuccess = true;
      })
      .addCase(getMyStudySessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload.content;
        state.totalItems = parseInt(action.payload.totalElements, 10);
      })
      .addCase(getMyStudySessions.pending, state => {
        state.loading = true;
      });
  },
});

export const { reset } = StudySessionSlice.actions;

export default StudySessionSlice.reducer;
