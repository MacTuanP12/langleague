import dayjs from 'dayjs';
import { IUserProfile } from 'app/shared/model/user-profile.model';
import { IUnit } from 'app/shared/model/unit.model';

export interface IProgress {
  id?: number;
  isCompleted?: boolean;
  updatedAt?: dayjs.Dayjs;
  userProfile?: IUserProfile;
  unit?: IUnit;
}

export const defaultProgressValue: Readonly<IProgress> = {
  id: undefined,
  isCompleted: false,
  updatedAt: undefined,
  userProfile: undefined,
  unit: undefined,
};

export const defaultValue = defaultProgressValue;
