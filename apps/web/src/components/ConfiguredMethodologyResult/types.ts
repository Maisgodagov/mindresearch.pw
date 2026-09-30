export type ScaleResult = {
  label: string;
  score: number;
  average: number;
  min: number;
  max: number;
  aggregation?: "sum" | "mean";
};

export type ConfiguredResultValues = {
  scales?: Record<string, ScaleResult>;
};

export type Props = {
  title: string;
  values: ConfiguredResultValues;
  compact?: boolean;
};
