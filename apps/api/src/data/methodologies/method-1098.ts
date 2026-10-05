import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Почти никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Часто' },
  { value: '3', label: 'Почти всегда' },
];

const items = [
  'Вы даете людям хорошие советы о том, какие цели для них важнее всего.',
  'Вы доверяете спонтанному чувству, которое заставляет вас менять приоритеты.',
  'Вы чувствуете, когда стоит отказаться от выгодного предприятия, потому что случится что-то непредвиденное.',
  'Посмотрев на человека, вы сразу понимаете, сможете ли вы добиться от него желаемого.',
  'Вы погружаетесь в себя, чтобы прийти к верному решению.',
  'Интуиция подсказывает вам, как поступить в сложных ситуациях.',
  'Вам случалось внезапно понимать, как именно поступить, чтобы решить конфликт.',
  'Вы действуете с опережением, упреждением событий.',
  'Вы чувствуете, как человек реагирует на ваши поступки, даже если он это скрывает.',
  'Вас посещают плохие предчувствия перед тем, как случиться неприятностям в делах.',
  'Шум чужих мнений не может перебить ваш внутренний голос, когда вы оцениваете правильность сделанного.',
  'Слушая советы, как исправить ситуацию, вы все равно прислушиваетесь к своему внутреннему голосу.',
  'Вам случалось во сне увидеть способ решения жизненных трудностей.',
  'Вам случалось испытать необъяснимую тягу перепроверить результаты работы и обнаружить там ошибки.',
  'Вы предугадываете желания других людей.',
  'При принятии важных решений вы следуете «зову сердца».',
  'Люди говорят, что вы удачливый человек.',
  'Вы интуитивно выделяете главное в трудной ситуации, то, на что нужно обратить внимание.',
  'Вы чувствуете, какие намерения скрываются за словами человека.',
  'Вы чувствуете, когда именно надо начать важное дело, а когда стоит подождать.',
  'Случалось, что человек еще не осознал проблему, а вы уже предложили ему ее решение.',
  'Стараясь найти выход из сложной ситуации, вы прислушиваетесь к своим ощущениям и сигналам своего тела.',
  'Вы чувствуете, когда стоит отдалиться от человека, чтобы избежать неприятностей.',
  'Вы следуете чутью, решая, продолжить или прекратить добиваться цели после неудачных попыток.',
  'Чутье помогало вам справиться с возникавшими неприятностями в делах.',
  'Вы чувствуете, когда другой человек действует неправильно, даже если это не очевидно.',
  'При оценке результатов сделанного вы больше основываетесь на внутренних ощущениях.',
  'Вам случалось вдруг понять, что ситуация изменилась, хотя внешне все осталось по-прежнему.',
  'Прислушиваясь к голосу интуиции, вам лучше удается улаживать уже возникшие рабочие неприятности.',
  'Вы чувствуете надвигающееся поражение, даже если ситуация остается внешне благоприятной.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1128_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1128',
  title: 'Опросник параметров интуиции в структуре саморегуляции деятельности (ИССД)',
  description: 'Опросник оценивает, насколько интуиция включена в разные этапы саморегуляции деятельности — от постановки цели до коррекции действий, — и в субъект-субъектные, самосубъектные и субъект-объектные отношения. Подходит для взрослых респондентов; опубликованная стандартизация проведена на выборке 18–68 лет. Результат помогает описать профиль роли интуитивных сигналов в деятельности и общении.',
  questions,
};

const goalStages = [1, 2, 3, 4, 5, 6];
const significantConditions = [7, 8, 9, 10, 11, 12];
const actionProgram = [13, 14, 15, 16, 17, 18];
const controlEvaluation = [19, 20, 21, 22, 23, 24];
const correctionDecision = [25, 26, 27, 28, 29, 30];
const subjectSubject = [1, 2, 7, 8, 13, 14, 19, 20, 25, 26];
const selfSubject = [3, 4, 9, 10, 15, 16, 21, 22, 27, 28];
const subjectObject = [5, 6, 11, 12, 17, 18, 23, 24, 29, 30];

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'goal_setting', label: 'Постановка цели', items: goalStages, reverseItems: [], aggregation: 'sum' },
    { key: 'conditions_model', label: 'Принятие модели значимых условий', items: significantConditions, reverseItems: [], aggregation: 'sum' },
    { key: 'action_program', label: 'Построение программы исполнительских действий', items: actionProgram, reverseItems: [], aggregation: 'sum' },
    { key: 'control_evaluation', label: 'Контроль, оценка результатов и выделение критериев достижения цели', items: controlEvaluation, reverseItems: [], aggregation: 'sum' },
    { key: 'correction_decision', label: 'Принятие решения о коррекции', items: correctionDecision, reverseItems: [], aggregation: 'sum' },
    { key: 'subject_subject', label: 'Интуиция в субъект-субъектных отношениях', items: subjectSubject, reverseItems: [], aggregation: 'sum' },
    { key: 'self_subject', label: 'Интуиция в самосубъектных отношениях', items: selfSubject, reverseItems: [], aggregation: 'sum' },
    { key: 'subject_object', label: 'Интуиция в субъект-объектных отношениях', items: subjectObject, reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: почти никогда по всем пунктам', answers: allAnswers(0), expected: { goal_setting: 0, conditions_model: 0, action_program: 0, control_evaluation: 0, correction_decision: 0, subject_subject: 0, self_subject: 0, subject_object: 0 } },
  { title: 'Ручная проверка: часто по всем пунктам', answers: allAnswers(2), expected: { goal_setting: 12, conditions_model: 12, action_program: 12, control_evaluation: 12, correction_decision: 12, subject_subject: 20, self_subject: 20, subject_object: 20 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'issd-grigoryev-vasilyeva-2017-standardization-2024-v1',
};
