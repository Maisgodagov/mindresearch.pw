import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: '(Почти) никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Регулярно' },
  { value: '4', label: 'Часто' },
  { value: '5', label: '(Почти) всегда' },
];

const items = [
  'Я прислушиваюсь к тому, что мне говорят коллеги о моей работе',
  'Я готов попробовать что-то изменить, чтобы улучшить мои достижения',
  'По окончании работы, не принесшей успеха, я стараюсь поскорее забыть про нее',
  'Я стараюсь внимательно относиться к тем замечаниям, которые мне делают более опытные товарищи',
  'Я обсуждаю с моим руководителем (преподавателем) причины успехов и неудач в моей деятельности',
  'Если даже результаты меня разочаровывают, я все же не спешу что-то менять',
  'Я регулярно думаю о том, что поможет мне улучшить мои достижения',
  'Когда я добиваюсь успеха, я не очень задумываюсь о его причинах',
  'После неудачи мне важно проделать «работу над ошибками»',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2508_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2508',
  title: 'Шкала чувствительности к обратной связи (ЧОС)',
  description: 'Одномерная шкала оценивает, насколько человек замечает обратную связь об успешности собственных действий, обдумывает причины успехов и неудач и корректирует дальнейшую активность. Пункты охватывают внимание к замечаниям коллег и более опытных людей, обсуждение результатов, готовность менять действия и анализировать ошибки. Окончательная девятипунктовая русская версия опубликована Леонтьевым, Моспан и Митиной и апробирована на выборках студентов; результаты для других групп следует интерпретировать с учётом этого контекста.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'feedback_sensitivity', label: 'Чувствительность к обратной связи', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [3, 6, 8], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1 на прямых и 5 на обратных пунктах после реверса дают среднее 1',
    answers: { '1': 1, '2': 1, '3': 5, '4': 1, '5': 1, '6': 5, '7': 1, '8': 5, '9': 1 },
    expected: { feedback_sensitivity: 1 },
  },
  {
    title: 'Ручная проверка: все средние ответы дают среднее 3 независимо от реверса',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { feedback_sensitivity: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-regulation'],
  scoringConfig,
  validationCases,
  formulaVersion: 'leontiev-mospan-mitina-feedback-sensitivity-9item-mean-reverse-3-6-8-v1',
};
