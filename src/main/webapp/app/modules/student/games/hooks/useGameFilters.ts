import { useMemo } from 'react';
import { GameCard, DifficultyFilter } from '../constants/game-hub.constants';

interface UseGameFiltersProps {
  games: GameCard[];
  selectedDifficulty: DifficultyFilter;
  searchQuery: string;
}

/**
 * Custom hook to filter games based on difficulty and search query
 * Optimized with useMemo to prevent unnecessary recalculations
 */
export const useGameFilters = ({ games, selectedDifficulty, searchQuery }: UseGameFiltersProps) => {
  const filteredGames = useMemo(() => {
    let result = games;

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      result = result.filter(game => game.difficulty === selectedDifficulty);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        game =>
          game.title.toLowerCase().includes(lowerCaseQuery) ||
          (game.description && game.description.toLowerCase().includes(lowerCaseQuery)),
      );
    }

    return result;
  }, [games, selectedDifficulty, searchQuery]);

  return { filteredGames };
};
