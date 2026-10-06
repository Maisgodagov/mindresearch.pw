import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Я хочу вырасти, потому что тогда мне будет легче жить.',
  'Я мог бы сдаться, потому что я не могу изменить что-либо в моей жизни к лучшему.',
  'Даже когда всё совсем плохо, я знаю, что так будет не всегда.',
  'Я хорошо представляю себе свою жизнь через десять лет.',
  'У меня достаточно времени, чтобы закончить те дела, которые я действительно хочу совершить.',
  'Когда-нибудь я смогу действительно хорошо делать то, что меня на самом деле интересует.',
  'У меня будет больше хорошего в жизни, чем у большинства моих сверстников.',
  'Я не особо удачлив и не думаю, что что-то изменится к лучшему, когда я вырасту.',
  'Всё, что я могу представить в своём будущем, плохо.',
  'Не думаю, что у меня будет то, чего я действительно хочу.',
  'Я думаю, что, когда я вырасту, я буду счастливее, чем сейчас.',
  'Всё будет не так, как я хочу.',
  'Я никогда не получаю то, чего хочу, поэтому нет смысла чего-то хотеть.',
  'Не думаю, что меня ждёт что-то хорошее, когда я вырасту.',
  'Будущее кажется мне неясным и запутанным.',
  'В будущем меня ждёт больше хорошего, чем плохого.',
  'Нет смысла предпринимать серьёзные попытки добиться того, чего я хочу, потому что скорее всего ничего не получится.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2073_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: yesNo,
}));

export const instrument: SeedSection = {
  code: 'test_2073',
  title: 'Шкала безнадёжности для детей (HSC)',
  description: 'Детский вариант шкалы безнадёжности оценивает негативные ожидания относительно будущего и снижение мотивации. Пункты охватывают представления о будущем, жизненных перспективах и возможности достигать желаемого. Русская версия опубликована для скрининговых исследований подростков; адаптация проверялась на учащихся 12–18 лет. Результат служит дополнительной информацией для специалиста и сам по себе не является диагнозом или прогнозом суицидального поведения.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    {
      key: 'hopelessness',
      label: 'Безнадёжность (суммарный балл)',
      items: Array.from({ length: 17 }, (_, index) => index + 1),
      reverseItems: [1, 3, 4, 5, 6, 7, 11, 16],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Да»; положительные ожидания не дают баллов безнадёжности',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '1'])),
    expected: { hopelessness: 9 },
  },
  {
    title: 'Все ответы «Нет»; обратные пункты дают баллы безнадёжности',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '0'])),
    expected: { hopelessness: 8 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'hsc-kazdin-russian-adaptation-kagan-2020-key-phenx-v1',
};
