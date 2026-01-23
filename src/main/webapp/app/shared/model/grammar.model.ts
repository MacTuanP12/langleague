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
  unitId?: number;
  unitTitle?: string;
}

export const defaultGrammarValue: Readonly<IGrammar> = {
  id: undefined,
  title: '',
  contentMarkdown: '',
  exampleUsage: '',
  orderIndex: 0,
  unitId: undefined,
  unitTitle: '',
};

export const defaultValue = defaultGrammarValue;
