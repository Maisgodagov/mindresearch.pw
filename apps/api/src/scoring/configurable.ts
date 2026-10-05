export type ConfigurableScale = {
  key: string;
  label: string;
  items: number[];
  reverseItems: number[];
} & (
  | { aggregation: 'sum' | 'mean'; weights?: Record<number, number>; itemScores?: Record<number, Record<string, number>>; optionValue?: never }
  | { aggregation: 'count-option'; optionValue: string; weights?: never }
);

export type ConfigurableScoring = {
  min: number;
  max: number;
  scales: ConfigurableScale[];
};

export type ValidationCase = {
  title: string;
  answers: Record<string, unknown>;
  expected: Record<string, number>;
};

export type ConfigurableQuestion = {
  text: string;
  options: { value: string; label: string }[];
};

export type ConfigurableMethodology = {
  title: string;
  author: string;
  version: string;
  year?: number | null;
  summary: string;
  adaptation?: string;
  rightsNote?: string;
  steps: string[];
  keys?: { label: string; value: string }[];
  notes: string[];
  sources: { title: string; url: string }[];
};

export function validateConfigurableMethodology(input: {
  methodology: ConfigurableMethodology;
  questions: ConfigurableQuestion[];
  scoring: ConfigurableScoring;
  cases: ValidationCase[];
}, requireCases = true) {
  const errors: string[] = [];
  const { methodology, questions, scoring, cases } = input;
  const countsOptions = scoring.scales.some(scale => scale.aggregation === 'count-option');
  const usesItemScores = scoring.scales.some(scale => 'itemScores' in scale && scale.itemScores !== undefined);
  if (countsOptions && scoring.scales.some(scale => scale.aggregation !== 'count-option')) errors.push('A scoring setup cannot mix option counts with numeric scales.');
  if (!methodology.title?.trim()) errors.push('Укажите название методики.');
  if (!methodology.author?.trim()) errors.push('Укажите автора методики.');
  if (!methodology.version?.trim()) errors.push('Укажите версию методики.');
  if (!methodology.summary?.trim()) errors.push('Добавьте описание методики.');
  if (!methodology.rightsNote?.trim()) errors.push('Зафиксируйте основание, на котором полный текст и ключ можно использовать на платформе.');
  if (!Array.isArray(methodology.sources) || methodology.sources.length === 0) errors.push('Добавьте хотя бы один источник.');
  for (const [index, source] of (methodology.sources ?? []).entries()) {
    try {
      const url = new URL(source.url);
      if (!['http:', 'https:'].includes(url.protocol) || !source.title?.trim()) errors.push(`Источник ${index + 1}: укажите название и HTTP(S)-ссылку.`);
    } catch { errors.push(`Источник ${index + 1}: ссылка некорректна.`); }
  }
  if (!questions.length) errors.push('Добавьте вопросы методики.');
  if (!Number.isInteger(scoring.min) || !Number.isInteger(scoring.max) || scoring.min >= scoring.max) errors.push('Диапазон ответов должен состоять из двух целых чисел: минимум меньше максимума.');
  const optionValues = new Set<number | string>();
  const firstOptions = questions[0]?.options ?? [];
  for (const [index, option] of firstOptions.entries()) {
    const value = countsOptions || usesItemScores ? option.value : Number(option.value);
    if (!countsOptions && !usesItemScores && (!Number.isInteger(value) || Number(value) < scoring.min || Number(value) > scoring.max)) errors.push(`Вариант ответа ${index + 1} должен иметь целое значение в заданном диапазоне.`);
    if (optionValues.has(value)) errors.push(`Значение ответа ${value} повторяется.`);
    optionValues.add(value);
    if (!option.label?.trim()) errors.push(`Добавьте подпись для варианта ответа ${index + 1}.`);
  }
  if (firstOptions.length < 2 || (!countsOptions && !usesItemScores && optionValues.size !== scoring.max - scoring.min + 1)) errors.push('Добавьте по одному варианту ответа для каждого целого значения диапазона.');
  questions.forEach((question, index) => {
    if (!question.text?.trim()) errors.push(`Заполните текст вопроса ${index + 1}.`);
    const values = (question.options ?? []).map(option => countsOptions || usesItemScores ? option.value : Number(option.value)).sort((a, b) => String(a).localeCompare(String(b)));
    const expectedValues = [...optionValues].sort((a, b) => String(a).localeCompare(String(b)));
    if (values.length !== optionValues.size || values.some((value, optionIndex) => value !== expectedValues[optionIndex])) errors.push(`В вопросе ${index + 1} отличаются варианты ответа от общей шкалы.`);
  });
  if (!scoring.scales.length) errors.push('Добавьте хотя бы одну рассчитываемую шкалу.');
  const scaleKeys = new Set<string>();
  scoring.scales.forEach((scale, index) => {
    if (!scale.key?.trim() || !scale.label?.trim()) errors.push(`Шкала ${index + 1}: укажите название.`);
    if (scaleKeys.has(scale.key)) errors.push(`Код шкалы «${scale.key}» повторяется.`);
    scaleKeys.add(scale.key);
    if (scale.aggregation === 'count-option' && (!scale.optionValue || !optionValues.has(scale.optionValue))) errors.push('Choose a response option for every count scale.');
    if (scale.aggregation !== 'count-option' && !['sum', 'mean'].includes(scale.aggregation)) errors.push(`Шкала «${scale.label}»: неизвестный способ подсчёта.`);
    if (!scale.items.length) errors.push(`Шкала «${scale.label}»: выберите пункты.`);
    if (new Set(scale.items).size !== scale.items.length) errors.push(`Шкала «${scale.label}»: пункт выбран несколько раз.`);
    if (scale.items.some(item => !Number.isInteger(item) || item < 1 || item > questions.length)) errors.push(`Шкала «${scale.label}»: выбран несуществующий пункт.`);
    if (scale.aggregation === 'count-option' && scale.reverseItems.length) errors.push('Option-count scales cannot use reverse items.');
    if (scale.reverseItems.some(item => !scale.items.includes(item))) errors.push(`Шкала «${scale.label}»: обратный пункт должен входить в эту шкалу.`);
    if (scale.weights && Object.entries(scale.weights).some(([item, weight]) => !scale.items.includes(Number(item)) || !Number.isFinite(weight))) errors.push(`Шкала «${scale.label}»: коэффициенты должны быть заданы только для включённых пунктов и быть конечными числами.`);
    if ('itemScores' in scale && scale.itemScores) {
      const invalidItemScores = Object.entries(scale.itemScores).some(([item, optionScores]) => !scale.items.includes(Number(item)) || Object.entries(optionScores).some(([option, score]) => !optionValues.has(option) || !Number.isFinite(score)));
      const missingItemScores = scale.items.some(item => [...optionValues].some(option => typeof option === 'string' && !Object.prototype.hasOwnProperty.call(scale.itemScores?.[item], option)));
      if (invalidItemScores || missingItemScores) errors.push(`Шкала «${scale.label}»: баллы ответов должны быть заданы для включённых пунктов, существующих вариантов и конечными числами.`);
    }
  });
  if (requireCases && cases.length < 2) errors.push('Добавьте не менее двух контрольных примеров с ожидаемыми результатами.');
  return errors;
}

