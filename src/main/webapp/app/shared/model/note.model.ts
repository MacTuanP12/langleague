import dayjs from 'dayjs';

export interface INote {
  id?: number;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  userProfileId?: number;
  unitId?: number;
}

export const defaultValue: Readonly<INote> = {};
