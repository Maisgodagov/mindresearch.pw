import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Всегда' },
];

const items = [
  'Члены нашей команды горячо и открыто обсуждают любые вопросы и проблемы.',
  'Члены нашей команды открыто критикуют друг друга за недостатки и непродуктивное поведение.',
  'Члены нашей команды знают, над чем работают их коллеги и какой вклад они вносят в достижение общей цели команды.',
  'Члены нашей команды искренне и сразу же приносят извинения, если им случается задеть кого-то из коллег или непреднамеренно нанести ущерб командной работе.',
  'Члены нашей команды готовы пожертвовать чем-то (премией, славой, штатной единицей) ради блага всей команды.',
  'Члены нашей команды открыто признают свои слабости и ошибки.',
  'Совещания нашей команды очень интересны, на них никогда не бывает скучно.',
  'Члены нашей команды после совещания уверены в том, что их коллеги полностью поддерживают принятые решения и будут их выполнять, даже если сначала не были согласны с ними.',
  'Атмосфера в нашей команде в значительной степени зависит от успеха в достижении целей.',
  'На совещаниях нашей команды непременно рассматриваются самые важные и самые трудные вопросы; по ним обязательно принимаются конкретные решения.',
  'Члены нашей команды делают всё, чтобы не подвести своих коллег.',
  'Члены нашей команды знают всё о личной жизни друг друга и спокойно обсуждают ее.',
  'Члены нашей команды заканчивают обсуждение всех вопросов четкими и ясными резолюциями.',
  'Члены нашей команды контролируют выполнение планов и качество работы друг друга.',
  'Члены нашей команды не хвастаются своими достижениями, но с удовольствием признают успехи коллег.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1387_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1387',
  title: 'Оценка команды по Ленсиони',
  description: 'Анкета оценивает уязвимость рабочей команды к пяти типичным нарушениям совместной работы: взаимному недоверию, боязни открытого конфликта, недостаточной приверженности решениям, уклонению от взаимной ответственности и безразличию к общим результатам. Подходит членам одной команды и руководителям для обсуждения сильных сторон и зон развития команды; это русская 15-пунктовая версия перевода И. Коротенко (2011).',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 3,
  scales: [
    { key: 'trust', label: 'Взаимное доверие', items: [4, 6, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'fear_of_conflict', label: 'Боязнь конфликта', items: [1, 7, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'lack_of_commitment', label: 'Недостаточная приверженность решениям', items: [3, 8, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'avoidance_of_accountability', label: 'Уклонение от ответственности', items: [2, 11, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'inattention_to_results', label: 'Безразличие к результатам', items: [5, 9, 15], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Редко» дают по три балла на каждой шкале',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, index) => [String(index + 1), 1])),
    expected: {
      trust: 3,
      fear_of_conflict: 3,
      lack_of_commitment: 3,
      avoidance_of_accountability: 3,
      inattention_to_results: 3,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lencioni-team-assessment-korotenko-ru-15item-3point-sum-v1',
};
