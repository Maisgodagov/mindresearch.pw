export const FOMOS_RU_SCALES = {
  missedPleasure: { label: 'Страх упущенного удовольствия', items: [1, 2, 3] },
  missedSocial: { label: 'Страх упущенных социальных возможностей', items: [4, 5, 6] },
} as const;

export type FomosRuResult = {
  instrument: 'Шкала страха упущенных возможностей, FoMO (русская версия)';
  complete: true;
  answered: 6;
  scales: Record<string, { label: string; score: number; average: number; min: number; max: number; minScore: number; maxScore: number; aggregation: 'sum'; itemCount: number }>;
};

export function scoreFomosRu(answers: Map<number, number>): FomosRuResult | null {
  const items = Array.from({ length: 6 }, (_, index) => index + 1);
  if (answers.size !== 6 || items.some((item) => !answers.has(item)) ||
      [...answers.values()].some((value) => !Number.isInteger(value) || value < 1 || value > 5)) return null;
  const scales: Record<string, { label: string; score: number; average: number; min: number; max: number; minScore: number; maxScore: number; aggregation: 'sum'; itemCount: number }> = Object.fromEntries(Object.entries(FOMOS_RU_SCALES).map(([key, scale]) => {
    const score = scale.items.reduce((total, item) => total + answers.get(item)!, 0);
    return [key, { label: scale.label, score, average: score / 3, min: 3, max: 15, minScore: 3, maxScore: 15, aggregation: 'sum' as const, itemCount: 3 }];
  }));
  const total = items.reduce((sum, item) => sum + answers.get(item)!, 0);
  scales.overall = { label: 'Общий страх упущенных возможностей', score: total, average: total / 6, min: 6, max: 30, minScore: 6, maxScore: 30, aggregation: 'sum', itemCount: 6 };
  return { instrument: 'Шкала страха упущенных возможностей, FoMO (русская версия)', complete: true, answered: 6, scales };
}
