/**
 * Bridge Game Types & Interfaces
 */

export interface BridgeGameQuestion {
  grammarId: number;
  sentence: string;
  grammarTitle: string;
  tokens: string[];
  missingWordIndex: number;
  correctAnswer: string;
  options: string[];
}

export interface WrongAnswer {
  question: BridgeGameQuestion;
  userAnswer: string;
  correctAnswer: string;
}

export interface GameStats {
  score: number;
  lives: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  wrongAnswers: WrongAnswer[];
}

export type GameState = 'playing' | 'victory' | 'defeat';

export interface BridgeGameProps {
  unitIds: number[];
  onBack: () => void;
}
