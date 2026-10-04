import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '3', label: '+3' },
  { value: '2', label: '+2' },
  { value: '1', label: '+1' },
  { value: '0', label: '0' },
  { value: '-1', label: '−1' },
  { value: '-2', label: '−2' },
  { value: '-3', label: '−3' },
];

const statements = [
  'Труд приносит радость.',
  'Труд — залог счастья.',
  'Без труда жизнь человека невообразима.',
  'Труд является одним из видов полезной деятельности.',
  'Труд надоедлив, но необходим.',
  'Труд необязателен для счастья человека.',
  'Труд — это мука.',
  'Самое большое богатство человека — знания.',
  'Учение необходимо, чтобы чувствовать себя счастливым.',
  'Без учебы жизнь человека невообразима.',
  'Учеба — один из видов полезной деятельности.',
  'Учение не приносит никакой пользы.',
  'И без учения можно жить безбедно.',
  'Учение — мука.',
  'Чтение — самое интересное и увлекательное занятие.',
  'Читать полезно и интересно, чтение развивает.',
  'За чтением не скучно проводить время.',
  'Чтение — один из видов полезных занятий.',
  'Долго читать скучно.',
  'Чтение — надоедливое, скучное занятие.',
  'Без книг можно обойтись, они не нужны.',
  'Самое большое счастье — быть уважаемым, полезным людям человеком.',
  'Авторитет среди людей — большая ценность.',
  'Ради того, чтобы иметь авторитет и уважение, стоит хорошо трудиться и быть принципиальным.',
  'Авторитет и уважение полезны для жизненного успеха.',
  'Не вижу большой пользы в уважении людей.',
  'И без уважения людей можно чувствовать себя счастливым.',
  'Главное — не уважение людей, а материальная обеспеченность.',
  'Если бы не было кино, жизнь была бы значительно скучнее.',
  'Кино — наилучшее средство развлечения и отдыха.',
  'Кино полезно, оно развивает.',
  'Кино — один из видов развлечения.',
  'Кино — пустое времяпрепровождение.',
  'Сидеть в кино надоедливо.',
  'Кино совершенно не нужно.',
  'Пить вино — выражение мужественности.',
  'Большое удовольствие — проводить время в компании с вином.',
  'Без вина жизнь человека скучна.',
  'Вино любит умеренность.',
  'Вино понижает работоспособность и умственную деятельность.',
  'Вино — источник всех преступлений.',
  'Вино губит человека.',
];

const scaleDefinitions = [
  { key: 'labor', label: 'Отношение к труду' },
  { key: 'study', label: 'Отношение к учебе' },
  { key: 'reading', label: 'Отношение к чтению' },
  { key: 'respect', label: 'Отношение к уважению окружающих' },
  { key: 'cinema', label: 'Отношение к кино' },
  { key: 'alcohol', label: 'Отношение к употреблению алкоголя' },
];

const questions: SeedSection['questions'] = scaleDefinitions.flatMap((scale, scaleIndex) =>
  statements.slice(scaleIndex * 7, scaleIndex * 7 + 7).map((statement, statementIndex) => ({
  code: `test_695_${scaleIndex * 7 + statementIndex + 1}`,
  text: `${scale.label}: ${statement}`,
  type: 'single',
  required: true,
  options,
})));

export const instrument: SeedSection = {
  code: 'test_695',
  title: 'Методика оценки социальных установок подростков',
  description: 'Методика Беличевой выявляет ценностные ориентации подростков как внутренние регуляторы поведения. Шесть шкал охватывают отношение к труду, учебе, чтению, уважению окружающих, кино и употреблению алкоголя; профиль помогает автору опроса изучить установки в сферах деятельности, познания, общения и досуга.',
  questions,
};

// Source reports means over positive statements 1–4 and negative statements 4–7.
// Statement 4 is neutral and intentionally belongs to both reported averages.
const scoringConfig: ConfigurableScoring = {
  min: -3,
  max: 3,
  scales: scaleDefinitions.flatMap((scale, index) => {
    const start = index * 7 + 1;
    return [
      { key: `${scale.key}_positive`, label: `${scale.label} — позитивные высказывания`, items: [start, start + 1, start + 2, start + 3], reverseItems: [], aggregation: 'mean' as const },
      { key: `${scale.key}_negative`, label: `${scale.label} — негативные высказывания`, items: [start + 3, start + 4, start + 5, start + 6], reverseItems: [], aggregation: 'mean' as const },
    ];
  }),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Шкала труда: распределение +3…−3 по порядку, средние по утверждениям 1–4 и 4–7',
    answers: { '1': 3, '2': 2, '3': 1, '4': 0, '5': -1, '6': -2, '7': -3 },
    expected: { labor_positive: 1.5, labor_negative: -1.5, study_positive: 0, study_negative: 0, reading_positive: 0, reading_negative: 0, respect_positive: 0, respect_negative: 0, cinema_positive: 0, cinema_negative: 0, alcohol_positive: 0, alcohol_negative: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'belicheva-terston-social-attitudes-adolescents-v1',
};
