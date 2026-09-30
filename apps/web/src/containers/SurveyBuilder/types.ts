export type Instrument = {
  id: string;
  code?: string;
  title: string;
  description: string;
  questionCount: number;
  isVerified: boolean;
  scoringCode?: string;
  author?: string;
};

export type Option = { value: string; label: string };

export type Question = {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text' | 'number';
  required: boolean;
  options: Option[];
};

export type Section = {
  id: string;
  kind: 'library' | 'custom';
  instrumentId?: string;
  title: string;
  questionCount?: number;
  questions?: Question[];
  isVerified?: boolean;
  useSharedOptions?: boolean;
  sharedOptions?: Option[];
};
