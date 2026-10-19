export type Variable = {
  id: string;
  label: string;
  source: string;
  version: string | null;
  categories?: { code: number; label: string }[];
};
export type Participant = {
  id: string;
  alias: string;
  age: number | null;
  gender: string | null;
  status: string;
  values: Record<string, number>;
};
export type Sample = {
  id: string;
  name: string;
  revision: number;
  members: string[];
  candidates: string[];
  unavailable: string[];
  definition: {
    completedOnly: boolean;
    conditions: {
      title: string;
      min?: number;
      max?: number;
      values?: (string | number)[];
    }[];
  };
};
export type Method = {
  id: string;
  label: string;
  kind: "single" | "independent" | "paired" | "multiple" | "repeated" | "multivariate" | "paired_groups" | "manual";
  description: string;
  minInputs?: number;
  maxInputs?: number;
  roles?: string[];
  vectors?: { key: string; label: string; placeholder: string }[];
  parameters?: { key: string; label: string; value: number; min?: number; max?: number; integer?: boolean; options?: { value: number; label: string }[] }[];
};
export type Analysis = {
  id: string;
  name: string;
  status: "queued" | "running" | "completed" | "failed";
  error?: string;
  createdAt: string;
  input?: Input;
  result?: Output;
};
export type InputGroup = {
  sampleId: string;
  revision: number;
  label: string;
  variable: Variable;
  included: { id: string; alias: string; value: number; manual: boolean }[];
  excluded: { id: string; reason: string }[];
};
export type Input = {
  config: { method: string; alpha: number; mu?: number; parameters?: Record<string, number>; matrixData?: number[][] | number[][][]; vectors?: Record<string, number[]> };
  groups: InputGroup[];
  snapshotAt: string;
  manualReason: string;
  policy: string;
};
export type Output = {
  engine: string;
  implementation?: string;
  references?: { title: string; url: string }[];
  alternative?: string;
  packages?: Record<string, string>;
  tables?: { title: string; columns: string[]; rows: (string | number | null)[][] }[];
  scipy: string;
  numpy: string;
  python: string;
  summary: {
    label: string;
    n: number;
    mean: number;
    median: number;
    sd: number;
    variance: number;
    min: number;
    max: number;
    q1: number;
    q3: number;
  }[];
  warnings: string[];
  formula: string;
  steps: string[];
  statistic: number | null;
  statisticLabel?: string;
  p: number | null;
  effect: number | null;
  effectLabel?: string;
  ci: number[] | null;
  ciLabel?: string;
  df: number | number[] | null;
  ranks?: number[][];
  skewness?: number;
  excess?: number;
  modes?: number[];
  modeFrequency?: number;
};
export type Model = {
  canWrite: boolean;
  methods: Method[];
  variables: Variable[];
  participants: Participant[];
  samples: Sample[];
  analyses: Analysis[];
};
