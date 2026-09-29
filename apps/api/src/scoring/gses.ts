export type GsesResult = {
  instrument: 'GSES';
  complete: true;
  answered: 10;
  score: number;
  average: number;
  min: 1;
  max: 4;
};

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function scoreGses(rawAnswers: Map<number, number>): GsesResult | null {
  if (rawAnswers.size !== 10) return null;
  for (let item = 1; item <= 10; item += 1) {
    const value = rawAnswers.get(item);
    if (!Number.isInteger(value) || value! < 1 || value! > 4) return null;
  }

  const score = [...rawAnswers.values()].reduce((total, value) => total + value, 0);
  return {
    instrument: 'GSES',
    complete: true,
    answered: 10,
    score,
    average: round2(score / 10),
    min: 1,
    max: 4,
  };
}
