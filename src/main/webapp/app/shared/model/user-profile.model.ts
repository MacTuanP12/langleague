import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { ThemeMode } from 'app/shared/model/enumerations/theme-mode.model';

export interface IUserProfile {
  id?: number;
  streakCount?: number | null;
  lastLearningDate?: dayjs.Dayjs | null;
  bio?: string | null;
  theme?: ThemeMode | null;
  user?: IUser;
}

export const defaultUserProfileValue: Readonly<IUserProfile> = {
  id: undefined,
  streakCount: 0,
  lastLearningDate: undefined,
  bio: '',
  theme: ThemeMode.SYSTEM,
  user: undefined,
};

export const defaultValue = defaultUserProfileValue;
