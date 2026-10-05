import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Скорее, не согласен' },
  { value: '3', label: 'Не уверен' },
  { value: '4', label: 'Пожалуй, могу согласиться' },
  { value: '5', label: 'Полностью согласен' },
];

const statements = [
  'Я понял инструкцию.',
  'Мне нравится, когда отменяют какие-нибудь уроки.',
  'Когда я получаю плохую отметку, мне потом весь урок трудно заниматься.',
  'На уроках я стараюсь максимально использовать свои способности.',
  'Я доволен своей учебой.',
  'Я бы хотел, чтобы в школе остались одни перемены.',
  'Неудачи на уроках мешают мне сосредоточиться на учебе.',
  'На уроках я занимаюсь с полной отдачей.',
  'Я доволен тем, как складываются мои школьные дела.',
  'Я больше люблю перемены, чем уроки.',
  'Если я ошибаюсь на уроке, то потом мне сложно выполнять домашнее задание.',
  'В школе я стараюсь заниматься на полную мощь.',
  'Меня устраивает то, как я работаю на уроке.',
  'Я бы хотел, чтобы мне не задавали домашнее задание.',
  'Если я делаю ошибку на одном из уроков, то мне потом сложно сосредоточиться в течение всего дня.',
  'Я вкладываю все свои силы, чтобы учиться.',
  'Я чаще радуюсь результатам своей учебы, чем огорчаюсь.',
  'Я бы хотел, чтобы на уроках мы только играли.',
  'После сделанной ошибки мне сложно сосредоточиться на уроке.',
  'На уроках я занимаюсь в полную силу.',
  'Меня радует то, каких результатов я добиваюсь в учебе.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1312_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1312',
  title: 'Опросник учебной активности младших школьников (УАмлШк-03/20)',
  description: 'Опросник измеряет учебную активность учащихся 3–4-х классов и её четыре компонента: потенциал (готовность включаться в учение), регулятивный компонент (сохранение сосредоточенности при ошибках), динамический компонент (вкладываемые усилия) и результативный компонент (удовлетворённость учебными результатами). Автору опроса он помогает получить профиль этих компонентов и интегральный показатель учебной активности.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'potential', label: 'Потенциал учебной активности', items: [2, 6, 10, 14, 18], reverseItems: [2, 6, 10, 14, 18], aggregation: 'sum' },
    { key: 'regulatory', label: 'Регулятивный компонент учебной активности', items: [3, 7, 11, 15, 19], reverseItems: [3, 7, 11, 15, 19], aggregation: 'sum' },
    { key: 'dynamic', label: 'Динамический компонент учебной активности', items: [4, 8, 12, 16, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'results', label: 'Результативный компонент учебной активности', items: [5, 9, 13, 17, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'activity', label: 'Учебная активность (интегративная шкала)', items: Array.from({ length: 20 }, (_, index) => index + 2), reverseItems: [2, 3, 6, 7, 10, 11, 14, 15, 18, 19], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка реверсирования и сумм по всем шкалам',
    answers: Object.fromEntries(Array.from({ length: 21 }, (_, index) => [String(index + 1), 1])),
    expected: { potential: 20, regulatory: 20, dynamic: 5, results: 5, activity: 50 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'krasnov-uamlshk-03-20-2009-v1',
};
