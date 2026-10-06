import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Нет' },
  { value: '1', label: 'Да' },
];

const items = [
  'Тренер умеет точно предсказать результаты своих учеников.',
  'Мне трудно ладить с тренером.',
  'Тренер — справедливый человек.',
  'Тренер умело подводит меня к соревнованиям.',
  'Тренеру явно не хватает чуткости в отношениях с людьми.',
  'Слово тренера для меня — закон.',
  'Тренер тщательно планирует тренировочную работу со мной.',
  'Я вполне доволен тренером.',
  'Тренер недостаточно требователен ко мне.',
  'Тренер всегда может дать разумный совет.',
  'Я полностью доверяю тренеру.',
  'Оценка тренера очень важна для меня.',
  'Тренер в основном работает по шаблону.',
  'Работать с тренером — одно удовольствие.',
  'Тренер уделяет мне мало внимания.',
  'Тренер, как правило, не учитывает моих индивидуальных особенностей.',
  'Тренер плохо чувствует мое настроение.',
  'Тренер всегда выслушивает мое мнение.',
  'У меня нет сомнений в правильности и необходимости методов и средств, которые применяет тренер.',
  'Я не стану делиться с тренером своими мыслями.',
  'Тренер наказывает меня за малейший проступок.',
  'Тренер хорошо знает мои слабые и сильные стороны.',
  'Я хотел бы стать похожим на тренера.',
  'У нас с тренером чисто деловые отношения.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2472_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2472',
  title: 'Шкала Тренер—Спортсмен, ТС-1',
  description: 'Шкала отражает отношение спортсмена к конкретному тренеру по трём сторонам взаимодействия: воспринимаемой профессиональной компетентности, эмоциональной симпатии и реальному поведению в контакте. Результаты помогают автору опроса описать, как спортсмены воспринимают работу, личностное отношение и взаимодействие с тренером; предназначена для спортсменов, оценивающих своего тренера.',
  categoryIds: ['sport'],
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'gnostic', label: 'Гностический компонент', items: [1, 4, 7, 10, 13, 16, 19, 22], reverseItems: [13, 16], aggregation: 'sum' },
    { key: 'emotional', label: 'Эмоциональный компонент', items: [2, 5, 8, 11, 14, 17, 20, 23], reverseItems: [2, 5, 17, 20], aggregation: 'sum' },
    { key: 'behavioral', label: 'Поведенческий компонент', items: [3, 6, 9, 12, 15, 18, 21, 24], reverseItems: [9, 15, 21, 24], aggregation: 'sum' },
  ],
};

const allYes = Object.fromEntries(items.map((_, index) => [String(index + 1), 1]));
const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «да»: сумма прямых и обратных ключей по каждой шкале',
    answers: allYes,
    expected: { gnostic: 6, emotional: 4, behavioral: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'hanin-stambulov-ts1-fetiskin-24item-binary-key-v1',
};
