import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Неверно' },
  { value: '1', label: 'Отчасти верно' },
  { value: '2', label: 'Верно' },
];

const items = [
  'Я стараюсь быть доброжелательным к другим людям.',
  'Я непоседлив, не могу долго оставаться спокойным.',
  'У меня часто бывают головные боли, боли в животе или тошнота.',
  'Я обычно делюсь с другими (едой, играми, ручками).',
  'Я сильно сержусь, раздражаюсь и злюсь.',
  'Я обычно один. Большую часть времени играю и занимаюсь сам по себе.',
  'Я обычно делаю то, что мне говорят.',
  'Я много волнуюсь.',
  'Я стараюсь помочь, если кто-то расстроен, обижен или болен.',
  'Я постоянно ёрзаю и не могу усидеть на месте.',
  'У меня есть хотя бы один хороший друг или подруга.',
  'Я часто дерусь. Я могу заставить других людей делать то, что я хочу.',
  'Я часто чувствую себя несчастным, подавленным, готовым расплакаться.',
  'Сверстники обычно меня любят.',
  'Я легко отвлекаюсь, мне трудно сосредоточиться.',
  'Я нервничаю в новой обстановке, легко теряю уверенность в себе.',
  'Я добр к младшим детям.',
  'Меня часто обвиняют во лжи или обмане.',
  'Другие часто дразнят меня или задирают.',
  'Я часто вызываюсь помочь другим (родителям, учителям, детям).',
  'Я думаю, прежде чем что-то сделать.',
  'Я беру чужие вещи дома, в школе и в других местах.',
  'У меня лучше складываются отношения со взрослыми, чем со сверстниками.',
  'Я многого боюсь, меня легко напугать.',
  'Я довожу до конца начатое дело. У меня хорошее внимание.',
];

const reverseItems = [7, 11, 14, 21, 25];
const allItems = Array.from({ length: 25 }, (_, index) => index + 1);
const scale = (key: string, label: string, itemNumbers: number[], reversed: number[] = []) => ({
  key, label, items: itemNumbers, reverseItems: reversed, aggregation: 'sum' as const,
});

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1599_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1599',
  title: 'Сильные стороны и трудности (SDQ), самоопросник 11–17 лет',
  description: 'Стандартный самоотчётный SDQ оценивает эмоциональные симптомы, проблемы с поведением, гиперактивность и невнимательность, трудности отношений со сверстниками и просоциальное поведение у подростков 11–17 лет. Пять профильных баллов помогают описать сильные стороны и области возможных трудностей; четыре проблемные шкалы также образуют общий балл трудностей для скрининговой оценки.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 2,
  scales: [
    scale('emotional', 'Эмоциональные симптомы', [3, 8, 13, 16, 24]),
    scale('conduct', 'Проблемы с поведением', [5, 7, 12, 18, 22]),
    scale('hyperactivity', 'Гиперактивность/невнимательность', [2, 10, 15, 21, 25], [21, 25]),
    scale('peer', 'Проблемы со сверстниками', [6, 11, 14, 19, 23], [11, 14]),
    scale('prosocial', 'Просоциальное поведение', [1, 4, 9, 17, 20]),
    scale('total', 'Общее число проблем', [3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], [7, 11, 14, 21, 25]),
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка ключа: ответы «Отчасти верно» по всем пунктам',
    answers: Object.fromEntries(allItems.map((item) => [String(item), 1])),
    expected: { emotional: 5, conduct: 5, hyperactivity: 5, peer: 5, prosocial: 5, total: 20 },
  },
  {
    title: 'Ручная проверка реверсирования: все утверждения «Верно»',
    answers: Object.fromEntries(allItems.map((item) => [String(item), 2])),
    expected: { emotional: 10, conduct: 6, hyperactivity: 6, peer: 6, prosocial: 10, total: 24 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sdq-self-report-11-17-russian-goodman-slobodskaya-v1',
};
