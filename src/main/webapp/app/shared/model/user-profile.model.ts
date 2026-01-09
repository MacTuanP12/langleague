import { IUser } from './user.model';
import { ThemeMode } from './enumerations/enums.model';

export interface IUserProfile {
  id?: number;
  streakCount?: number;
  lastLearningDate?: Date | null;
  bio?: string;
  theme?: ThemeMode;
  user?: IUser;
  imageUrl?: string;
  createdDate?: Date | null;
  lastModifiedDate?: Date | null;
}

export const defaultUserProfileValue: Readonly<IUserProfile> = {
  id: 0,
  streakCount: 0,
  lastLearningDate: null,
  bio: '',
  theme: ThemeMode.SYSTEM,
  imageUrl: '',
  createdDate: null,
  lastModifiedDate: null,
};
