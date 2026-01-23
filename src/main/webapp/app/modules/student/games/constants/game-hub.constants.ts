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
  titleKey: string; // Translation key for title
  description: string;
  descriptionKey: string; // Translation key for description
  icon: string;
  color: string;
  status: GameStatus;
  difficulty: GameDifficulty;
  estimatedTime: string;
  estimatedTimeKey: string; // Translation key for estimated time
}

// TODO: This should be fetched from API endpoint like /api/games/available
export const AVAILABLE_GAMES: GameCard[] = [
  {
    id: 'vocabulary-match',
    title: 'Ghép Từ Vựng',
    titleKey: 'langleague.student.games.list.vocabularyMatch.title',
    description: 'Match words with their meanings in this fast-paced memory game',
    descriptionKey: 'langleague.student.games.list.vocabularyMatch.description',
    icon: '🎯',
    color: '#4A90E2',
    status: 'available',
    difficulty: 'easy',
    estimatedTime: '5-10 min',
    estimatedTimeKey: 'langleague.student.games.list.vocabularyMatch.time',
  },
  {
    id: 'word-scramble',
    title: 'Xếp Chữ',
    titleKey: 'langleague.student.games.list.wordScramble.title',
    description: 'Unscramble letters to form the correct vocabulary words',
    descriptionKey: 'langleague.student.games.list.wordScramble.description',
    icon: '🔤',
    color: '#F5A623',
    status: 'available',
    difficulty: 'medium',
    estimatedTime: '10-15 min',
    estimatedTimeKey: 'langleague.student.games.list.wordScramble.time',
  },
  {
    id: 'bridge-game',
    title: 'Cầu Đứt Gãy',
    titleKey: 'langleague.student.games.list.bridgeGame.title',
    description: 'Fill in the blanks to cross the broken bridge',
    descriptionKey: 'langleague.student.games.list.bridgeGame.description',
    icon: '🌉',
    color: '#9B59B6',
    status: 'available',
    difficulty: 'medium',
    estimatedTime: '10-15 min',
    estimatedTimeKey: 'langleague.student.games.list.bridgeGame.time',
  },
  {
    id: 'grammar-quest',
    title: 'Nhiệm Vụ Ngữ Pháp',
    titleKey: 'langleague.student.games.list.grammarQuest.title',
    description: 'Adventure through grammar challenges and unlock achievements',
    descriptionKey: 'langleague.student.games.list.grammarQuest.description',
    icon: '⚔️',
    color: '#7ED321',
    status: 'coming-soon',
    difficulty: 'medium',
    estimatedTime: '15-20 min',
    estimatedTimeKey: 'langleague.student.games.list.grammarQuest.time',
  },
  {
    id: 'listening-challenge',
    title: 'Thử Thách Nghe',
    titleKey: 'langleague.student.games.list.listeningChallenge.title',
    description: 'Listen and identify the correct words in various contexts',
    descriptionKey: 'langleague.student.games.list.listeningChallenge.description',
    icon: '🎧',
    color: '#BD10E0',
    status: 'coming-soon',
    difficulty: 'hard',
    estimatedTime: '10-15 min',
    estimatedTimeKey: 'langleague.student.games.list.listeningChallenge.time',
  },
  {
    id: 'speed-quiz',
    title: 'Đố Nhanh',
    titleKey: 'langleague.student.games.list.speedQuiz.title',
    description: 'Answer as many questions as possible in limited time',
    descriptionKey: 'langleague.student.games.list.speedQuiz.description',
    icon: '⚡',
    color: '#FF6B6B',
    status: 'available',
    difficulty: 'hard',
    estimatedTime: '5 min',
    estimatedTimeKey: 'langleague.student.games.list.speedQuiz.time',
  },
  {
    id: 'sentence-builder',
    title: 'Xây Dựng Câu',
    titleKey: 'langleague.student.games.list.sentenceBuilder.title',
    description: 'Build correct sentences from scrambled words and phrases',
    descriptionKey: 'langleague.student.games.list.sentenceBuilder.description',
    icon: '🏗️',
    color: '#50E3C2',
    status: 'coming-soon',
    difficulty: 'medium',
    estimatedTime: '10-15 min',
    estimatedTimeKey: 'langleague.student.games.list.sentenceBuilder.time',
  },
];

export const DIFFICULTY_FILTERS: Array<{ key: DifficultyFilter; label: string; labelKey: string; icon: string }> = [
  { key: 'all', label: 'All Games', labelKey: 'langleague.student.games.difficulty.all', icon: '' },
  { key: 'easy', label: 'Easy', labelKey: 'langleague.student.games.difficulty.easy', icon: 'bi-star' },
  { key: 'medium', label: 'Medium', labelKey: 'langleague.student.games.difficulty.medium', icon: 'bi-star-fill' },
  { key: 'hard', label: 'Hard', labelKey: 'langleague.student.games.difficulty.hard', icon: 'bi-fire' },
];
