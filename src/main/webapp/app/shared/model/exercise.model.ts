import { IUnit } from './unit.model';
import { IExerciseOption } from './exercise-option.model';
import { ExerciseType } from './enumerations/enums.model';

export interface IExercise {
  id?: number;
  exerciseText?: string;
  exerciseType?: ExerciseType;
  correctAnswerRaw?: string;
  audioUrl?: string;
  imageUrl?: string;
  orderIndex?: number;
  unit?: IUnit;
  unitId?: number;
  options?: IExerciseOption[];
  createdDate?: Date | null;
  lastModifiedDate?: Date | null;
}

export const defaultExerciseValue: Readonly<IExercise> = {
  id: 0,
  exerciseText: '',
  exerciseType: ExerciseType.SINGLE_CHOICE,
  correctAnswerRaw: '',
  audioUrl: '',
  imageUrl: '',
  orderIndex: 0,
  unitId: 0,
  createdDate: null,
  lastModifiedDate: null,
};
