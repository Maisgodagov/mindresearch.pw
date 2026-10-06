import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
];

const itemTexts = [
  'Я очень сильно боюсь умереть.',
  'Мысли о смерти редко приходят мне в голову.',
  'Меня не нервирует, когда люди говорят о смерти.',
  'Я боюсь думать о том, что мне может потребоваться хирургическая операция.',
  'Я совсем не боюсь умереть.',
  'Я не очень-то боюсь заболеть раком.',
  'Мысли о смерти никогда не посещали меня.',
  'Я часто расстраиваюсь от того, что время летит так быстро.',
  'Я боюсь умереть мучительной смертью.',
  'Тема жизни после смерти сильно волнует меня.',
  'Я по-настоящему боюсь, что со мной может произойти сердечный приступ.',
  'Я часто думаю о том, как в действительности коротка жизнь.',
  'Я вздрагиваю, когда слышу разговор о третьей мировой войне.',
  'Вид мертвого тела страшит меня.',
  'Я считаю, что в будущем у меня не может быть ничего такого, чего я мог бы бояться.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2469_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2469',
  title: 'Шкала тревожности по поводу смерти (DAS), русскоязычная адаптация Т. А. Гавриловой',
  description: 'Пятнадцатипунктная шкала оценивает общую выраженность тревоги и страха, связанных со смертью и умиранием. Пункты охватывают страх собственной смерти и болезненной смерти, тревогу по поводу болезни и операции, восприятие быстротечности жизни, представления о жизни после смерти и реакции на образы смерти и угрозы. Эта версия — русскоязычная адаптация Т. А. Гавриловой (2001) для самоотчёта; суммарный балл полезен автору опроса как общий показатель переживаний по поводу смерти, без диагностических выводов.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [{
    key: 'total',
    label: 'Общая тревожность по поводу смерти',
    items: Array.from({ length: 15 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
    itemScores: {
      1: { yes: 1, no: 0 },
      2: { yes: 0, no: 1 },
      3: { yes: 0, no: 1 },
      4: { yes: 1, no: 0 },
      5: { yes: 0, no: 1 },
      6: { yes: 0, no: 1 },
      7: { yes: 0, no: 1 },
      8: { yes: 1, no: 0 },
      9: { yes: 1, no: 0 },
      10: { yes: 1, no: 0 },
      11: { yes: 1, no: 0 },
      12: { yes: 1, no: 0 },
      13: { yes: 1, no: 0 },
      14: { yes: 1, no: 0 },
      15: { yes: 0, no: 1 },
    },
  }],
};

const allYes = Object.fromEntries(Array.from({ length: 15 }, (_, index) => [String(index + 1), 'yes']));
const allNo = Object.fromEntries(Array.from({ length: 15 }, (_, index) => [String(index + 1), 'no']));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Да»: ключевые пункты дают 9 баллов', answers: allYes, expected: { total: 9 } },
  { title: 'Все ответы «Нет»: обратные пункты дают 6 баллов', answers: allNo, expected: { total: 6 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['meaning-concerns'],
  scoringConfig,
  validationCases,
  formulaVersion: 'templer-das-gavrilova-ru-15item-keyed-sum-v1',
};
