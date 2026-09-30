import type { Scale } from './types';

export const pct = (scale: Scale) => {
  const value = scale.score ?? scale.average ?? 0,
    max = scale.maxScore ?? scale.max ?? 5,
    min = scale.minScore ?? scale.min ?? 0;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};
export const short = (label: string) =>
  label
    .replace(" пищевое поведение", "")
    .replace("Физическая внешность", "Внешность");
