import { IUnit } from './unit.model';

export interface IVocabulary {
  id?: number;
  word?: string;
  phonetic?: string;
  meaning?: string;
  example?: string;
  imageUrl?: string;
  orderIndex?: number;
  unit?: IUnit;
  unitId?: number;
  createdDate?: Date | null;
  lastModifiedDate?: Date | null;
}

export const defaultVocabularyValue: Readonly<IVocabulary> = {
  id: 0,
  word: '',
  phonetic: '',
  meaning: '',
  example: '',
  imageUrl: '',
  orderIndex: 0,
  unitId: 0,
  createdDate: null,
  lastModifiedDate: null,
};
