import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем не важно' },
  { value: '1', label: 'Скорее, не важно' },
  { value: '2', label: 'Средне' },
  { value: '3', label: 'Скорее, важно' },
  { value: '4', label: 'Очень важно' },
];

const items = [
  'Стать лучшим, занять первое место',
  'Ощутить себя сильным, ловким',
  'Получить ценный жизненный опыт (знания, умения)',
  'Общаться с интересными людьми',
  'Возможность путешествовать',
  'Оправдать надежды близких',
  'Получить высокий спортивный разряд',
  'Получить физическую разрядку',
  'Улучшить фигуру, укрепить здоровье',
  'Приобрести широкий круг общения',
  'Иметь ценные призы и подарки',
  'Чтобы родители были довольны',
  'Стать лучшим (чемпионом)',
  'Ощутить «мышечную радость»',
  'Развить свои физические качества – силу, гибкость, быстроту',
  'Иметь хорошую компанию',
  'Иметь льготы (освобождение от учебы, красивую форму, другое)',
  'Чтоб тренер был мной доволен',
  'Стать известным, прославиться',
  'Получить острые ощущения',
  'Улучшить характер, развить волю',
  'Приобрести новых друзей',
  'Возможность зарабатывать деньги',
  'Сделать то, что должен',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2558_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2558',
  title: 'Экспресс-методика изучения мотивов занятий спортом',
  description: 'Методика Г. В. Лозовой оценивает ведущие мотивы занятий спортом у спортсменов: ориентацию на результат, удовольствие от процесса, самосовершенствование, общение, вознаграждение и долженствование. Она помогает автору опроса увидеть, какие побуждения участники считают наиболее значимыми в текущий период; это экспресс-опросник спортивной мотивации, без нормативной диагностики.',
  categoryIds: ['sport'],
  questions,
};

const scaleInfo = [
  { key: 'result', label: 'Мотивация на результат', items: [1, 7, 13, 19] },
  { key: 'process', label: 'Мотивация на удовольствие от процесса', items: [2, 8, 14, 20] },
  { key: 'self_improvement', label: 'Мотивация на самосовершенствование', items: [3, 9, 15, 21] },
  { key: 'communication', label: 'Мотивация на общение', items: [4, 10, 16, 22] },
  { key: 'reward', label: 'Мотивация на вознаграждение', items: [5, 11, 17, 23] },
  { key: 'obligation', label: 'Мотивация долженствования', items: [6, 12, 18, 24] },
];

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: scaleInfo.map(({ key, label, items }) => ({ key, label, items, reverseItems: [], aggregation: 'sum' })),
};

const uniformAnswers = (value: string) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Совсем не важно»: нулевые значения по всем шкалам',
    answers: uniformAnswers('0'),
    expected: { result: 0, process: 0, self_improvement: 0, communication: 0, reward: 0, obligation: 0 },
  },
  {
    title: 'Все ответы «Очень важно»: максимум 16 по каждой шкале',
    answers: uniformAnswers('4'),
    expected: { result: 16, process: 16, self_improvement: 16, communication: 16, reward: 16, obligation: 16 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lozovaya-sport-motives-24item-six-scales-v1',
};
