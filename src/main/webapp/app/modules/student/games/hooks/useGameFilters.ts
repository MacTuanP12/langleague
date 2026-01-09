import { useMemo } from 'react';
import { GameCard, DifficultyFilter } from '../game-hub.constants';

interface UseGameFiltersProps {
  games: GameCard[];
  selectedDifficulty: DifficultyFilter;
}

/**
 * Custom hook to filter games based on difficulty
 * Optimized with useMemo to prevent unnecessary recalculations
 */
export const useGameFilters = ({ games, selectedDifficulty }: UseGameFiltersProps) => {
  const filteredGames = useMemo(() => {
    if (selectedDifficulty === 'all') {
      return games;
    }
    return games.filter(game => game.difficulty === selectedDifficulty);
  }, [games, selectedDifficulty]);

  return { filteredGames };
};

