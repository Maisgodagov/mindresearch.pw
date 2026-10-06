import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const items = [
  'Как часто вам было сложно сконцентрироваться на том, что вам говорят люди, даже когда обращаются непосредственно к вам?',
  'Как часто вы покидали свое место на совещании, или в других ситуациях, в которых вам следовало оставаться на своем месте?',
  'Как часто вам было трудно расслабиться и отдохнуть, когда у вас было свободное время?',
  'Как часто во время разговора вы ловили себя на том, что заканчиваете за собеседниками фразы до того, как они смогут договорить сами?',
  'Как часто вы откладывали дела до последнего момента?',
  'Как часто вы зависите от других в том, что касается поддержания порядка в вашей жизни и внимания к деталям?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2121_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2121',
  title: 'Шкала диагностики СДВГ у взрослых ASRS-5 (DSM-5)',
  description: 'Шестипунктовая скрининговая версия ASRS-5 оценивает выраженность текущих проявлений СДВГ у взрослых за последние шесть месяцев: трудности внимания и исполнительной организации, гиперактивность и импульсивность. Она полезна как краткий первичный скрининг взрослой аудитории и не заменяет клиническую диагностику.',
  questions,
};

const responseScores: Record<number, Record<string, number>> = {
  1: { '1': 0, '2': 2, '3': 3, '4': 4, '5': 5 },
  2: { '1': 0, '2': 1, '3': 2, '4': 4, '5': 5 },
  3: { '1': 0, '2': 3, '3': 4, '4': 5, '5': 6 },
  4: { '1': 0, '2': 0, '3': 1, '4': 1, '5': 2 },
  5: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 },
  6: { '1': 0, '2': 1, '3': 2, '4': 2, '5': 3 },
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 6,
  scales: [{
    key: 'asrs5_total',
    label: 'Суммарный скрининговый балл ASRS-5',
    items: [1, 2, 3, 4, 5, 6],
    reverseItems: [],
    itemScores: responseScores,
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы «Никогда» дают нулевой балл',
    answers: { '1': '1', '2': '1', '3': '1', '4': '1', '5': '1', '6': '1' },
    expected: { asrs5_total: 0 },
  },
  {
    title: 'Ручная проверка: ответы «Очень часто» дают сумму весов 25',
    answers: { '1': '5', '2': '5', '3': '5', '4': '5', '5': '5', '6': '5' },
    expected: { asrs5_total: 25 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'who-asrs-5-ustun-et-al-2017-risk-slim-v1',
};
