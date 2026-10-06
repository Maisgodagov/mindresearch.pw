import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Не относится ко мне вообще' },
  { value: '2', label: 'В основном не похоже на меня' },
  { value: '3', label: 'Скорее не похоже на меня' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Скорее похоже на меня' },
  { value: '6', label: 'В основном похоже на меня' },
  { value: '7', label: 'Описывает меня очень точно' },
];

// Перевод А. Самариной (2016), бланк psytests.org; сохранены формулировки источника.
const items = [
  'Я считаю, что быть собой лучше, чем всем нравиться.',
  'Я не знаю, что творится у меня внутри.',
  'Чужие мнения очень на меня влияют.',
  'Обычно я делаю то, что велят другие.',
  'Мне вечно кажется, что я должен поступать так, чтобы оправдывать чьи-то ожидания.',
  'Окружающие очень сильно на меня влияют.',
  'Мне кажется, что я довольно плохо себя знаю.',
  'Я всегда отстаиваю свои убеждения.',
  'Я верен себе в любой ситуации.',
  'Я не чувствую никакой связи со своим истинным «Я».',
  'Я живу в соответствии со своими ценностями и убеждениями.',
  'Я чувствую отчужденность от себя самого.',
];

export const instrument: SeedSection = {
  code: 'test_2068',
  title: 'Шкала аутентичности (Authenticity Scale, Wood et al.)',
  description: 'Шкала оценивает диспозиционную аутентичность по трём аспектам: аутентичная жизнь и верность собственным ценностям, самоотчуждение и восприимчивость к внешнему влиянию. Подходит для исследовательских и неклинических опросов взрослых; русская версия psytests.org представляет перевод А. Самариной (2016) исходной 12-пунктовой шкалы Wood et al., а её формулировки и ключ отличаются от модифицированной русской версии Нартовой-Бочавер и соавторов.',
  questions: items.map((text, index) => ({
    code: `test_2068_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options: answers,
  })),
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    {
      key: 'authentic_living',
      label: 'Аутентичная жизнь',
      items: [1, 8, 9, 11],
      reverseItems: [],
      aggregation: 'sum',
    },
    {
      key: 'self_alienation',
      label: 'Самоотчуждение',
      items: [2, 7, 10, 12],
      reverseItems: [],
      aggregation: 'sum',
    },
    {
      key: 'accepting_external_influence',
      label: 'Принятие внешнего влияния',
      items: [3, 4, 5, 6],
      reverseItems: [],
      aggregation: 'sum',
    },
    {
      key: 'total_authenticity',
      label: 'Общая аутентичность',
      items: items.map((_, index) => index + 1),
      reverseItems: [2, 3, 4, 5, 6, 7, 10, 12],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: ответы 1 на всех пунктах; прямая АЖ = 4, самоотчуждение = 4, внешнее влияние = 4, общий балл после реверса = 36',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: {
      authentic_living: 4,
      self_alienation: 4,
      accepting_external_influence: 4,
      total_authenticity: 36,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'wood-authenticity-scale-samarina-ru-2016-original-12-v1',
};
