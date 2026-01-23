import { IBook } from 'app/shared/model/book.model';
import { IVocabulary } from 'app/shared/model/vocabulary.model';
import { IGrammar } from 'app/shared/model/grammar.model';
import { IExercise } from 'app/shared/model/exercise.model';
import { IProgress } from 'app/shared/model/progress.model';

export interface IUnit {
  id?: number;
  title?: string;
  orderIndex?: number;
  summary?: string | null;
  book?: IBook;
  bookId?: number; // Added for reducer compatibility
  vocabularies?: IVocabulary[];
  grammars?: IGrammar[];
  exercises?: IExercise[];
  progresses?: IProgress[];
  vocabularyCount?: number;
  grammarCount?: number;
  exerciseCount?: number;
}

export const defaultUnitValue: Readonly<IUnit> = {
  id: undefined,
  title: '',
  orderIndex: 0,
  summary: '',
  book: undefined,
  vocabularies: [],
  grammars: [],
  exercises: [],
  progresses: [],
  vocabularyCount: 0,
  grammarCount: 0,
  exerciseCount: 0,
};

export const defaultValue = defaultUnitValue;
