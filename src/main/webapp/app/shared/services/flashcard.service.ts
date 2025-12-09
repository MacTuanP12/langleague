import axios from 'axios';

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

// ==================== Vocabulary APIs ====================

/**
 * Get all saved vocabulary words
 */
export const getMyVocabulary = async () => {
  const response = await axios.get<UserVocabularyDTO[]>('/api/user-vocabularies/my-words');
  return response.data;
};

/**
 * Get vocabulary words to review today (SRS)
 */
export const getVocabularyToReview = async () => {
  const response = await axios.get<UserVocabularyDTO[]>('/api/user-vocabularies/my-words/review-today');
  return response.data;
};

/**
 * Get vocabulary statistics
 */
export const getVocabularyStatistics = async () => {
  const response = await axios.get<VocabularyStatistics>('/api/user-vocabularies/statistics');
  return response.data;
};

/**
 * Update vocabulary review result (SRS algorithm)
 * @param wordId - Word ID
 * @param quality - Quality of recall (0-5)
 */
export const reviewVocabulary = async (wordId: number, quality: number) => {
  await axios.put(`/api/user-vocabularies/review/${wordId}`, null, {
    params: { quality },
  });
};

/**
 * Remove vocabulary from saved words
 */
export const unsaveVocabulary = async (wordId: number) => {
  await axios.delete(`/api/user-vocabularies/unsave/${wordId}`);
};

/**
 * Save vocabulary words in bulk
 */
export const batchSaveVocabulary = async (wordIds: number[]) => {
  await axios.post('/api/user-vocabularies/batch-save', wordIds);
};

/**
 * Update memorization status
 */
export const updateMemorizationStatus = async (wordId: number, isMemorized: boolean) => {
  await axios.put(`/api/user-vocabularies/word/${wordId}/memorized`, null, {
    params: { isMemorized },
  });
};

// ==================== Grammar APIs ====================

/**
 * Get all saved grammar
 */
export const getMyGrammar = async () => {
  const response = await axios.get<UserGrammarDTO[]>('/api/user-grammars/my-grammars');
  return response.data;
};

/**
 * Get grammar to review
 */
export const getGrammarToReview = async () => {
  const response = await axios.get<UserGrammarDTO[]>('/api/user-grammars/my-grammars/review');
  return response.data;
};

/**
 * Get grammar statistics
 */
export const getGrammarStatistics = async () => {
  const response = await axios.get<GrammarStatistics>('/api/user-grammars/statistics');
  return response.data;
};

/**
 * Update grammar review result
 */
export const reviewGrammar = async (grammarId: number, isMemorized: boolean) => {
  await axios.put(`/api/user-grammars/review/${grammarId}`, null, {
    params: { isMemorized },
  });
};

/**
 * Remove grammar from saved
 */
export const unsaveGrammar = async (grammarId: number) => {
  await axios.delete(`/api/user-grammars/unsave/${grammarId}`);
};

export default {
  // Vocabulary
  getMyVocabulary,
  getVocabularyToReview,
  getVocabularyStatistics,
  reviewVocabulary,
  unsaveVocabulary,
  batchSaveVocabulary,
  updateMemorizationStatus,

  // Grammar
  getMyGrammar,
  getGrammarToReview,
  getGrammarStatistics,
  reviewGrammar,
  unsaveGrammar,
};
