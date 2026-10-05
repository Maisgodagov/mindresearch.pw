import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен, чем согласен' },
  { value: '4', label: 'Нейтральный ответ' },
  { value: '5', label: 'Скорее согласен, чем не согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const targets = [
  { label: 'матери', prompts: [
    'Обращение к маме в трудные минуты помогает мне',
    'Я обычно обсуждаю свои проблемы и тревоги с мамой',
    'Я обычно обсуждаю текущие дела и события с мамой',
    'Мне легко положиться на свою маму',
    'Мне нелегко доверять свои тайны маме',
    'Я предпочитаю не показывать маме как сильно я расстроен(а)',
    'Я часто беспокоюсь о том, что мама на самом деле не волнуется обо мне',
    'Я опасаюсь, что мама может бросить меня',
    'Я беспокоюсь, что мама не будет заботиться обо мне так, как я о ней',
  ] },
  { label: 'отцу', prompts: [
    'Обращение к папе в трудные минуты помогает мне',
    'Я обычно обсуждаю свои проблемы и тревоги с папой',
    'Я обычно обсуждаю текущие дела и события с папой',
    'Мне легко положиться на своего папу',
    'Мне нелегко доверять свои тайны папе',
    'Я предпочитаю не показывать папе как сильно я расстроен(а)',
    'Я часто беспокоюсь о том, что папа на самом деле не волнуется обо мне',
    'Я опасаюсь, что папа может бросить меня',
    'Я беспокоюсь, что папа не будет заботиться обо мне так, как я о нем',
  ] },
  { label: 'романтическому партнеру (мужу/жене)', prompts: [
    'Обращение к этому человеку в трудные минуты помогает мне',
    'Обычно я обсуждаю свои проблемы и тревоги с этим человеком',
    'Я обсуждаю свои дела с этим человеком',
    'Мне легко положиться на этого человека',
    'Мне нелегко доверять свои тайны этому человеку',
    'Я предпочитаю не показывать этому человеку как сильно я расстроен(а)',
    'Я часто беспокоюсь о том, что он/она на самом деле не волнуется обо мне',
    'Я боюсь быть покинутым(ой) этим человеком',
    'Я боюсь, что этот человек не будет заботиться обо мне так как я о нем',
  ] },
  { label: 'лучшему другу/подруге', prompts: [
    'Обращение за помощью к лучшему другу в трудные периоды очень помогает мне',
    'Обычно я обсуждаю свои проблемы и тревоги с лучшим другом',
    'Я обсуждаю свои дела с лучшим другом',
    'Мне легко положиться на лучшего друга',
    'Мне нелегко доверять свои тайны моему лучшему другу',
    'Я предпочитаю не показывать лучшему другу как сильно я расстроен(а)',
    'Я часто беспокоюсь о том, что мой лучший друг на самом деле не волнуется обо мне',
    'Я боюсь, что мой лучший друг покинет меня',
    'Я боюсь, что лучший друг не будет заботиться обо мне так как я о нем',
  ] },
];

const items = targets.flatMap(target => target.prompts);
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1354_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1354',
  title: 'Опыт близких отношений — структуры отношений (ECR-RS-Ru)',
  description: 'Русскоязычная версия ECR-RS-Ru оценивает особенности привязанности отдельно к матери, отцу, романтическому партнёру и лучшему другу. По каждой сфере она измеряет избегание психологической близости и беспокойство о надёжности отношений; сопоставление профилей помогает автору исследования увидеть, насколько переживания привязанности различаются в разных близких отношениях. Версия адаптирована для русскоязычных респондентов юношеского и молодого возраста.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: targets.flatMap((target, targetIndex) => {
    const offset = targetIndex * 9;
    const domain = ['mother', 'father', 'partner', 'friend'][targetIndex];
    return [
      { key: `${domain}_avoidance`, label: `Избегание привязанности к ${target.label}`, items: [1, 2, 3, 4, 5, 6].map(item => offset + item), reverseItems: [offset + 1, offset + 2, offset + 3, offset + 4], aggregation: 'mean' as const },
      { key: `${domain}_anxiety`, label: `Беспокойство о привязанности к ${target.label}`, items: [7, 8, 9].map(item => offset + item), reverseItems: [], aggregation: 'mean' as const },
    ];
  }),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка реверсирования и обеих шкал в каждой сфере',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [7, 6, 5, 4, 3, 2, 1, 2, 3][index % 9]])),
    expected: {
      mother_avoidance: 3, mother_anxiety: 2,
      father_avoidance: 3, father_anxiety: 2,
      partner_avoidance: 3, partner_anxiety: 2,
      friend_avoidance: 3, friend_anxiety: 2,
    },
  },
  {
    title: 'Все ответы 4 дают нейтральные значения по всем шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: {
      mother_avoidance: 4, mother_anxiety: 4,
      father_avoidance: 4, father_anxiety: 4,
      partner_avoidance: 4, partner_anxiety: 4,
      friend_avoidance: 4, friend_anxiety: 4,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ecr-rs-ru-sabelnikova-kashirsky-nefedova-2024-v1',
};