export function calculateConfigurableScores(scoring: ConfigurableScoring, answers: Record<string, unknown>) {
  const scores: Record<string, number> = {};
  for (const scale of scoring.scales) {
    const values = scale.items.map(item => {
      const answer = answers[String(item)];
      if (answer === null || answer === undefined) return null;
      if (scale.aggregation === 'count-option') return String(answer) === scale.optionValue ? 1 : 0;
      if ('itemScores' in scale && scale.itemScores) {
        const score = scale.itemScores[item]?.[String(answer)];
        return typeof score === 'number' && Number.isFinite(score) ? score : null;
      }
      const raw = Number(answer);
      if (!Number.isInteger(raw) || raw < scoring.min || raw > scoring.max) return null;
      return scale.reverseItems.includes(item) ? scoring.min + scoring.max - raw : raw;
    });
    if (values.some(value => value === null)) return null;
    const total = (values as number[]).reduce((sum, value, index) => sum + value * (scale.weights?.[scale.items[index]] ?? 1), 0);
    scores[scale.key] = scale.aggregation === 'mean' ? total / values.length : total;
  }
  return scores;
}

export function checkConfigurableCases(input: {
  questions: ConfigurableQuestion[];
  scoring: ConfigurableScoring;
  cases: ValidationCase[];
}, tolerance = 1e-8) {
  const requiredItems = [...new Set(input.scoring.scales.flatMap(scale => scale.items))];
  const results = input.cases.map(testCase => {
    const actual = calculateConfigurableScores(input.scoring, testCase.answers);
    const differences = input.scoring.scales.map(scale => ({
      key: scale.key,
      label: scale.label,
      expected: Number(testCase.expected?.[scale.key]),
      actual: actual?.[scale.key] ?? null,
      passed: actual !== null && Number.isFinite(Number(testCase.expected?.[scale.key])) && Math.abs(actual[scale.key] - Number(testCase.expected[scale.key])) <= tolerance,
    }));
    const missingItems = requiredItems.filter(item => !Object.prototype.hasOwnProperty.call(testCase.answers ?? {}, String(item)));
    return { title: testCase.title, passed: differences.every(item => item.passed) && missingItems.length === 0, differences, missingItems };
  });
  const optionCountScales = input.scoring.scales.filter(scale => scale.aggregation === 'count-option');
  const boundaryChecks = optionCountScales.length
    ? optionCountScales.map(selectedScale => {
      const answers = Object.fromEntries(requiredItems.map(item => [String(item), selectedScale.optionValue]));
      const actual = calculateConfigurableScores(input.scoring, answers);
      return {
        value: selectedScale.optionValue,
        passed: !!actual && input.scoring.scales.every(scale => actual[scale.key] === (scale.aggregation === 'count-option' && scale.optionValue === selectedScale.optionValue ? scale.items.length : 0)),
      };
    })
    : input.scoring.scales.some(scale => 'itemScores' in scale && scale.itemScores)
    ? [...new Set(input.questions[0]?.options.map(option => option.value) ?? [])].map(value => {
      const answers = Object.fromEntries(requiredItems.map(item => [String(item), value]));
      const actual = calculateConfigurableScores(input.scoring, answers);
      const expected = Object.fromEntries(input.scoring.scales.map(scale => {
        const total = scale.items.reduce((sum, item) => {
          if ('itemScores' in scale && scale.itemScores) return sum + (scale.itemScores[item]?.[value] ?? 0);
          const raw = Number(value);
          const transformed = scale.reverseItems.includes(item) ? input.scoring.min + input.scoring.max - raw : raw;
          return sum + transformed * (scale.weights?.[item] ?? 1);
        }, 0);
        return [scale.key, scale.aggregation === 'mean' ? total / scale.items.length : total];
      }));
      return { value, passed: !!actual && input.scoring.scales.every(scale => Math.abs(actual[scale.key] - expected[scale.key]) <= tolerance) };
    })
    : [input.scoring.min, input.scoring.max].map(value => {
      const answers = Object.fromEntries(requiredItems.map(item => [String(item), value]));
      const actual = calculateConfigurableScores(input.scoring, answers);
      const expected = Object.fromEntries(input.scoring.scales.map(scale => {
        const transformed = scale.items.map(item => scale.reverseItems.includes(item) ? input.scoring.min + input.scoring.max - value : value);
        const total = transformed.reduce((sum, item, index) => sum + item * (scale.weights?.[scale.items[index]] ?? 1), 0);
        return [scale.key, scale.aggregation === 'mean' ? total / transformed.length : total];
      }));
      return { value, passed: !!actual && input.scoring.scales.every(scale => Math.abs(actual[scale.key] - expected[scale.key]) <= tolerance) };
    });
  return { passed: results.length >= 2 && results.every(item => item.passed) && boundaryChecks.every(item => item.passed), results, boundaryChecks };
}
