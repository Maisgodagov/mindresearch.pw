export const NMPQ_RU_SCALES = {
  informationAccess: { label: 'Дискомфорт из-за отсутствия доступа к информации', items: [1, 2, 3, 4] },
  disconnectedOthers: { label: 'Страх остаться без связи с другими', items: [5, 6, 7, 8, 9] },
  disconnectedLovedOnes: { label: 'Страх остаться без связи с близкими', items: [10, 11, 12, 13, 14, 15] },
  missingNews: { label: 'Страх пропустить новости и сообщения', items: [16, 17, 18, 19, 20] },
} as const;

export type NmpqRuResult = {
  instrument: 'Опросник номофобии, NMP-Q (русскоязычная версия)';
  complete: true;
  answered: 20;
  scales: Record<string, { label: string; score: number; average: number; min: number; max: number; minScore: number; maxScore: number; aggregation: 'sum'; itemCount: number }>;
};

export function scoreNmpqRu(answers: Map<number, number>): NmpqRuResult | null {
  const items = Array.from({ length: 20 }, (_, index) => index + 1);
  if (answers.size !== 20 || items.some((item) => !answers.has(item)) ||
      [...answers.values()].some((value) => !Number.isInteger(value) || value < 1 || value > 5)) return null;
  const scales: Record<string, { label: string; score: number; average: number; min: number; max: number; minScore: number; maxScore: number; aggregation: 'sum'; itemCount: number }> = Object.fromEntries(Object.entries(NMPQ_RU_SCALES).map(([key, scale]) => {
    const score = scale.items.reduce((total, item) => total + answers.get(item)!, 0);
    return [key, { label: scale.label, score, average: score / scale.items.length, min: scale.items.length, max: scale.items.length * 5, minScore: scale.items.length, maxScore: scale.items.length * 5, aggregation: 'sum' as const, itemCount: scale.items.length }];
  }));
  const total = items.reduce((sum, item) => sum + answers.get(item)!, 0);
  scales.overall = { label: 'Общий показатель номофобии', score: total, average: total / 20, min: 20, max: 100, minScore: 20, maxScore: 100, aggregation: 'sum', itemCount: 20 };
  return { instrument: 'Опросник номофобии, NMP-Q (русскоязычная версия)', complete: true, answered: 20, scales };
}
