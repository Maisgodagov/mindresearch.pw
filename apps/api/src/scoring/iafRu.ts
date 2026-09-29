export const IAF_RU_SCALES = {
  authorship: { label: 'Авторство / самоконгруэнтность', items: [1, 4, 8, 10, 15] },
  interest: { label: 'Заинтересованность', items: [3, 5, 9, 12, 13] },
  control: { label: 'Восприимчивость к контролю', items: [2, 6, 7, 11, 14] },
} as const;

export type IafRuResult = {
  instrument: 'Индекс автономного функционирования, ИАФ (IAF)';
  complete: true;
  answered: 15;
  scales: Record<string, { label: string; score: number; average: number; min: 1; max: 5; minScore: 1; maxScore: 5; itemCount: 5 }>;
};

export function scoreIafRu(answers: Map<number, number>): IafRuResult | null {
  const expected = Array.from({ length: 15 }, (_, index) => index + 1);
  if (
    answers.size !== expected.length ||
    expected.some((item) => !answers.has(item)) ||
    [...answers.values()].some((value) => !Number.isInteger(value) || value < 1 || value > 5)
  ) return null;

  const scales = Object.fromEntries(Object.entries(IAF_RU_SCALES).map(([key, scale]) => {
    const mean = scale.items.reduce((total, item) => total + answers.get(item)!, 0) / scale.items.length;
    const score = Math.round((mean + Number.EPSILON) * 100) / 100;
    return [key, { label: scale.label, score, average: score, min: 1 as const, max: 5 as const, minScore: 1 as const, maxScore: 5 as const, itemCount: 5 as const }];
  }));

  return { instrument: 'Индекс автономного функционирования, ИАФ (IAF)', complete: true, answered: 15, scales };
}
