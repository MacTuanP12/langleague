import { IExercise } from './exercise.model';

export interface IExerciseOption {
  id?: number;
  optionText?: string;
  isCorrect?: boolean;
  orderIndex?: number;
  exercise?: IExercise;
  exerciseId?: number;
  createdDate?: Date | null;
  lastModifiedDate?: Date | null;
}

export const defaultExerciseOptionValue: Readonly<IExerciseOption> = {
  id: 0,
  optionText: '',
  isCorrect: false,
  orderIndex: 0,
  exerciseId: 0,
  createdDate: null,
  lastModifiedDate: null,
};
