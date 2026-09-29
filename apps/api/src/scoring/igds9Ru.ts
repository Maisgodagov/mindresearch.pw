export type Igds9RuResult = {
  instrument: 'Шкала оценки зависимости от интернет-игр, IGDS9-SF (русская версия)';
  complete: true;
  answered: 9;
  scales: Record<string, { label: string; score: number; average: number; min: number; max: number; minScore: number; maxScore: number; aggregation: 'sum'; itemCount: number }>;
  screening: { frequentResponseCount: number; fiveOfNineCriterion: boolean; note: string };
};

export function scoreIgds9Ru(answers: Map<number, number>): Igds9RuResult | null {
  const items = Array.from({ length: 9 }, (_, index) => index + 1);
  if (answers.size !== 9 || items.some((item) => !answers.has(item)) ||
      [...answers.values()].some((value) => !Number.isInteger(value) || value < 1 || value > 5)) return null;
  const score = items.reduce((total, item) => total + answers.get(item)!, 0);
  const frequentResponseCount = items.filter((item) => answers.get(item) === 5).length;
  return {
    instrument: 'Шкала оценки зависимости от интернет-игр, IGDS9-SF (русская версия)',
    complete: true,
    answered: 9,
    scales: {
      overall: { label: 'Общий балл IGDS9-SF', score, average: score / 9, min: 9, max: 45, minScore: 9, maxScore: 45, aggregation: 'sum', itemCount: 9 },
    },
    screening: {
      frequentResponseCount,
      fiveOfNineCriterion: frequentResponseCount >= 5,
      note: 'В приложении русской версии указано: ответ «Очень часто» минимум на 5 из 9 пунктов подтверждает этот скрининговый критерий; это не клинический диагноз.',
    },
  };
}
