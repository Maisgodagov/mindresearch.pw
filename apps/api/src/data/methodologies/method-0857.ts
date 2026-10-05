import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  'Я был(а) успешным(ой) в учебе',
  'Я был(а) вынужден(а) делать слишком много неинтересных вещей',
  'Я чувствовал(а) себя свободным(ой) и мог(ла) выбирать, что мне делать',
  'Я чувствовал(а), что мои учителя поддерживают меня',
  'Я чувствовал(а), что мне нравятся ребята в классе',
  'У меня все хорошо получалось',
  'Мне в основном приходилось делать то, что мне не нравится, но нужно делать',
  'Мы могли выбирать какие задания делать и что обсуждать',
  'Я чувствовал(а), что мои учителя дружелюбны и доброжелательны ко мне',
  'Чувствовал(а), что нравлюсь своим одноклассникам',
  'Я чувствовал(а) себя умным(ой) и успешным(ой)',
  'Я делал(а) то, что должен(на), а не то, что хотел(а) бы',
  'У меня было много возможностей делать то, что я хочу и считаю важным',
  'Я чувствовал(а), что мои учителя готовы мне помочь',
  'Я чувствовал(а) дружеское отношение одноклассников',
  'Я чувствовал(а), что вынужден(а) подчиняться внешним требованиям',
  'Я хорошо справлялся(лась) со всеми заданиями учителя',
];

const options = [
  { value: '1', label: 'Неверно (НЕТ)' },
  { value: '2', label: 'Скорее неверно' },
  { value: '3', label: 'Скорее верно' },
  { value: '4', label: 'Верно (ДА)' },
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_887_${index + 1}`,
  text: `${index === 0 ? 'Сегодня в школе… (вчера, если день только начался)\n' : ''}${text}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_887',
  title: 'Опросник базовых психологических потребностей в школе (ОБПП-Ш)',
  description: 'Опросник оценивает удовлетворённость потребностей школьников в автономии, компетентности и связанности с учителями и одноклассниками, а также фрустрацию автономии. Он помогает автору опроса изучать мотивацию и психологическое благополучие учащихся и то, насколько образовательная среда отвечает их потребностям; опубликованная версия предназначена для учащихся 5-х и 8-х классов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'autonomy_satisfaction', label: 'Автономия — удовлетворённость', items: [3, 8, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'autonomy_frustration', label: 'Автономия — фрустрация', items: [2, 7, 12, 16], reverseItems: [], aggregation: 'mean' },
    { key: 'competence', label: 'Компетентность', items: [1, 6, 11, 17], reverseItems: [], aggregation: 'mean' },
    { key: 'relatedness_teachers', label: 'Связанность — учителя', items: [4, 9, 14], reverseItems: [], aggregation: 'mean' },
    { key: 'relatedness_classmates', label: 'Связанность — одноклассники', items: [5, 10, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'basic_needs_satisfaction_total', label: 'Общая удовлетворённость базовых потребностей', items: [1, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 17], reverseItems: [], aggregation: 'mean' },
  ],
};

// Every answer is 4: means equal 4 for each keyed scale, manually checked against item membership.
export const validationCases: ValidationCase[] = [{
  title: 'Все ответы «Верно (ДА)»: средние по всем шкалам равны 4',
  answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 4])),
  expected: {
    autonomy_satisfaction: 4,
    autonomy_frustration: 4,
    competence: 4,
    relatedness_teachers: 4,
    relatedness_classmates: 4,
    basic_needs_satisfaction_total: 4,
  },
}];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'obpp-sh-gordeeva-sychev-2024-17-items-five-means-total-satisfaction-v1',
};
