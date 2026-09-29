export const BRIEF_COPE_RU_SCALE_ITEMS = {
  socioEmotionalSupport: [6, 12, 14, 17, 24, 26],
  religion: [4, 8, 25, 29],
  acceptance: [19, 23, 27, 30],
  problemFocusedCoping: [2, 9, 16, 28],
  avoidance: [1, 3, 11, 13],
  humor: [21, 32],
} as const;

const SCALE_LABELS: Record<keyof typeof BRIEF_COPE_RU_SCALE_ITEMS, string> = {
  socioEmotionalSupport: 'Социально-эмоциональная поддержка',
  religion: 'Обращение к религии',
  acceptance: 'Принятие',
  problemFocusedCoping: 'Проблемно-ориентированный копинг',
  avoidance: 'Избегание',
  humor: 'Юмор',
};

export type BriefCopeRuResult = {
  instrument: 'Brief COPE — русская версия';
  complete: true;
  answered: 24;
  scales: Record<keyof typeof BRIEF_COPE_RU_SCALE_ITEMS, {
    label: string;
    score: number;
    average: number;
    min: 1;
    max: 4;
    minScore: 1;
    maxScore: 4;
    aggregation: 'mean';
    itemCount: number;
  }>;
};

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const EXPECTED_ITEMS = Object.values(BRIEF_COPE_RU_SCALE_ITEMS).flat().sort((a, b) => a - b);

export function scoreBriefCopeRu(rawAnswers: Map<number, number>): BriefCopeRuResult | null {
  if (rawAnswers.size !== EXPECTED_ITEMS.length) return null;
  for (const item of EXPECTED_ITEMS) {
    const value = rawAnswers.get(item);
    if (!Number.isInteger(value) || value! < 1 || value! > 4) return null;
  }

  const scales = Object.fromEntries(
    Object.entries(BRIEF_COPE_RU_SCALE_ITEMS).map(([key, items]) => {
      const mean = items.reduce((sum, item) => sum + rawAnswers.get(item)!, 0) / items.length;
      const rounded = round2(mean);
      return [key, {
        label: SCALE_LABELS[key as keyof typeof BRIEF_COPE_RU_SCALE_ITEMS],
        score: rounded,
        average: rounded,
        min: 1 as const,
        max: 4 as const,
        minScore: 1 as const,
        maxScore: 4 as const,
        aggregation: 'mean' as const,
        itemCount: items.length,
      }];
    }),
  ) as BriefCopeRuResult['scales'];

  return { instrument: 'Brief COPE — русская версия', complete: true, answered: 24, scales };
}
