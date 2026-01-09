import { IUserProfile } from './user-profile.model';
import { IUnit } from './unit.model';

export interface IProgress {
  id?: number;
  isCompleted?: boolean;
  updatedAt?: Date;
  userProfile?: IUserProfile;
  userProfileId?: number;
  unit?: IUnit;
  unitId?: number;
  createdDate?: Date | null;
  lastModifiedDate?: Date | null;
}

export const defaultProgressValue: Readonly<IProgress> = {
  id: 0,
  isCompleted: false,
  updatedAt: new Date(),
  userProfileId: 0,
  unitId: 0,
  createdDate: null,
  lastModifiedDate: null,
};
