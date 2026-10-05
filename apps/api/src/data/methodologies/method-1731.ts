import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '4', label: 'Очень часто' },
  { value: '3', label: 'Часто' },
  { value: '2', label: 'Иногда' },
  { value: '1', label: 'Редко' },
  { value: '0', label: 'Никогда' },
];

// The source publication numbers 20 response units; some contain several
// statements which share one response, so they are kept grouped as published.
const items = [
  'Мне хочется, чтобы мои друзья подбадривали меня.',
  'Я постоянно чувствую свою ответственность за работу.',
  'Я беспокоюсь о своём будущем.',
  'Многие меня ненавидят.',
  'Я обладаю меньшей инициативой, чем другие.',
  'Я беспокоюсь за своё психическое состояние.',
  'Я боюсь выглядеть глупцом.',
  'Внешний вид других куда лучше, чем мой.',
  'Я боюсь выступить с речью перед незнакомыми людьми.',
  'Я часто допускаю ошибки. Как жаль, что я не умею говорить как следует с незнакомыми людьми.',
  'Как жаль, что мне не хватает уверенности в себе. Мне бы хотелось, чтобы мои действия одобрялись другими чаще.',
  'Я слишком скромен. Моя жизнь бесполезна. Многие неправильного мнения обо мне. Мне не с кем поделиться своими мыслями. Люди ждут от меня очень многого. Люди не особенно интересуются моими достижениями.',
  'Я слегка смущаюсь.',
  'Я чувствую, что многие люди не понимают меня. Я не чувствую себя в безопасности. Я часто волнуюсь понапрасну. Я чувствую себя неловко, когда вхожу в комнату, где уже сидят люди.',
  'Я чувствую, что люди говорят обо мне за моей спиной. Я чувствую себя скованным (скованной). Я уверен (уверена), что люди почти всё принимают легче, чем я.',
  'Мне кажется, что со мной должна случиться какая-нибудь неприятность.',
  'Меня волнует мысль о том, как люди относятся ко мне.',
  'Как жаль, что я не общителен (общительна).',
  'В спорах я высказываюсь только тогда, когда уверен (уверена) в своей правоте.',
  'Я думаю о том, чего ждёт от меня общественность.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1748_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1748',
  title: 'Тест для определения самооценки юного спортсмена',
  description: 'Методика Л. В. Богдановой предназначена для ориентировочной оценки общего уровня самооценки юного спортсмена: уверенности в своих силах и действиях, отношения к себе и своей оценке окружающими. Результат помогает тренеру или исследователю заметить возможную потребность подростка в поддержке уверенности; это не диагностический вывод.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{
    key: 'selfEsteem',
    label: 'Уровень самооценки (обратное направление балла)',
    items: Array.from({ length: 20 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), String(value)]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Никогда»: сумма 0, диапазон уверенности 0–25', answers: allAnswers(0), expected: { selfEsteem: 0 } },
  { title: 'Все ответы «Очень часто»: сумма 80, диапазон низкой самооценки 46+', answers: allAnswers(4), expected: { selfEsteem: 80 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bogdanova-youth-athlete-self-esteem-1997-v1',
};
