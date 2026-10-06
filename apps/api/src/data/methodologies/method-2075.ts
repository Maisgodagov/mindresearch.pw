import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = Array.from({ length: 8 }, (_, value) => ({
  value: String(value),
  label: value === 0 ? 'Вообще не способен' : value === 7 ? 'Максимально способен' : String(value),
}));

const items = [
  'Поддерживаю распорядок дня и работы постоянным настолько, насколько это возможно',
  'Утешаю других людей',
  'Стараюсь найти что-то хорошее в ситуации',
  'Фокусируюсь на текущих целях и планах',
  'Ищу занятия, которые помогут мне выбросить произошедшее из головы',
  'Позволяю себе полностью прочувствовать некоторые болезненные эмоции, связанные с этим событием',
  'Провожу время в одиночестве',
  'Я бы смог рассмеяться',
  'Стараюсь уменьшить болезненные переживания',
  'Сокращаю привычные социальные обязанности',
  'Изменяю распорядок дня',
  'Обдумываю смысл произошедшего',
  'Отвлекаюсь, чтобы не думать о произошедшем',
  'Смиряюсь с мрачной реальностью',
  'Наслаждаюсь тем, что обычно кажется мне смешным или забавным',
  'Фокусируюсь на потребностях других людей или заботе о них',
  'Напоминаю себе, что все наладится',
  'Сохраняю спокойствие, несмотря на гнетущие мысли',
  'Вспоминаю подробности произошедшего',
  'Прислушиваюсь к мучительным чувствам, вызванным произошедшим',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2089_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2089',
  title: 'Шкала воспринимаемой способности справиться с травмой (PACT), русская адаптация',
  description: 'Методика оценивает субъективную способность взрослых справляться с последствиями потенциально травмирующего события. Охватывает переработку травматического опыта и эмоций (фокус на травме), а также восстановление повседневной активности, оптимизма и ориентации на будущее (фокус на будущем); подходит для исследовательского и консультативного применения русской версии у взрослых, переживших потенциально травмирующее событие.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 7,
  scales: [
    { key: 'forwardFocus', label: 'Фокус на будущем', items: [1, 2, 3, 4, 5, 8, 9, 13, 15, 16, 17, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'traumaFocus', label: 'Фокус на травме', items: [6, 7, 10, 11, 12, 14, 19, 20], reverseItems: [], aggregation: 'mean' },
    { key: 'flexibility', label: 'Гибкость (простой способ)', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], reverseItems: [], aggregation: 'formula', formula: 'FF + TF - abs(FF - TF)' },
  ],
};

const uniformAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы 0: обе средние и гибкость равны нулю', answers: uniformAnswers(0), expected: { forwardFocus: 0, traumaFocus: 0, flexibility: 0 } },
  { title: 'Все ответы 7: обе средние равны 7, гибкость равна 14', answers: uniformAnswers(7), expected: { forwardFocus: 7, traumaFocus: 7, flexibility: 14 } },
  { title: 'Вручную проверенный случай: FF=4, TF=2, гибкость=4', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [6, 7, 10, 11, 12, 14, 19, 20].includes(index + 1) ? 2 : 4])), expected: { forwardFocus: 4, traumaFocus: 2, flexibility: 4 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pact-shmarina-chernov-kostyuk-2025-ru-simple-flexibility-v1',
};
