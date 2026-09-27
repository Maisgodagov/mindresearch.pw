export const SHAM_SCALES = {
  cognitive: { label: 'Познавательная мотивация', items: [1, 8, 15, 22] },
  achievement: { label: 'Мотивация достижения', items: [2, 9, 16, 23] },
  selfDevelopment: { label: 'Мотивация саморазвития', items: [3, 10, 17, 24] },
  selfRespect: { label: 'Мотивация самоуважения', items: [4, 11, 18, 25] },
  introjected: { label: 'Интроецированная мотивация', items: [5, 12, 19, 26] },
  external: { label: 'Экстернальная мотивация', items: [6, 13, 20, 27] },
  amotivation: { label: 'Амотивация', items: [7, 14, 21, 28] },
} as const;

export type ShamScale = { label: string; score: number; minScore: 4; maxScore: 20; items: readonly number[] };
export type ShamResult = { instrument: 'ШАМ'; complete: true; answered: 28; scales: Record<keyof typeof SHAM_SCALES, ShamScale> };

export function scoreSham(answers: Map<number, number>): ShamResult | null {
  const requiredItems=Array.from({length:28},(_,index)=>index+1);
  if (answers.size !== 28 || requiredItems.some(item=>!answers.has(item)) || [...answers.values()].some(value => !Number.isInteger(value) || value < 1 || value > 5)) return null;
  const scales = Object.fromEntries(Object.entries(SHAM_SCALES).map(([code, definition]) => [code, {
    label: definition.label,
    score: definition.items.reduce((sum, item) => sum + answers.get(item)!, 0),
    minScore: 4,
    maxScore: 20,
    items: definition.items,
  }])) as unknown as ShamResult['scales'];
  return { instrument: 'ШАМ', complete: true, answered: 28, scales };
}
