/**
 * Game Hub Constants
 * Extracted hardcoded game data to separate constants file
 */

export type GameStatus = 'available' | 'coming-soon' | 'locked';
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type DifficultyFilter = 'all' | GameDifficulty;

export interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  status: GameStatus;
  difficulty: GameDifficulty;
  estimatedTime: string;
}

// TODO: This should be fetched from API endpoint like /api/games/available
export const AVAILABLE_GAMES: GameCard[] = [
  {
    id: 'vocabulary-match',
    title: 'Vocabulary Match',
    description: 'Match words with their meanings in this fast-paced memory game',
    icon: '🎯',
    color: '#4A90E2',
    status: 'coming-soon',
    difficulty: 'easy',
    estimatedTime: '5-10 min',
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    description: 'Unscramble letters to form the correct vocabulary words',
    icon: '🔤',
    color: '#F5A623',
    status: 'coming-soon',
    difficulty: 'medium',
    estimatedTime: '10-15 min',
  },
  {
    id: 'grammar-quest',
    title: 'Grammar Quest',
    description: 'Adventure through grammar challenges and unlock achievements',
    icon: '⚔️',
    color: '#7ED321',
    status: 'coming-soon',
    difficulty: 'medium',
    estimatedTime: '15-20 min',
  },
  {
    id: 'listening-challenge',
    title: 'Listening Challenge',
    description: 'Listen and identify the correct words in various contexts',
    icon: '🎧',
    color: '#BD10E0',
    status: 'coming-soon',
    difficulty: 'hard',
    estimatedTime: '10-15 min',
  },
  {
    id: 'speed-quiz',
    title: 'Speed Quiz',
    description: 'Answer as many questions as possible in limited time',
    icon: '⚡',
    color: '#FF6B6B',
    status: 'coming-soon',
    difficulty: 'hard',
    estimatedTime: '5 min',
  },
  {
    id: 'sentence-builder',
    title: 'Sentence Builder',
    description: 'Build correct sentences from scrambled words and phrases',
    icon: '🏗️',
    color: '#50E3C2',
    status: 'coming-soon',
    difficulty: 'medium',
    estimatedTime: '10-15 min',
  },
];

export const DIFFICULTY_FILTERS: Array<{ key: DifficultyFilter; label: string; icon: string }> = [
  { key: 'all', label: 'All Games', icon: '' },
  { key: 'easy', label: 'Easy', icon: 'bi-star' },
  { key: 'medium', label: 'Medium', icon: 'bi-star-fill' },
  { key: 'hard', label: 'Hard', icon: 'bi-fire' },
];

