import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const pairs = [
  ['Скучная', 'Интересная'],
  ['Утомляющая', 'Вдохновляющая'],
  ['Рутинная', 'Творческая'],
  ['Безответственная', 'Ответственная'],
  ['Монотонная', 'Динамичная'],
  ['Ограничивающая', 'Обогащающая'],
  ['Однообразная', 'Интерактивная'],
  ['Отталкивающая', 'Вовлекающая'],
  ['Сдерживающая', 'Развивающая'],
  ['Разочаровывающая', 'Удовлетворяющая'],
] as const;

const options = [-3, -2, -1, 0, 1, 2, 3].map(value => ({
  value: String(value),
  label: value < 0 ? `${value} — ближе к левому полюсу` : value > 0 ? `+${value} — ближе к правому полюсу` : '0 — середина',
}));

const questions: SeedSection['questions'] = pairs.map(([left, right], index) => ({
  code: `test_1590_${index + 1}`,
  text: `Профессия учителя: ${left} — ${right}`,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_1590',
  title: 'Семантический дифференциал образа профессии учителя',
  description: 'Методика оценивает общее восприятие профессии учителя по эмоциональным и смысловым характеристикам: интересу и вдохновляющему потенциалу, творческому и динамичному характеру, ответственности, обогащающему и развивающему эффекту, вовлечённости и удовлетворённости. Подходит для профориентационного изучения учащихся и молодых людей, рассматривающих педагогическую деятельность как возможную сферу профессиональной самореализации; соответствует авторской версии 2025 года.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: -3,
  max: 3,
  scales: [{
    key: 'teacher_profession_image',
    label: 'Восприятие профессии учителя',
    items: pairs.map((_, index) => index + 1),
    reverseItems: [],
    aggregation: 'mean',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все оценки в середине шкалы дают нулевое среднее',
    answers: Object.fromEntries(pairs.map((_, index) => [String(index + 1), '0'])),
    expected: { teacher_profession_image: 0 },
  },
  {
    title: 'Все оценки у положительного полюса дают +3',
    answers: Object.fromEntries(pairs.map((_, index) => [String(index + 1), '3'])),
    expected: { teacher_profession_image: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'zekeryaev-teacher-profession-semantic-differential-2025-v1',
  details: {
    version: 'Авторская стандартизированная версия 2025 года',
    summary: instrument.description ?? '',
    rightsNote: 'Формулировки пунктов и ключ воспроизведены по статье автора, содержащей бланк опросника и правило расчёта.',
    steps: ['Оценки задаются от −3 до +3: отрицательные значения соответствуют левому полюсу пары, положительные — правому, 0 — середине.', 'Итоговый показатель равен среднему арифметическому оценок по десяти пунктам; диапазон результата от −3 до +3.'],
    keys: [{ label: 'Восприятие профессии учителя', value: 'Пункты 1–10; среднее арифметическое десяти ответов; реверсивных пунктов нет.' }],
    notes: ['Автор: Руслан Ильвисович Зекерьяев.', 'Год версии: 2025.', 'В статье приведены авторские границы уровней: низкий −3…−1,5; средний −1,5…+1,5; высокий +1,5…+3. Граничные значения пересекаются в публикации, поэтому автоматически уровни не присваиваются.'],
    sources: [
      { title: 'Зекерьяев Р. И. Стандартизация авторского исследовательского опросника «Семантический дифференциал образа профессии учителя» (с. 464–467)', url: 'https://gpa.cfuv.ru/attachments/article/6583/%D0%92%D1%8B%D0%BF%D1%83%D1%81%D0%BA%2089%20%D1%87%D0%B0%D1%81%D1%82%D1%8C%201%2C%202025%20%D0%B3%D0%BE%D0%B4.pdf' },
      { title: 'Семантический дифференциал образа профессии учителя — русская версия и онлайн-бланк', url: 'https://psytests.org/pedag/sdopu.html' },
    ],
  },
};
