import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNoOptions = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const itemTexts = [
  'В целом, удовлетворены ли вы своей жизнью?',
  'Вы забросили большую часть своих занятий и интересов?',
  'Вы чувствуете, что ваша жизнь пуста?',
  'Вам часто становится скучно?',
  'У вас хорошее настроение большую часть времени?',
  'Вы опасаетесь, что с вами случится что-то плохое?',
  'Вы чувствуете себя счастливым большую часть времени?',
  'Вы чувствуете себя беспомощным?',
  'Вы предпочитаете остаться дома, нежели выйти на улицу и заняться чем-нибудь новым?',
  'Считаете ли вы, что ваша память хуже, чем у других?',
  'Считаете ли вы, что жить – это прекрасно?',
  'Чувствуете ли вы себя сейчас бесполезным?',
  'Чувствуете ли вы себя полным энергией и жизненной силой?',
  'Ощущаете ли вы безнадежность той ситуации, в которой находитесь в настоящее время?',
  'Считаете ли вы, что окружающие вас люди живут более полноценной жизнью в сравнении с вами?',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_192_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: yesNoOptions,
}));

export const instrument: SeedSection = {
  code: 'test_192',
  title: 'Гериатрическая шкала депрессии, краткая форма (GDS-15)',
  description: 'Краткая скрининговая шкала депрессивных симптомов для пожилых людей. Охватывает удовлетворённость жизнью, интересы и активность, настроение, беспомощность, опасения, самооценку памяти, ощущение энергии и надежды; предназначена для оценки пожилого респондента и не заменяет клиническую диагностику.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    {
      key: 'depressiveSymptoms',
      label: 'Депрессивные симптомы (GDS-15)',
      items: Array.from({ length: 15 }, (_, index) => index + 1),
      reverseItems: [1, 5, 7, 11, 13],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы в направлении отсутствия симптомов — 0 баллов',
    answers: { '1': 1, '2': 0, '3': 0, '4': 0, '5': 1, '6': 0, '7': 1, '8': 0, '9': 0, '10': 0, '11': 1, '12': 0, '13': 1, '14': 0, '15': 0 },
    expected: { depressiveSymptoms: 0 },
  },
  {
    title: 'Все ответы в направлении депрессивных симптомов — 15 баллов',
    answers: { '1': 0, '2': 1, '3': 1, '4': 1, '5': 0, '6': 1, '7': 0, '8': 1, '9': 1, '10': 1, '11': 0, '12': 1, '13': 0, '14': 1, '15': 1 },
    expected: { depressiveSymptoms: 15 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sheikh-yesavage-gds-15-russian-form-yes-no-sum-v1',
};
