import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IListeningExercise,
  ISpeakingExercise,
  IReadingExercise,
  IWritingExercise,
  IListeningOption,
  IReadingOption,
} from '../model/models';

// ==================== Listening Exercise APIs ====================

const LISTENING_API_URL = '/api/listening-exercises';

export const getListeningExercisesByChapter = createAsyncThunk('listeningExercise/fetch_by_chapter', async (chapterId: number) => {
  const response = await axios.get<IListeningExercise[]>(`${LISTENING_API_URL}/chapter/${chapterId}`);
  return response.data;
});

export const getListeningExercise = createAsyncThunk('listeningExercise/fetch_entity', async (id: number) => {
  const response = await axios.get<IListeningExercise>(`${LISTENING_API_URL}/${id}`);
  return response.data;
});

export const createListeningExercise = createAsyncThunk('listeningExercise/create_entity', async (exercise: IListeningExercise) => {
  const response = await axios.post<IListeningExercise>(LISTENING_API_URL, exercise);
  return response.data;
});

export const updateListeningExercise = createAsyncThunk(
  'listeningExercise/update_entity',
  async ({ id, exercise }: { id: number; exercise: IListeningExercise }) => {
    const response = await axios.put<IListeningExercise>(`${LISTENING_API_URL}/${id}`, exercise);
    return response.data;
  },
);

export const deleteListeningExercise = createAsyncThunk('listeningExercise/delete_entity', async (id: number) => {
  await axios.delete(`${LISTENING_API_URL}/${id}`);
  return { id };
});

// Listening Options
const LISTENING_OPTION_API_URL = '/api/listening-options';

export const getListeningOptions = createAsyncThunk('listeningOption/fetch_by_exercise', async (exerciseId: number) => {
  const response = await axios.get<IListeningOption[]>(`${LISTENING_OPTION_API_URL}/exercise/${exerciseId}`);
  return response.data;
});

export const createListeningOption = createAsyncThunk('listeningOption/create_entity', async (option: IListeningOption) => {
  const response = await axios.post<IListeningOption>(LISTENING_OPTION_API_URL, option);
  return response.data;
});

export const updateListeningOption = createAsyncThunk(
  'listeningOption/update_entity',
  async ({ id, option }: { id: number; option: IListeningOption }) => {
    const response = await axios.put<IListeningOption>(`${LISTENING_OPTION_API_URL}/${id}`, option);
    return response.data;
  },
);

export const deleteListeningOption = createAsyncThunk('listeningOption/delete_entity', async (id: number) => {
  await axios.delete(`${LISTENING_OPTION_API_URL}/${id}`);
  return { id };
});

// ==================== Speaking Exercise APIs ====================

const SPEAKING_API_URL = '/api/speaking-exercises';

export const getSpeakingExercisesByChapter = createAsyncThunk('speakingExercise/fetch_by_chapter', async (chapterId: number) => {
  const response = await axios.get<ISpeakingExercise[]>(`${SPEAKING_API_URL}/chapter/${chapterId}`);
  return response.data;
});

export const getSpeakingExercise = createAsyncThunk('speakingExercise/fetch_entity', async (id: number) => {
  const response = await axios.get<ISpeakingExercise>(`${SPEAKING_API_URL}/${id}`);
  return response.data;
});

export const createSpeakingExercise = createAsyncThunk('speakingExercise/create_entity', async (exercise: ISpeakingExercise) => {
  const response = await axios.post<ISpeakingExercise>(SPEAKING_API_URL, exercise);
  return response.data;
});

export const updateSpeakingExercise = createAsyncThunk(
  'speakingExercise/update_entity',
  async ({ id, exercise }: { id: number; exercise: ISpeakingExercise }) => {
    const response = await axios.put<ISpeakingExercise>(`${SPEAKING_API_URL}/${id}`, exercise);
    return response.data;
  },
);

export const deleteSpeakingExercise = createAsyncThunk('speakingExercise/delete_entity', async (id: number) => {
  await axios.delete(`${SPEAKING_API_URL}/${id}`);
  return { id };
});

// ==================== Reading Exercise APIs ====================

const READING_API_URL = '/api/reading-exercises';

export const getReadingExercisesByChapter = createAsyncThunk('readingExercise/fetch_by_chapter', async (chapterId: number) => {
  const response = await axios.get<IReadingExercise[]>(`${READING_API_URL}/chapter/${chapterId}`);
  return response.data;
});

export const getReadingExercise = createAsyncThunk('readingExercise/fetch_entity', async (id: number) => {
  const response = await axios.get<IReadingExercise>(`${READING_API_URL}/${id}`);
  return response.data;
});

export const createReadingExercise = createAsyncThunk('readingExercise/create_entity', async (exercise: IReadingExercise) => {
  const response = await axios.post<IReadingExercise>(READING_API_URL, exercise);
  return response.data;
});

export const updateReadingExercise = createAsyncThunk(
  'readingExercise/update_entity',
  async ({ id, exercise }: { id: number; exercise: IReadingExercise }) => {
    const response = await axios.put<IReadingExercise>(`${READING_API_URL}/${id}`, exercise);
    return response.data;
  },
);

export const deleteReadingExercise = createAsyncThunk('readingExercise/delete_entity', async (id: number) => {
  await axios.delete(`${READING_API_URL}/${id}`);
  return { id };
});

// Reading Options
const READING_OPTION_API_URL = '/api/reading-options';

export const getReadingOptions = createAsyncThunk('readingOption/fetch_by_exercise', async (exerciseId: number) => {
  const response = await axios.get<IReadingOption[]>(`${READING_OPTION_API_URL}/exercise/${exerciseId}`);
  return response.data;
});

export const createReadingOption = createAsyncThunk('readingOption/create_entity', async (option: IReadingOption) => {
  const response = await axios.post<IReadingOption>(READING_OPTION_API_URL, option);
  return response.data;
});

export const updateReadingOption = createAsyncThunk(
  'readingOption/update_entity',
  async ({ id, option }: { id: number; option: IReadingOption }) => {
    const response = await axios.put<IReadingOption>(`${READING_OPTION_API_URL}/${id}`, option);
    return response.data;
  },
);

export const deleteReadingOption = createAsyncThunk('readingOption/delete_entity', async (id: number) => {
  await axios.delete(`${READING_OPTION_API_URL}/${id}`);
  return { id };
});

// ==================== Writing Exercise APIs ====================

const WRITING_API_URL = '/api/writing-exercises';

export const getWritingExercisesByChapter = createAsyncThunk('writingExercise/fetch_by_chapter', async (chapterId: number) => {
  const response = await axios.get<IWritingExercise[]>(`${WRITING_API_URL}/chapter/${chapterId}`);
  return response.data;
});

export const getWritingExercise = createAsyncThunk('writingExercise/fetch_entity', async (id: number) => {
  const response = await axios.get<IWritingExercise>(`${WRITING_API_URL}/${id}`);
  return response.data;
});

export const createWritingExercise = createAsyncThunk('writingExercise/create_entity', async (exercise: IWritingExercise) => {
  const response = await axios.post<IWritingExercise>(WRITING_API_URL, exercise);
  return response.data;
});

export const updateWritingExercise = createAsyncThunk(
  'writingExercise/update_entity',
  async ({ id, exercise }: { id: number; exercise: IWritingExercise }) => {
    const response = await axios.put<IWritingExercise>(`${WRITING_API_URL}/${id}`, exercise);
    return response.data;
  },
);

export const deleteWritingExercise = createAsyncThunk('writingExercise/delete_entity', async (id: number) => {
  await axios.delete(`${WRITING_API_URL}/${id}`);
  return { id };
});
