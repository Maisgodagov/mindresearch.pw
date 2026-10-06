import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Нечто среднее' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я горжусь тем, что моя жизнь связана с этим регионом',
  'Я чувствую себя частью этого региона',
  'Я бы хотел(а) в ближайшее время переехать в другой регион',
  'Если бы по какой-то причине мне пришлось уехать из этого региона, я бы обязательно постарался(ась) когда-нибудь сюда вернуться',
  'Когда я уезжаю отсюда надолго, то начинаю скучать по местной природе и климату, будто этот регион стал частью меня',
  'Если во время общения в семье, с друзьями или знакомыми кто-либо скажет что-то неприятное о природных особенностях этого региона, я, скорее всего, расстроюсь',
  'Я чувствую сильную связь с природой этого региона',
  'Я думаю, что этот регион — самый красивый в стране',
  'Я чувствую себя частью истории этого региона',
  'Сохранять историческое наследие этого региона — большая честь',
  'Я принадлежу к этому региону и к этой культуре — со всеми их достоинствами и недостатками',
  'В какой-то степени я есть отражение культуры этого региона',
  'Я горжусь тем, что живу в регионе со своими самобытными традициями, обычаями и фольклором',
  'Я чувствую некую глубинную связь с людьми, живущими в этом регионе',
  'Когда я слышу что-то хорошее о местных жителях, то воспринимаю это как личный комплимент',
  'Когда я говорю о людях, живущих в этом регионе, то часто использую местоимение «мы» вместо «они»',
  'Мне было бы приятно, если бы меня характеризовали как типичного представителя этого региона',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2368_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2368',
  title: 'Шкала региональной идентичности (русскоязычная версия)',
  description: 'Шкала оценивает выраженность региональной идентичности: чувство принадлежности региону, идентификацию с его территорией и природой, культурой и историей, а также с местным населением. Русскоязычная версия предназначена для исследований жителей регионов России; показатели помогают автору опроса сопоставлять эти аспекты и общий уровень идентификации.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'belonging', label: 'Чувство принадлежности региону', items: [1, 2, 3, 4], reverseItems: [3], aggregation: 'mean' },
    { key: 'territory', label: 'Идентификация с территорией', items: [5, 6, 7, 8], reverseItems: [], aggregation: 'mean' },
    { key: 'culture', label: 'Идентификация с культурой', items: [9, 10, 11, 12, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'population', label: 'Идентификация с населением', items: [14, 15, 16, 17], reverseItems: [], aggregation: 'mean' },
    { key: 'overall', label: 'Общий показатель региональной идентичности', items: items.map((_, index) => index + 1), reverseItems: [3], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «нечто среднее» дают 3 по каждой шкале; обратный пункт также преобразуется в 3',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { belonging: 3, territory: 3, culture: 3, population: 3, overall: 3 },
  },
  {
    title: 'Ручная проверка реверса: несогласие с желанием переехать повышает принадлежность и общий показатель',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 2 ? 1 : 5])),
    expected: { belonging: 5, territory: 5, culture: 5, population: 5, overall: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['social-culture'],
  scoringConfig,
  validationCases,
  formulaVersion: 'ris2-kuznetsov-sychev-zelianskaia-belousov-2022-v1',
};
