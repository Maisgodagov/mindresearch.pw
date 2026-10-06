import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '3', label: 'Очень похоже' },
  { value: '2', label: 'Скорее похоже' },
  { value: '1', label: 'Скорее не похоже' },
  { value: '0', label: 'Совсем не похоже' },
];

const items = [
  'Разговаривает со мной теплым и дружелюбным голосом.',
  'Не помогает мне так много, как мне необходимо.',
  'Позволяет заниматься тем, что мне нравится.',
  'Кажется эмоционально холодной со мной.',
  'Понимает мои проблемы и беспокойства.',
  'Любящая меня.',
  'Предпочитает, чтобы я принимал собственные решения.',
  'Не хочет, чтобы я взрослел.',
  'Пытается контролировать всё, чем я занимаюсь.',
  'Вторгается в мою личную жизнь.',
  'Получает удовольствие, обсуждая со мной разные темы.',
  'Часто мне улыбается.',
  'Заботится обо мне, как о маленьком ребенке.',
  'Кажется, не понимает моих желаний и потребностей.',
  'Позволяет мне принимать решения самостоятельно.',
  'Дает мне почувствовать, что я не нужен.',
  'Может улучшить мое настроение, если я чем-то расстроен.',
  'Мало разговаривает со мной.',
  'Пытается заставить меня чувствовать себя зависимым от нее.',
  'Думает, что я не могу заботиться о себе сам, когда ее нет рядом.',
  'Дает мне столько свободы, сколько я хочу.',
  'Позволяет мне выходить из дома так часто, как мне хочется.',
  'Оберегает меня сверх меры.',
  'Не хвалит меня.',
  'Позволяет одеваться так, как мне нравится.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2577_${index + 1}`,
  text: `Моя мама ${text}`,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2577',
  title: 'Юношеский отчет о родительском отношении (PBI), отношение матери',
  description: 'Опросник измеряет восприятие молодым человеком отношения матери по двум аспектам: эмоциональное принятие и заботу, а также гиперопеку, выраженную чрезмерным контролем и ограничением самостоятельности. Русскоязычная адаптация подтверждена на выборке старшеклассников; методика подходит для актуальной оценки у молодых людей с 16 лет и для ретроспективной оценки взрослыми.',
  categoryIds: ['parenting'],
  questions,
};

const careItems = [1, 2, 4, 5, 6, 11, 12, 14, 16, 17, 18, 24];
const careReverseItems = [2, 4, 14, 16, 18, 24];
const overprotectionItems = [3, 7, 8, 9, 10, 13, 15, 19, 20, 21, 22, 23, 25];
const overprotectionReverseItems = [3, 7, 15, 21, 22, 25];

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'care', label: 'Принятие', items: careItems, reverseItems: careReverseItems, aggregation: 'sum' },
    { key: 'overprotection', label: 'Гиперопека', items: overprotectionItems, reverseItems: overprotectionReverseItems, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Очень похоже»: проверка прямого и обратного кодирования',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '3'])),
    expected: { care: 30, overprotection: 27 },
  },
  {
    title: 'Все ответы «Совсем не похоже»: проверка крайних значений обратных пунктов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '0'])),
    expected: { care: 18, overprotection: 25 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pbi-youth-report-ru-tikhomirova-gaysina-malykh-2021-mother-v1',
};
