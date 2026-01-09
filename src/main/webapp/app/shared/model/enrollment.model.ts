import { IUserProfile } from './user-profile.model';
import { IBook } from './book.model';
import { EnrollmentStatus } from './enumerations/enums.model';

export interface IEnrollment {
  id?: number;
  enrolledAt?: Date;
  status?: EnrollmentStatus;
  userProfile?: IUserProfile;
  userProfileId?: number;
  book?: IBook;
  bookId?: number;
  createdDate?: Date | null;
  lastModifiedDate?: Date | null;
}

export const defaultEnrollmentValue: Readonly<IEnrollment> = {
  id: 0,
  enrolledAt: new Date(),
  status: EnrollmentStatus.ACTIVE,
  userProfileId: 0,
  bookId: 0,
  createdDate: null,
  lastModifiedDate: null,
};
