import dayjs from 'dayjs';
import { IUserProfile } from 'app/shared/model/user-profile.model';

export interface IBook {
  id?: number;
  title?: string;
  description?: string | null; // TextBlob
  coverImageUrl?: string | null;
  isPublic?: boolean;
  createdAt?: dayjs.Dayjs;
  teacherProfile?: IUserProfile;
}

export const defaultBookValue: Readonly<IBook> = {
  id: undefined,
  title: '',
  description: '',
  coverImageUrl: '',
  isPublic: false,
  createdAt: undefined,
  teacherProfile: undefined,
};

export const defaultValue = defaultBookValue;
