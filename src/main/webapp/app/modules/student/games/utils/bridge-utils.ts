/**
 * Bridge Game Utilities
 * Helper functions for multi-language tokenization using Intl.Segmenter
 */

import { BridgeGameQuestion } from '../types/bridge-game.types';

// Type definitions
interface IntlSegmenterOptions {
  granularity?: 'grapheme' | 'word' | 'sentence';
}

interface IntlSegmentPart {
  segment: string;
  isWordLike?: boolean;
}

interface IntlSegmenterConstructor {
  new (
    locale?: string,
    options?: IntlSegmenterOptions,
  ): {
    segment: (input: string) => Iterable<IntlSegmentPart>;
  };
}

interface IntlWithSegmenter {
  Segmenter?: IntlSegmenterConstructor;
}

const IntlExtended = Intl as IntlWithSegmenter;

/**
 * Tokenize sentence using Intl.Segmenter
 * IMPORTANT: Preserves spaces as separate tokens for proper rendering
 *
 * For languages with spaces (English, Korean, Vietnamese):
 *   Input: "I love English"
 *   Output: ["I", " ", "love", " ", "English"]
 *
 * For languages without spaces (Japanese, Chinese):
 *   Input: "私は日本語が好きです"
 *   Output: ["私", "は", "日本語", "が", "好き", "です"]
 */
export const tokenizeSentence = (text: string, lang: string = 'en'): string[] => {
  if (!text || text.trim().length === 0) return [];

  // Fallback for browsers without Intl.Segmenter
  if (typeof IntlExtended.Segmenter === 'undefined') {
    // Split by spaces but keep the spaces
    const parts: string[] = [];
    const words = text.split(/(\s+)/); // Capture groups keep delimiters
    words.forEach(part => {
      if (part.length > 0) {
        parts.push(part);
      }
    });
    return parts;
  }

  try {
    const segmenter = new IntlExtended.Segmenter(lang, { granularity: 'word' });
    const segments = segmenter.segment(text);

    const tokens: string[] = [];
    for (const segment of segments) {
      // Include BOTH words and spaces/punctuation
      // This ensures proper spacing when rendering
      tokens.push(segment.segment);
    }
    return tokens;
  } catch (error) {
    // Fallback: split by spaces but keep them
    const parts: string[] = [];
    const words = text.split(/(\s+)/);
    words.forEach(part => {
      if (part.length > 0) {
        parts.push(part);
      }
    });
    return parts;
  }
};

/**
 * Generate question
 * Selects a word (not space) to be the missing word
 */
export const generateQuestion = (
  grammarId: number,
  sentence: string,
  grammarTitle: string,
  vocabPool: string[],
  lang: string = 'en',
): BridgeGameQuestion | null => {
  const tokens = tokenizeSentence(sentence, lang);
  if (tokens.length < 3) return null;

  // Only select word-like tokens (not spaces or punctuation) as missing word
  const eligibleIndices = tokens
    .map((token, idx) => ({ token, idx }))
    .filter(item => {
      const trimmed = item.token.trim();
      // Must be a word (not just whitespace or punctuation)
      return trimmed.length > 1 && /\w/.test(trimmed);
    })
    .map(item => item.idx);

  if (eligibleIndices.length === 0) return null;

  const missingWordIndex = eligibleIndices[Math.floor(Math.random() * eligibleIndices.length)];
  const correctAnswer = tokens[missingWordIndex];

  const distractors: string[] = [];
  const shuffledPool = [...vocabPool].sort(() => Math.random() - 0.5);

  for (const word of shuffledPool) {
    if (word !== correctAnswer && word.length > 1 && !distractors.includes(word)) {
      distractors.push(word);
      if (distractors.length === 3) break;
    }
  }

  while (distractors.length < 3) {
    const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
    const trimmed = randomToken.trim();
    if (trimmed !== correctAnswer && !distractors.includes(trimmed) && trimmed.length > 1 && /\w/.test(trimmed)) {
      distractors.push(trimmed);
    } else {
      distractors.push(`${correctAnswer}_x`);
    }
  }

  const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

  return {
    grammarId,
    sentence,
    grammarTitle,
    tokens, // Keep ALL tokens including spaces
    missingWordIndex,
    correctAnswer,
    options,
  };
};

/**
 * Build vocabulary pool
 * Only includes actual words (not spaces or punctuation)
 */
export const buildVocabularyPool = (sentences: string[], lang: string = 'en'): string[] => {
  const uniqueWords = new Set<string>();
  sentences.forEach(sentence => {
    const tokens = tokenizeSentence(sentence, lang);
    tokens.forEach(token => {
      const trimmed = token.trim();
      // Only add actual words (not spaces or single characters)
      if (trimmed.length > 1 && /\w/.test(trimmed)) {
        uniqueWords.add(trimmed);
      }
    });
  });
  return Array.from(uniqueWords);
};

/**
 * Detect language
 */
export const detectLanguage = (text: string): string => {
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) return 'ja';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
  if (/[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/.test(text)) return 'vi';
  return 'en';
};
