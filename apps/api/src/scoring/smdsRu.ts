export type SmdsRuResult = {
  instrument: 'Шкала расстройства, связанного с использованием социальных сетей, SMDS';
  complete: true;
  answered: 9;
  scales: { overall: { label: 'Число ответов «Да»'; score: number; average: number; min: 0; max: 9; minScore: 0; maxScore: 9; aggregation: 'sum'; itemCount: 9 } };
  screeningNote: string;
};

export function scoreSmdsRu(answers: Map<number, number>): SmdsRuResult | null {
  const items = Array.from({ length: 9 }, (_, index) => index + 1);
  if (answers.size !== 9 || items.some((item) => !answers.has(item)) ||
      [...answers.values()].some((value) => value !== 0 && value !== 1)) return null;
  const score = items.reduce((sum, item) => sum + answers.get(item)!, 0);
  return {
    instrument: 'Шкала расстройства, связанного с использованием социальных сетей, SMDS',
    complete: true,
    answered: 9,
    scales: { overall: { label: 'Число ответов «Да»', score, average: score / 9, min: 0, max: 9, minScore: 0, maxScore: 9, aggregation: 'sum', itemCount: 9 } },
    screeningNote: score >= 5 ? 'Достигнут опубликованный скрининговый порог (5 и более ответов «Да»); это не является диагнозом.' : 'Опубликованный скрининговый порог (5 ответов «Да») не достигнут; это не является диагностическим заключением.',
  };
}
