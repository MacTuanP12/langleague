import { IExercise } from 'app/shared/model/exercise.model';

export interface IExerciseOption {
  id?: number;
  optionText?: string;
  isCorrect?: boolean;
  orderIndex?: number | null;
  /**
   * Parent exercise reference.
   * Note: Usually undefined when fetched as part of exercise.options
   * to avoid circular references. Only populated when fetching individual options.
   */
  exercise?: IExercise;
  exerciseId?: number; // Added for reducer compatibility
}

export const defaultExerciseOptionValue: Readonly<IExerciseOption> = {
  id: undefined,
  optionText: '',
  isCorrect: false,
  orderIndex: 0,
  exercise: undefined,
};

export const defaultValue = defaultExerciseOptionValue;
