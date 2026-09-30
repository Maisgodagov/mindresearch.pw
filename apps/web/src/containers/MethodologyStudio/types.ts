export type Option = { value: string; label: string };
export type Question = { text: string };
export type Scale = {
  key: string;
  label: string;
  items: number[];
  reverseItems: number[];
  aggregation: "sum" | "mean";
};
export type CheckCase = {
  title: string;
  answersText: string;
  expectedText: string;
};
export type StoredCheckCase = {
  title: string;
  answers: Record<string, number>;
  expected: Record<string, number>;
};
export type ValidationDifference = {
  key: string;
  label: string;
  expected: number;
  actual: number | null;
  passed: boolean;
};
export type ValidationCaseResult = {
  title: string;
  passed: boolean;
  differences: ValidationDifference[];
  missingItems: number[];
};
export type BoundaryCheck = { value: number | string; passed: boolean };
export type ValidationReport = {
  passed: boolean;
  results: ValidationCaseResult[];
  boundaryChecks: BoundaryCheck[];
};
export type Draft = {
  id: string;
  code: string;
  title: string;
  isVerified: boolean;
  isBuiltin?: boolean;
  status?: "active" | "archived";
  uniformOptions?: boolean;
  formulaVersion?: string;
  methodology: State["methodology"];
  scoring: { min: number; max: number; scales: Scale[] };
  cases: StoredCheckCase[];
  questions: { text: string; options: Option[] }[];
};

export function isValidationReport(value: unknown): value is ValidationReport {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ValidationReport>;
  return (
    typeof candidate.passed === "boolean" &&
    Array.isArray(candidate.results) &&
    Array.isArray(candidate.boundaryChecks)
  );
}
export type State = {
  methodology: {
    title: string;
    author: string;
    version: string;
    year: number | null;
    summary: string;
    adaptation: string;
    rightsNote: string;
    steps: string[];
    keys?: { label: string; value: string }[];
    notes: string[];
    sources: { title: string; url: string }[];
  };
  questions: Question[];
  options: Option[];
  scoring: { min: number; max: number; scales: Scale[] };
  cases: CheckCase[];
};
