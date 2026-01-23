import { ExerciseType } from 'app/shared/model/enumerations/exercise-type.model';
import { IExerciseOption } from 'app/shared/model/exercise-option.model';

export interface IExercise {
  id?: number;
  exerciseText?: string;
  exerciseType?: ExerciseType;
  correctAnswerRaw?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
  orderIndex?: number;
  unitId?: number;
  unitTitle?: string;
  options?: IExerciseOption[];
}

export const defaultExerciseValue: Readonly<IExercise> = {
  id: undefined,
  exerciseText: '',
  exerciseType: ExerciseType.SINGLE_CHOICE,
  correctAnswerRaw: '',
  audioUrl: '',
  imageUrl: '',
  orderIndex: 0,
  unitId: undefined,
  unitTitle: '',
  options: [],
};

export const defaultValue = defaultExerciseValue;
