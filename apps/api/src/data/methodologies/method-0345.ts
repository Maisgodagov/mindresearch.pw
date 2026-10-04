import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Некоторое время' },
  { value: '2', label: 'Менее половины времени' },
  { value: '3', label: 'Более половины времени' },
  { value: '4', label: 'Большую часть времени' },
  { value: '5', label: 'Все время' },
];

const items = [
  'Я чувствую себя бодрой(-ым) и в хорошем настроении',
  'Я чувствую себя спокойной(-ым) и раскованной(-ым).',
  'Я чувствую себя активной(-ым) и энергичной(-ым).',
  'Я просыпаюсь и чувствую себя свежей(-им) и отдохнувшей(-им).',
  'Каждый день со мной происходят вещи, представляющие для меня интерес.',
];

const questions: SeedSection['questions'] = [{
  code: 'test_376_1',
  text: 'Обведите одну из цифр против каждого из пяти нижеприведенных утверждений, ближе/лучше всего отражающую ваше самочувствие в последние две недели. Учтите, что более высокие баллы означают более хорошее самочувствие. В каждой строке выберите один ответ.',
  type: 'matrix',
  required: true,
  options,
  items: items.map((label, index) => ({ code: String(index + 1), label })),
}];

export const instrument: SeedSection = {
  code: 'test_376',
  title: 'Индекс общего (хорошего) самочувствия ВОЗ (WHO-5), вариант 1999 года',
  description: 'WHO-5 измеряет субъективное психическое благополучие за последние две недели по позитивному настроению, спокойствию и расслабленности, энергии, восстановлению после сна и интересу к повседневной жизни. Краткая шкала подходит для повторного мониторинга и скрининговых или исследовательских опросов взрослых; результат описывает благополучие и сам по себе не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 5,
  scales: [
    { key: 'raw_total', label: 'Сырой суммарный балл WHO-5', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
    { key: 'wellbeing_index', label: 'Индекс хорошего самочувствия WHO-5 (0–100)', items: [1, 2, 3, 4, 5], reverseItems: [], weights: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 }, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Вручную проверено по бланку ВОЗ: пять минимальных оценок дают сырой балл 0 и индекс 0', answers: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }, expected: { raw_total: 0, wellbeing_index: 0 } },
  { title: 'Вручную проверено по бланку ВОЗ: ответы 5, 4, 3, 2, 1 дают сумму 15 и индекс 60', answers: { '1': 5, '2': 4, '3': 3, '4': 2, '5': 1 }, expected: { raw_total: 15, wellbeing_index: 60 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'who-5-russian-1999-raw-sum-times-four-v1',
};
