import dayjs from 'dayjs';
import { IUserProfile } from 'app/shared/model/user-profile.model';
import { IBook } from 'app/shared/model/book.model';
import { EnrollmentStatus } from 'app/shared/model/enumerations/enrollment-status.model';

export interface IEnrollment {
  id?: number;
  enrolledAt?: dayjs.Dayjs;
  status?: EnrollmentStatus;
  userProfile?: IUserProfile;
  book?: IBook;
}

export const defaultEnrollmentValue: Readonly<IEnrollment> = {
  id: undefined,
  enrolledAt: undefined,
  status: EnrollmentStatus.ACTIVE,
  userProfile: undefined,
  book: undefined,
};

export const defaultValue = defaultEnrollmentValue;
