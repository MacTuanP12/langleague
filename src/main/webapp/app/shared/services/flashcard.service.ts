import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// ==================== Interfaces ====================

export interface WordDTO {
  id: number;
  text: string; // Korean word
  pronunciation?: string;
  meaning: string;
  partOfSpeech?: string;
  imageUrl?: string;
  wordExamples?: Array<{
    exampleText: string;
    translation: string;
  }>;
}

export interface GrammarDTO {
  id: number;
  title: string;
  level?: string;
  description?: string;
  chapter?: any;
}

export interface UserVocabularyDTO {
  id: number;
  word: WordDTO;
  isMemorized: boolean;
  lastReviewed?: string;
  reviewCount?: number;
  remembered?: boolean;
}

export interface UserGrammarDTO {
  id: number;
  grammar: GrammarDTO;
  isMemorized: boolean;
  lastReviewed?: string;
  reviewCount?: number;
  remembered?: boolean;
}

export interface VocabularyStatistics {
  totalWords: number;
  memorizedWords: number;
  wordsToReview: number;
}

export interface GrammarStatistics {
  totalGrammars: number;
  memorizedGrammars: number;
  grammarsToReview: number;
}

// ==================== Vocabulary Thunks ====================

/**
 * Get all saved vocabulary words
 */
export const getMyVocabulary = createAsyncThunk('flashcard/getMyVocabulary', async () => {
  const response = await axios.get<UserVocabularyDTO[]>('/api/user-vocabularies/my-words');
  return response.data;
});

/**
 * Get vocabulary words to review today (SRS)
 */
export const getVocabularyToReview = createAsyncThunk('flashcard/getVocabularyToReview', async () => {
  const response = await axios.get<UserVocabularyDTO[]>('/api/user-vocabularies/my-words/review-today');
  return response.data;
});

/**
 * Get vocabulary statistics
 */
export const getVocabularyStatistics = createAsyncThunk('flashcard/getVocabularyStatistics', async () => {
  const response = await axios.get<VocabularyStatistics>('/api/user-vocabularies/statistics');
  return response.data;
});

/**
 * Update vocabulary review result (SRS algorithm)
 */
export const reviewVocabulary = createAsyncThunk(
  'flashcard/reviewVocabulary',
  async ({ wordId, quality }: { wordId: number; quality: number }) => {
    await axios.put(`/api/user-vocabularies/review/${wordId}`, null, {
      params: { quality },
    });
    return { wordId, quality };
  },
);

/**
 * Remove vocabulary from saved words
 */
export const unsaveVocabulary = createAsyncThunk('flashcard/unsaveVocabulary', async (wordId: number) => {
  await axios.delete(`/api/user-vocabularies/unsave/${wordId}`);
  return wordId;
});

/**
 * Save vocabulary words in bulk
 */
export const batchSaveVocabulary = createAsyncThunk('flashcard/batchSaveVocabulary', async (wordIds: number[]) => {
  await axios.post('/api/user-vocabularies/batch-save', wordIds);
  return wordIds;
});

/**
 * Update memorization status
 */
export const updateMemorizationStatus = createAsyncThunk(
  'flashcard/updateMemorizationStatus',
  async ({ wordId, isMemorized }: { wordId: number; isMemorized: boolean }) => {
    await axios.put(`/api/user-vocabularies/word/${wordId}/memorized`, null, {
      params: { isMemorized },
    });
    return { wordId, isMemorized };
  },
);

// ==================== Grammar Thunks ====================

/**
 * Get all saved grammar
 */
export const getMyGrammar = createAsyncThunk('flashcard/getMyGrammar', async () => {
  const response = await axios.get<UserGrammarDTO[]>('/api/user-grammars/my-grammars');
  return response.data;
});

/**
 * Get grammar to review
 */
export const getGrammarToReview = createAsyncThunk('flashcard/getGrammarToReview', async () => {
  const response = await axios.get<UserGrammarDTO[]>('/api/user-grammars/my-grammars/review');
  return response.data;
});

/**
 * Get grammar statistics
 */
export const getGrammarStatistics = createAsyncThunk('flashcard/getGrammarStatistics', async () => {
  const response = await axios.get<GrammarStatistics>('/api/user-grammars/statistics');
  return response.data;
});

/**
 * Update grammar review result
 */
export const reviewGrammar = createAsyncThunk(
  'flashcard/reviewGrammar',
  async ({ grammarId, isMemorized }: { grammarId: number; isMemorized: boolean }) => {
    await axios.put(`/api/user-grammars/review/${grammarId}`, null, {
      params: { isMemorized },
    });
    return { grammarId, isMemorized };
  },
);

/**
 * Remove grammar from saved list
 */
export const unsaveGrammar = createAsyncThunk('flashcard/unsaveGrammar', async (grammarId: number) => {
  await axios.delete(`/api/user-grammars/unsave/${grammarId}`);
  return grammarId;
});
