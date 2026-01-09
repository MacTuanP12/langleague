import { IBook } from './book.model';
import { IVocabulary } from './vocabulary.model';
import { IGrammar } from './grammar.model';
import { IExercise } from './exercise.model';
import { IProgress } from './progress.model';

export interface IUnit {
  id?: number;
  title?: string;
  orderIndex?: number;
  summary?: string;
  book?: IBook;
  bookId?: number;
  vocabularies?: IVocabulary[];
  grammars?: IGrammar[];
  exercises?: IExercise[];
  progresses?: IProgress[];
  vocabularyCount?: number;
  grammarCount?: number;
  exerciseCount?: number;
  createdDate?: Date | null;
  lastModifiedDate?: Date | null;
}

export const defaultUnitValue: Readonly<IUnit> = {
  id: 0,
  title: '',
  orderIndex: 0,
  summary: '',
  bookId: 0,
  vocabularyCount: 0,
  grammarCount: 0,
  exerciseCount: 0,
  createdDate: null,
  lastModifiedDate: null,
};
