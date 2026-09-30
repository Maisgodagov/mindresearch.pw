export type Scale = {
  label: string;
  score?: number;
  average?: number;
  max?: number;
  min?: number;
  maxScore?: number;
  minScore?: number;
  referenceMean?: number;
  difference?: number;
  elevated?: boolean;
  levelLabel?: string;
  category?: string;
  interpretation?: string;
};
export type BuiltInResultValues = {
  overall: Scale & { score: number; levelLabel: string; maxScore: number; category?: string; interpretation?: string };
  scales: Record<string, Scale>;
  domains: Record<string, Scale>;
  facets: Record<string, Scale>;
  reference: { zScore: number; mean: number; standardDeviation?: number; sampleSize: number };
  average: number;
  sum: number;
  score: number;
  max: number;
  levelLabel: string;
};
export type ConfiguredResultValues = {
  scales?: Record<string, Scale & { score: number; average: number; min: number; max: number }>;
};
export type Result = {
  code: string;
  title: string;
  formulaVersion: string;
  values: BuiltInResultValues & ConfiguredResultValues;
};
export type Presentation = {
  showResults: boolean;
  showScores: boolean;
  title: string;
  text: string;
};
export type MethodSource = { title: string; url: string };
export type SourceGroup = {
  code: string;
  title: string;
  sources: MethodSource[];
};
