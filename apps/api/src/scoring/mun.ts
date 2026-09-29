export const MUN_YES_KEY = [1, 2, 3, 6, 8, 10, 11, 12, 14, 16, 18, 19, 20] as const;
export const MUN_NO_KEY = [4, 5, 7, 9, 13, 15, 17] as const;

export type MunResult = {
  instrument: 'Мотивация успеха и боязнь неудачи, МУН';
  complete: true;
  answered: 20;
  overall: {
    label: string;
    score: number;
    average: number;
    minScore: 0;
    maxScore: 20;
    min: 0;
    max: 1;
    category: string | null;
    interpretation: string | null;
  };
};

const expectedItems = Array.from({ length: 20 }, (_, index) => index + 1);

export function scoreMun(answers: Map<number, number>): MunResult | null {
  if (
    answers.size !== expectedItems.length ||
    expectedItems.some((item) => !answers.has(item)) ||
    [...answers.values()].some((value) => !Number.isInteger(value) || (value !== 0 && value !== 1))
  ) return null;

  const yesKey = new Set<number>(MUN_YES_KEY);
  const noKey = new Set<number>(MUN_NO_KEY);
  const score = expectedItems.reduce((total, item) => {
    const answer = answers.get(item)!;
    const matchesKey = yesKey.has(item) ? answer === 1 : noKey.has(item) && answer === 0;
    return total + (matchesKey ? 1 : 0);
  }, 0);

  let category: string | null = null;
  let interpretation: string | null = null;
  if (score >= 1 && score <= 7) {
    category = 'Мотивация боязни неудачи';
    interpretation = 'Авторская категория: боязнь неудачи.';
  } else if (score >= 8 && score <= 13) {
    category = 'Мотивационный полюс ярко не выражен';
    interpretation = score <= 9
      ? 'Автор отмечает тенденцию к мотивации боязни неудачи.'
      : score >= 12
        ? 'Автор отмечает тенденцию к мотивации на успех.'
        : 'Авторская промежуточная категория без выраженной тенденции.';
  } else if (score >= 14 && score <= 20) {
    category = 'Мотивация на успех';
    interpretation = 'Авторская категория: надежда на успех.';
  }

  return {
    instrument: 'Мотивация успеха и боязнь неудачи, МУН',
    complete: true,
    answered: 20,
    overall: {
      label: 'Сумма совпадений с ключом',
      score,
      average: Math.round((score / 20 + Number.EPSILON) * 100) / 100,
      minScore: 0,
      maxScore: 20,
      min: 0,
      max: 1,
      category,
      interpretation,
    },
  };
}
