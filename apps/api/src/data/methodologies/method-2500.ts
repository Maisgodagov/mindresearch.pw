import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Скорее согласен' },
  { value: '4', label: 'Согласен' },
];

const items = [
  'Если кто-то, с кем я разговариваю, начинает плакать, у меня наворачиваются слезы на глазах.',
  'Нахождение рядом со счастливым человеком поднимает мне настроение, когда я чувствую себя подавленным.',
  'Когда кто-то тепло улыбается мне, я улыбаюсь в ответ и чувствую тепло внутри.',
  'Меня переполняет печаль, когда люди говорят о смерти своих близких.',
  'Я сжимаю челюсти, и мои плечи напрягаются, когда я вижу в новостях разгневанные лица.',
  'Когда я смотрю в глаза любимого человека, мой разум наполняется мыслями о романтике.',
  'Меня раздражает находиться рядом с разгневанными людьми.',
  'Глядя на испуганные лица жертв в новостях, я пытаюсь представить, что они могли чувствовать.',
  'Я таю, когда та, кого я люблю, прижимает меня к себе.',
  'Я напрягаюсь, когда слышу гневную ссору.',
  'Когда я нахожусь в окружении счастливых людей, мой разум наполняется счастливыми мыслями.',
  'Я ощущаю, как мое тело реагирует, когда любимый человек касается меня.',
  'Я замечаю, что сам становлюсь напряженным, когда нахожусь в окружении людей, испытывающих стресс.',
  'Я плачу над грустными фильмами.',
  'Слушая пронзительные крики перепуганного ребенка в приемной зубного врача, я сам начинаю нервничать.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2518_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2518',
  title: 'Шкала эмоционального заражения (ECS), русская адаптация',
  description: 'Методика измеряет индивидуальную восприимчивость к эмоциональному заражению — склонность эмоционально откликаться на выражения чувств других людей. Пункты охватывают радость, любовь, страх, гнев и грусть; для русскоязычных взрослых подходит полная 15-пунктовая адаптация Косоногова и Кусковой. Авторам опроса полезна для изучения эмоциональной реактивности в социальном взаимодействии; рекомендуемый основной результат — общий балл.',
  categoryIds: ['trait-emotional'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [{
    key: 'total',
    label: 'Общая восприимчивость к эмоциональному заражению',
    items: Array.from({ length: 15 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Не согласен»', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '1'])), expected: { total: 15 } },
  { title: 'Все ответы «Согласен»', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '4'])), expected: { total: 60 } },
  { title: 'Проверка одного повышенного ответа', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 0 ? '4' : '1'])), expected: { total: 18 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ecs-doherty-kosonogov-kuskova-2022-total-sum-1-4-v1',
};
