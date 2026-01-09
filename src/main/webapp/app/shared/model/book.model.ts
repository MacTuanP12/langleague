export interface IBook {
  id?: number;
  title?: string;
  description?: string; // TextBlob
  coverImageUrl?: string;
  isPublic?: boolean;
  createdAt?: Date;
  teacherProfileId?: number; // Relationship to UserProfile
  uploadedBy?: string; // Teacher/uploader name (frontend extension)
  createdDate?: Date;
  lastModifiedDate?: Date;
}

export const defaultBookValue: Readonly<IBook> = {
  id: undefined,
  title: '',
  description: '',
  coverImageUrl: '',
  isPublic: false,
  createdAt: undefined,
  teacherProfileId: undefined,
  uploadedBy: '',
  createdDate: undefined,
  lastModifiedDate: undefined,
};
