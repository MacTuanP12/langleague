import { IUnit } from 'app/shared/model/unit.model';

export interface IGrammarExample {
  en: string;
  ko: string;
}

export interface IGrammar {
  id?: number;
  title?: string;
  contentMarkdown?: string;
  exampleUsage?: string | null; // JSON string of IGrammarExample[]
  orderIndex?: number;
  unit?: IUnit;
}

export const defaultGrammarValue: Readonly<IGrammar> = {
  id: undefined,
  title: '',
  contentMarkdown: '',
  exampleUsage: '',
  orderIndex: 0,
  unit: undefined,
};

export const defaultValue = defaultGrammarValue;
