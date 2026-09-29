export type BsmasRuResult = {
  instrument: 'Бергенская шкала зависимости от социальных сетей, BSMAS';
  complete: true;
  answered: 6;
  scales: { overall: { label: 'Суммарный балл BSMAS'; score: number; average: number; min: 6; max: 30; minScore: 6; maxScore: 30; aggregation: 'sum'; itemCount: 6 } };
};

export function scoreBsmasRu(answers: Map<number, number>): BsmasRuResult | null {
  const items = Array.from({ length: 6 }, (_, index) => index + 1);
  if (answers.size !== 6 || items.some((item) => !answers.has(item)) ||
      [...answers.values()].some((value) => !Number.isInteger(value) || value < 1 || value > 5)) return null;
  const score = items.reduce((sum, item) => sum + answers.get(item)!, 0);
  return {
    instrument: 'Бергенская шкала зависимости от социальных сетей, BSMAS',
    complete: true,
    answered: 6,
    scales: { overall: { label: 'Суммарный балл BSMAS', score, average: score / 6, min: 6, max: 30, minScore: 6, maxScore: 30, aggregation: 'sum', itemCount: 6 } },
  };
}
