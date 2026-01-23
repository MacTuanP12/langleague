import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { IVocabulary } from 'app/shared/model/vocabulary.model';

export interface GameVocabulary {
  id: number;
  word: string;
  meaning: string;
  phonetic?: string;
  example?: string;
  imageUrl?: string;
}

interface UseGameDataResult {
  vocabularies: GameVocabulary[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Mock data for testing when API fails or for immediate testing
const MOCK_VOCABULARIES: GameVocabulary[] = [
  {
    id: 1,
    word: 'Hello',
    meaning: 'Xin chào',
    phonetic: '/həˈloʊ/',
    example: 'Hello, how are you?',
  },
  {
    id: 2,
    word: 'Goodbye',
    meaning: 'Tạm biệt',
    phonetic: '/ɡʊdˈbaɪ/',
    example: 'Goodbye, see you tomorrow!',
  },
  {
    id: 3,
    word: 'Thank you',
    meaning: 'Cảm ơn',
    phonetic: '/θæŋk juː/',
    example: 'Thank you for your help.',
  },
  {
    id: 4,
    word: 'Please',
    meaning: 'Làm ơn',
    phonetic: '/pliːz/',
    example: 'Please help me with this.',
  },
  {
    id: 5,
    word: 'Sorry',
    meaning: 'Xin lỗi',
    phonetic: '/ˈsɒri/',
    example: 'Sorry, I made a mistake.',
  },
  {
    id: 6,
    word: 'Friend',
    meaning: 'Bạn bè',
    phonetic: '/frend/',
    example: 'She is my best friend.',
  },
  {
    id: 7,
    word: 'Love',
    meaning: 'Yêu',
    phonetic: '/lʌv/',
    example: 'I love learning English.',
  },
  {
    id: 8,
    word: 'Happy',
    meaning: 'Vui vẻ',
    phonetic: '/ˈhæpi/',
    example: 'I am very happy today.',
  },
];

/**
 * Custom hook to fetch vocabulary data for games
 * @param unitIds - The ID(s) of the unit(s) to fetch vocabularies from. Can be a single number or an array of numbers.
 * @param useMockData - Force use of mock data for testing (default: false)
 */
export const useGameData = (unitIds?: number | number[], useMockData = false): UseGameDataResult => {
  const [vocabularies, setVocabularies] = useState<GameVocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Memoize fetchVocabularies to prevent recreation on every render
  const fetchVocabularies = useCallback(async () => {
    // If mock data is explicitly requested or no unitIds provided, use mock data
    if (useMockData || !unitIds || (Array.isArray(unitIds) && unitIds.length === 0)) {
      setLoading(true);
      // Simulate API delay for realistic testing
      setTimeout(() => {
        if (isMountedRef.current) {
          setVocabularies(MOCK_VOCABULARIES);
          setLoading(false);
          setError(null);
        }
      }, 500);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      if (Array.isArray(unitIds)) {
        // If unitIds is an array, use the POST endpoint for multiple units
        response = await axios.post<IVocabulary[]>('/api/vocabularies/by-units', unitIds);
      } else {
        // If unitIds is a single number, use the GET endpoint for a single unit
        response = await axios.get<IVocabulary[]>(`/api/vocabularies/game-data/${unitIds}`);
      }

      if (!isMountedRef.current) return;

      // Transform API data to game-friendly format
      const gameVocabularies: GameVocabulary[] = response.data.map(vocab => ({
        id: vocab.id || 0,
        word: vocab.word || '',
        meaning: vocab.meaning || '',
        phonetic: vocab.phonetic || undefined,
        example: vocab.example || undefined,
        imageUrl: vocab.imageUrl || undefined,
      }));

      if (gameVocabularies.length === 0) {
        // If API returns empty, fall back to mock data
        console.warn('API returned empty vocabulary list, using mock data');
        setVocabularies(MOCK_VOCABULARIES);
      } else {
        setVocabularies(gameVocabularies);
      }
      setLoading(false);
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Failed to fetch vocabularies, using mock data:', err);
      // Fallback to mock data on error
      setVocabularies(MOCK_VOCABULARIES);
      setError('Failed to load vocabularies from server. Using sample data.');
      setLoading(false);
    }
  }, [unitIds, useMockData]); // Proper dependencies - React will handle array comparison

  useEffect(() => {
    fetchVocabularies();
  }, [fetchVocabularies]);

  const refetch = useCallback(() => {
    fetchVocabularies();
  }, [fetchVocabularies]);

  return {
    vocabularies,
    loading,
    error,
    refetch,
  };
};
