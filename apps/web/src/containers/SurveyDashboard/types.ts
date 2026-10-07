export type SurveyRow = {
  id: string;
  slug: string;
  title: string;
  responses: number;
  completed: number;
};
export type Answer = {
  code: string;
  question: string;
  value: unknown;
  displayValue: string;
  activeMs?: number | null;
  visits?: number | null;
};
export type SectionResult = {
  formulaVersion: string;
  values: Record<string, unknown>;
  interpretation: unknown;
};
export type ScoreValue = {
  label: string;
  score: number;
  maxScore: number;
  level: string;
  levelLabel: string;
};
export type SspmValues = {
  instrument: string;
  complete: true;
  answered: number;
  overall: ScoreValue;
  scales: Record<string, ScoreValue>;
};
export type SccsValues = {
  instrument: string;
  complete: true;
  answered: number;
  average: number;
  sum: number;
  min: number;
  max: number;
  reference: {
    mean: number;
    standardDeviation: number;
    zScore: number;
    sampleSize: number;
  };
};
export type MspssScore = {
  label: string;
  score: number;
  min: 1;
  max: 7;
  level: string;
  levelLabel: string;
  items: number[];
};
export type MspssValues = {
  instrument: string;
  complete: true;
  answered: number;
  overall: MspssScore;
  scales: Record<string, MspssScore>;
};
export type NspsScore = {
  label: string;
  score: number;
  minScore: number;
  maxScore: number;
  items: number[];
};
export type NspsValues = {
  instrument: string;
  complete: true;
  answered: number;
  overall: NspsScore;
  scales: Record<string, NspsScore>;
};
export type FoodScore = {
  label: string;
  score?: number;
  average?: number;
  maxScore?: number;
  min?: number;
  max?: number;
  referenceMean?: number;
  difference?: number;
  elevated?: boolean;
  interpretation?: string;
};
export type FoodValues = {
  instrument: string;
  complete: true;
  answered: number;
  scales: Record<string, FoodScore>;
};
export type AnswerGroup = {
  id: string;
  code: string;
  title: string;
  position: number;
  result: SectionResult | null;
  answers: Answer[];
};
export type Respondent = {
  id: string;
  alias: string;
  status: "in_progress" | "completed" | "abandoned";
  startedAt: string;
  lastActivityAt: string;
  completedAt: string | null;
  deletedAt?: string | null;
  answered: number;
  groups: AnswerGroup[];
};
export type Result = {
  sections: { code: string; title: string; sectionKind: string }[];
  respondents: Respondent[];
  deletedRespondents: Respondent[];
  distribution: {
    code: string;
    text: string;
    value: string | number;
    label?: string;
    count: number;
  }[];
};
