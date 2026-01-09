import { IUnit } from './unit.model';

export interface IGrammarExample {
  en: string;
  ko: string;
}

export interface IGrammar {
  id?: number;
  title?: string;
  contentMarkdown?: string;
  exampleUsage?: string; // JSON string of IGrammarExample[]
  orderIndex?: number;
  unit?: IUnit;
  unitId?: number;
  createdDate?: Date | null;
  lastModifiedDate?: Date | null;
}

export const defaultGrammarValue: Readonly<IGrammar> = {
  id: 0,
  title: '',
  contentMarkdown: '',
  exampleUsage: '',
  orderIndex: 0,
  unitId: 0,
  createdDate: null,
  lastModifiedDate: null,
};
