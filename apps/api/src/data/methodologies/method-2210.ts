import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не обеспокоен(а)' },
  { value: '2', label: 'Слегка обеспокоен(а)' },
  { value: '3', label: 'В средней степени обеспокоен(а)' },
  { value: '4', label: 'Очень обеспокоен(а)' },
  { value: '5', label: 'Чрезвычайно обеспокоен(а)' },
];

const items = [
  'заикаюсь',
  'плохо одет(а)',
  'скучен/скучна',
  'потею',
  'физически непривлекателен/непривлекательна',
  'не контролирую свои эмоции',
  'краснею',
  'говорю дрожащим голосом',
  'имею дефекты внешности',
  'не умею налаживать отношения',
  'странно выгляжу',
  'не имею индивидуальности',
  'толст(ый/ая)',
  'не способен/способна выразить свои мысли',
  'непроизвольно подергиваюсь',
  'скован(ный/ная)',
  'не обладаю чувством юмора',
  'замкнут(ый/ая)',
  'отчужден(ный/ная)',
  'глуп(ый/ая)',
  'неуклюж(ий/ая) в социальных взаимодействиях',
  'у меня плохая прическа',
  'разговариваю бессвязно',
  'не имею навыков общения',
  'суетлив(ый/ая)',
  'не моден/не модна',
  'уродлив(ый/ая)',
];

const questions: SeedSection['questions'] = items.map((item, index) => ({
  code: `test_2224_${index + 1}`,
  text: `В ситуациях социального взаимодействия, которые вызывают у меня тревогу, людям станет очевидно, что я ${item}. Насколько сильно вы обеспокоены этим?`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2224',
  title: 'Шкала негативного образа себя (NSPS)',
  description: 'NSPS измеряет обеспокоенность тем, что в вызывающих тревогу социальных ситуациях окружающие заметят воспринимаемые человеком недостатки. Охватывает опасения о социальной компетентности, внешности и заметных признаках тревоги. Версия из 27 пунктов предназначена для самоотчёта взрослых и исследовательского или клинического описания опасений, связанных с социальной тревогой; русская форма psytests.org (2024) представляет перевод оригинала, сведения о российской адаптации не опубликованы.',
  questions,
};

const competenceItems = [3, 6, 10, 12, 14, 17, 18, 19, 20, 21, 23, 24];
const appearanceItems = [2, 5, 9, 11, 13, 22, 26, 27];
const anxietySignItems = [4, 7, 8, 15, 16, 25];

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'socialCompetence', label: 'Социальная компетентность', items: competenceItems, reverseItems: [], aggregation: 'sum' },
    { key: 'physicalAppearance', label: 'Физическая внешность', items: appearanceItems, reverseItems: [], aggregation: 'sum' },
    { key: 'anxietySigns', label: 'Признаки тревоги', items: anxietySignItems, reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл NSPS', items: Array.from({ length: 27 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы — 1', answers: allAnswers(1), expected: { socialCompetence: 12, physicalAppearance: 8, anxietySigns: 6, total: 27 } },
  { title: 'Все ответы — 5', answers: allAnswers(5), expected: { socialCompetence: 60, physicalAppearance: 40, anxietySigns: 30, total: 135 } },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ["mood-anxiety"],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'nsps-moscovitch-huyder-2011-psytests-ru-v1',
};
