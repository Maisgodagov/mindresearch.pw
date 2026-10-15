type AnswerCount = { answer: string; count: number };

// Preserve categorical answer order; compare numeric labels as numbers.
export function sortNumericAnswers<T extends AnswerCount>(answers: T[]): T[] {
  const values = answers.map(item => {
    const text = item.answer.trim().replace(',', '.');
    return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text) ? Number(text) : NaN;
  });
  if (!values.length || values.some(value => !Number.isFinite(value))) return answers;
  return answers.map((item, index) => ({ item, value: values[index] }))
    .sort((a, b) => a.value - b.value).map(entry => entry.item);
}
