import { IUnit } from 'app/shared/model/unit.model';

export interface IVocabulary {
  id?: number;
  word?: string;
  phonetic?: string | null;
  meaning?: string;
  example?: string | null;
  imageUrl?: string | null;
  orderIndex?: number;
  unit?: IUnit;
}

export const defaultVocabularyValue: Readonly<IVocabulary> = {
  id: undefined,
  word: '',
  phonetic: '',
  meaning: '',
  example: '',
  imageUrl: '',
  orderIndex: 0,
  unit: undefined,
};

export const defaultValue = defaultVocabularyValue;
