import { IUnit } from 'app/shared/model/unit.model';
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
  unit?: IUnit;
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
  unit: undefined,
  options: [],
};

export const defaultValue = defaultExerciseValue;
