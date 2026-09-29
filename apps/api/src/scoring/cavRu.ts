export const CAV_RU_SCALES = {
  cyberAggression: { label: 'Киберагрессия', items: Array.from({ length: 12 }, (_, index) => index + 1) },
  cyberVictimization: { label: 'Кибервиктимизация', items: Array.from({ length: 12 }, (_, index) => index + 13) },
} as const;

export type CavRuResult = {
  instrument: 'Шкала киберагрессии и кибервиктимизации, CAV (русская адаптация)';
  complete: true;
  answered: 24;
  scales: Record<string, { label: string; score: number; average: number; min: number; max: number; minScore: number; maxScore: number; aggregation: 'sum'; itemCount: number }>;
};

export function scoreCavRu(answers: Map<number, number>): CavRuResult | null {
  const items = Array.from({ length: 24 }, (_, index) => index + 1);
  if (answers.size !== 24 || items.some((item) => !answers.has(item)) ||
      [...answers.values()].some((value) => !Number.isInteger(value) || value < 0 || value > 4)) return null;
  const scales: CavRuResult['scales'] = {};
  for (const [key, scale] of Object.entries(CAV_RU_SCALES)) {
    const score = scale.items.reduce((total, item) => total + answers.get(item)!, 0);
    scales[key] = { label: scale.label, score, average: score / 12, min: 0, max: 48, minScore: 0, maxScore: 48, aggregation: 'sum', itemCount: 12 };
  }
  return { instrument: 'Шкала киберагрессии и кибервиктимизации, CAV (русская адаптация)', complete: true, answered: 24, scales };
}
