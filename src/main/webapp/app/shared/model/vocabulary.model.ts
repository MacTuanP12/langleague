export interface IVocabulary {
  id?: number;
  word?: string;
  phonetic?: string | null;
  meaning?: string;
  example?: string | null;
  imageUrl?: string | null;
  orderIndex?: number;
  unitId?: number;
  unitTitle?: string;
}

export const defaultVocabularyValue: Readonly<IVocabulary> = {
  id: undefined,
  word: '',
  phonetic: '',
  meaning: '',
  example: '',
  imageUrl: '',
  orderIndex: 0,
  unitId: undefined,
  unitTitle: '',
};

export const defaultValue = defaultVocabularyValue;
