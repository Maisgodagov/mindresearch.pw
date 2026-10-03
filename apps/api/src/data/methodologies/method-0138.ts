import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Полностью не согласны' },
  { value: '2', label: 'Скорее не согласны' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'Скорее согласны' },
  { value: '5', label: 'Полностью согласны' },
];

const statements = [
  'Я могу влиять на принятие новых законов и политических решений в моей стране.',
  'Я могу способствовать избранию политического лидера, чьи взгляды я разделяю.',
  'Я могу требовать исполнения существующих законов и политических решений.',
  'Вместе граждане моей страны могут влиять на принятие новых законов и политических решений.',
  'Вместе граждане моей страны могут способствовать избранию политического лидера, чьи взгляды они разделяют.',
  'Вместе граждане моей страны могут требовать исполнения существующих законов.',
  'Люди, стоящие во главе государства, готовы предоставить информацию о том, как принимаются политические решения.',
  'Люди, стоящие во главе государства, заинтересованы в создании равных прав для всех политических сил.',
  'Люди, стоящие во главе государства, заинтересованы в исполнении законных требований граждан.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_175_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_175',
  title: 'Воспринимаемая политическая эффективность (короткая версия)',
  description: 'Девять утверждений оценивают личную, коллективную и внешнюю политическую самоэффективность. Подумайте о текущей политической ситуации в вашей стране. Оцените согласие с каждым утверждением по шкале от 1 до 5.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'personal', label: 'Личная внутренняя политическая самоэффективность', items: [1, 2, 3], reverseItems: [], aggregation: 'mean' },
    { key: 'collective', label: 'Групповая внутренняя политическая самоэффективность', items: [4, 5, 6], reverseItems: [], aggregation: 'mean' },
    { key: 'external', label: 'Внешняя политическая самоэффективность', items: [7, 8, 9], reverseItems: [], aggregation: 'mean' },
  ],
};

const answers = (value: number) => Object.fromEntries(statements.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы минимальные: среднее каждой шкалы равно 1', answers: answers(1), expected: { personal: 1, collective: 1, external: 1 } },
  { title: 'Проверка ключа: личная 5, коллективная 3, внешняя 1', answers: { '1': 5, '2': 5, '3': 5, '4': 3, '5': 3, '6': 3, '7': 1, '8': 1, '9': 1 }, expected: { personal: 5, collective: 3, external: 1 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sarieva-perceived-political-efficacy-short-2018-v1',
};
