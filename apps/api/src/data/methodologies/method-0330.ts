import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Почти никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Почти всегда' },
  { value: '4', label: 'Всегда' },
];

const itemTexts = [
  'Другие люди не могут слышать меня из-за моего голоса',
  'Мне не хватает воздуха во время разговора',
  'Люди с трудом понимают меня в шумной комнате',
  'Звук моего голоса меняется в течение дня',
  'Моя семья с трудом слышит меня, когда я зову их дома',
  'Я пользуюсь телефоном реже, чем хотелось бы',
  'Из-за проблем с голосом я напряжен(а), когда разговариваю с другими',
  'Я стараюсь избегать групп людей из-за моего голоса',
  'Людей раздражает мой голос',
  'Люди спрашивают: «Что не так с твоим голосом?»',
  'Из-за моего голоса я редко общаюсь с друзьями, соседями и родственниками',
  'Во время беседы люди просят меня повторить то, что я сказал(а)',
  'Мой голос звучит грубо и сухо',
  'Я чувствую, что должен(на) напрячься, чтобы говорить',
  'Я считаю, что другие люди не понимают мои проблемы с голосом',
  'Проблемы с голосом ограничивают мою личную и социальную жизнь',
  'Четкость моего голоса непредсказуема',
  'Я пытаюсь изменить свой голос, чтобы он звучал по-другому',
  'Я чувствую себя социально изолированным из-за своего голоса',
  'Я прилагаю много усилий, чтобы говорить',
  'Мой голос ухудшается к вечеру',
  'Из-за проблем с голосом я теряю часть доходов',
  'Мои проблемы с голосом расстраивают меня',
  'Я менее общителен(льна) из-за своих проблем с голосом',
  'Я чувствую себя неполноценным(ой) из-за голоса',
  'Чувствую, что мой голос выдает меня в середине разговора',
  'Я раздражаюсь, когда другие просят меня повторить то, что я сказал(а)',
  'Мне стыдно, когда другие просят меня повторить то, что я сказал(а)',
  'Я чувствую себя некомпетентным(ой) при разговоре',
  'Меня смущают проблемы с голосом',
];

const functionalItems = [1, 3, 5, 6, 8, 11, 12, 16, 19, 22];
const physicalItems = [2, 4, 10, 13, 14, 17, 18, 20, 21, 26];
const emotionalItems = [7, 9, 15, 23, 24, 25, 27, 28, 29, 30];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_362_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_362',
  title: 'Индекс изменения голоса-30 (VHI-30рус)',
  description: 'Опросник оценивает субъективное влияние нарушений голоса на повседневную жизнь взрослых пациентов с дисфонией. Охватывает функциональные трудности общения и участия в социальной жизни, физические ощущения и характеристики голоса, а также эмоциональные реакции на голосовые проблемы; полезен для количественной оценки воспринимаемого голосового ограничения и отслеживания изменений.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'functional', label: 'Функциональная шкала', items: functionalItems, reverseItems: [], aggregation: 'sum' },
    { key: 'physical', label: 'Физическая шкала', items: physicalItems, reverseItems: [], aggregation: 'sum' },
    { key: 'emotional', label: 'Эмоциональная шкала', items: emotionalItems, reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл VHI-30', items: Array.from({ length: 30 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Никогда»', answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 0])), expected: { functional: 0, physical: 0, emotional: 0, total: 0 } },
  { title: 'Все ответы «Всегда»', answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 4])), expected: { functional: 40, physical: 40, emotional: 40, total: 120 } },
  { title: 'Единица в первом функциональном пункте', answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), index === 0 ? 1 : 0])), expected: { functional: 1, physical: 0, emotional: 0, total: 1 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'jacobson-vhi-30-russian-adaptation-kryshtopova-semenov-petrova-2021-sum-v1',
};
