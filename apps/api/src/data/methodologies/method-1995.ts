import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  'Вы испытываете несправедливое отношение к себе со стороны близких вам людей?',
  'Чувство ревности не может толкнуть вас на необдуманный поступок?',
  'Если вы потеряете значимого для вас человека, то вам трудно будет без него дальше жить?',
  'Вам постоянно мешают разные препятствия для удовлетворения своих желаний?',
  'Вы довольны поведением тех людей, которые много для вас значат?',
  'Вы часто испытываете чувство одиночества?',
  'Вам тяжело отказаться от своих привычек?',
  'Любовь доставляет вам удовольствие?',
  'Вы ощущаете серьезный недостаток внимания со стороны окружающих?',
  'Мысли о своей половой несостоятельности вас не волнуют?',
  'Вы не сомневаетесь в целесообразности собственной жизни?',
  'У вас очень тяжелое заболевание?',
  'Вы не считаете себя уродливым?',
  'Вы не опасаетесь судебной ответственности?',
  'Вы боитесь наказания или позора за свой проступок или преступление?',
  'Вы способны себя очень сурово наказать за неблаговидный поступок?',
  'В своей профессиональной области вы не состоялись?',
  'К вам предъявили несправедливые требования по исполнению вами своих профессиональных обязанностей?',
  'Вы испытываете серьезные материальные и бытовые трудности?',
  'Вы можете себя считать способным на крайние действия в сложной ситуации?',
  'Вы трудно переносите сильные психоэмоциональные нагрузки?',
  'Вы часто категоричны и прямолинейны в своих суждениях?',
  'Будущее вам кажется мрачным и бесперспективным?',
  'У вас есть хорошие прогнозы своего будущего?',
  'Вы часто занижаете свои способности?',
  'Как вы считаете, может ли жизнь потерять ценность для человека в экстремальной ситуации?',
];

const options = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
];

const riskYes = [1, 3, 4, 6, 7, 9, 12, 15, 16, 17, 18, 19, 20, 22, 23, 25, 26];
const riskNo = [2, 5, 8, 10, 11, 13, 14, 24];
const resilienceYes = [1, 3, 4, 6, 9, 21, 23, 25];
const resilienceNo = [5, 8, 10, 24];
const keyedItems = (yesItems: number[], noItems: number[]) => [...yesItems, ...noItems];
const keyedAnswers = (yesItems: number[], noItems: number[]) => Object.fromEntries([
  ...yesItems.map(item => [String(item), 'yes']),
  ...noItems.map(item => [String(item), 'no']),
]);

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2011_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2011',
  title: 'Факторы суицидного риска (ФСР-26)',
  description: 'ФСР-26 П. И. Юнацкевича описывает выраженность склонности к суицидным реакциям и устойчивость к психоэмоциональным нагрузкам. Пункты охватывают переживание одиночества и утраты, трудности отношений и самовосприятия, жизненные и профессиональные затруднения, оценку будущего и способность переносить нагрузку. Версия из руководства 2018 года предназначена для дополнительной оценки специалистом; результаты не являются самостоятельным прогнозом или диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'suicidal_reaction_tendency', label: 'Склонность к суицидным реакциям', items: keyedItems(riskYes, riskNo), reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries([...riskYes.map(item => [item, { yes: 1, no: 0 }]), ...riskNo.map(item => [item, { yes: 0, no: 1 }])]) },
    { key: 'psychoemotional_resilience', label: 'Устойчивость к психоэмоциональным нагрузкам', items: keyedItems(resilienceYes, resilienceNo), reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries([...resilienceYes.map(item => [item, { yes: 1, no: 0 }]), ...resilienceNo.map(item => [item, { yes: 0, no: 1 }])]) },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка ключа: ответы совпадают с ключевыми во всех пунктах обеих шкал',
    answers: { ...keyedAnswers(riskYes, riskNo), '21': 'yes' },
    expected: { suicidal_reaction_tendency: 25, psychoemotional_resilience: 12 },
  },
  {
    title: 'Ручная сверка ключа: ответы противоположны ключевым во всех пунктах обеих шкал',
    answers: Object.fromEntries([...statements.keys()].map(index => [String(index + 1), 'yes'])),
    expected: { suicidal_reaction_tendency: 17, psychoemotional_resilience: 8 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'yunatskevich-fsr-26-2018-keyed-binary-sums-v1',
};
