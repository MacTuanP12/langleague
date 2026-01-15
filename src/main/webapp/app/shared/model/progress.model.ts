import dayjs from 'dayjs';
import { IUserProfile } from 'app/shared/model/user-profile.model';
import { IUnit } from 'app/shared/model/unit.model';

export interface IProgress {
  id?: number;
  isCompleted?: boolean;
  updatedAt?: dayjs.Dayjs;
  isBookmarked?: boolean;
  score?: number;
  lastAccessedAt?: dayjs.Dayjs;
  completionPercentage?: number;
  isVocabularyFinished?: boolean;
  isGrammarFinished?: boolean;
  isExerciseFinished?: boolean;
  userProfileId?: number;
  unitId?: number;
  // Legacy support for nested objects
  userProfile?: IUserProfile;
  unit?: IUnit;
}

export const defaultProgressValue: Readonly<IProgress> = {
  id: undefined,
  isCompleted: false,
  updatedAt: undefined,
  isBookmarked: false,
  score: 0,
  lastAccessedAt: undefined,
  completionPercentage: 0,
  isVocabularyFinished: false,
  isGrammarFinished: false,
  isExerciseFinished: false,
  userProfileId: undefined,
  unitId: undefined,
  userProfile: undefined,
  unit: undefined,
};

export const defaultValue = defaultProgressValue;
