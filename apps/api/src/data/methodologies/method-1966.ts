import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '3', label: 'Да' },
  { value: '2', label: 'Может быть' },
  { value: '1', label: 'Не знаю' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Мне нравится учиться, потому что у нас дружный класс',
  'Я стараюсь хорошо учиться, потому что это радует моих родителей',
  'Мне нравится, когда меня вызывают отвечать у доски',
  'Мне кажется, что дома учиться лучше, чем в школе',
  'Я стараюсь хорошо учиться, потому что это радует нашу учительницу',
  'Я люблю школу, потому что в нашем классе дружные ребята',
  'Я горжусь похвалой учительницы на уроке',
  'Я люблю отвечать на уроках, когда меня спрашивает учительница',
  'У нас каждый день слишком много уроков',
  'Я горжусь собой, когда могу решить трудную задачу',
  'Я бы хотел учиться онлайн',
  'Я скучаю по школе, когда болею',
  'Я с удовольствием читаю новый параграф в учебнике',
  'Я радуюсь, когда иду в школу после каникул',
  'Я люблю болеть, потому что могу отдохнуть от школы',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1982_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_1982',
  title: 'Уровень мотивации учения (УМУ)',
  description: 'Опросник оценивает учебную мотивацию младших школьников по четырём аспектам: негативное отношение к очному обучению, стремление демонстрировать компетентность, позитивное отношение к школьной жизни и социальную ценность учения. Разработан для учащихся 3–4-х классов; для 1–2-х классов авторы рекомендуют индивидуальное проведение с разъяснениями и чтением пунктов психологом. Может помочь отслеживать мотивационно-потребностную сферу класса и оценивать изменения при образовательных программах.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'negative_attitude', label: 'Негативное отношение к очному школьному обучению', items: [4, 9, 11, 15], reverseItems: [4, 9, 11, 15], aggregation: 'sum' },
    { key: 'competence', label: 'Демонстрация компетентности', items: [3, 8, 12, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'positive_school_life', label: 'Позитивное отношение к школьной жизни', items: [1, 6, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'social_value', label: 'Социальная значимость учения как ценность', items: [2, 5, 7, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Да»: обратная шкала равна нулю, прямые шкалы получают максимум',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '3'])),
    expected: { negative_attitude: 0, competence: 12, positive_school_life: 9, social_value: 12 },
  },
  {
    title: 'Все ответы «Нет»: обратная шкала получает максимум, прямые шкалы равны нулю',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '0'])),
    expected: { negative_attitude: 12, competence: 0, positive_school_life: 0, social_value: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'umu-kulagina-apasova-fedorov-2021-v1',
};
