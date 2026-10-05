import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const frequencyOptions = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Раз в месяц и реже' },
  { value: '2', label: '2–3 раза в месяц' },
  { value: '3', label: '2–3 раза в неделю' },
  { value: '4', label: '4 раза в неделю или чаще' },
];

const recentFrequencyOptions = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Реже одного раза в месяц' },
  { value: '2', label: 'Каждый месяц' },
  { value: '3', label: 'Каждую неделю' },
  { value: '4', label: 'Ежедневно или почти каждый день' },
];

const amountOptions = [
  { value: '0', label: '0' },
  { value: '1', label: '1–2' },
  { value: '2', label: '3–4' },
  { value: '3', label: '5–6' },
  { value: '4', label: '7 или больше' },
];

const yesNoRecentOptions = [
  { value: '0', label: 'Нет' },
  { value: '2', label: 'Да, но не за прошедший год' },
  { value: '4', label: 'Да, за прошедший год' },
];

const questions: SeedSection['questions'] = [
  { code: 'test_1725_1', text: 'Как часто Вы употребляете наркотики, кроме алкоголя? (См. список наркотиков ниже.)', type: 'single', required: true, options: frequencyOptions },
  { code: 'test_1725_2', text: 'Вы используете более одного вида наркотиков за один раз?', type: 'single', required: true, options: recentFrequencyOptions },
  { code: 'test_1725_3', text: 'Сколько раз Вы обычно принимаете наркотики в день, когда употребляете наркотики?', type: 'single', required: true, options: amountOptions },
  { code: 'test_1725_4', text: 'Как часто Вы испытываете сильное воздействие наркотиков?', type: 'single', required: true, options: recentFrequencyOptions },
  { code: 'test_1725_5', text: 'За прошедший год испытывали ли Вы такую сильную тягу к наркотикам, что не могли ей сопротивляться?', type: 'single', required: true, options: recentFrequencyOptions },
  { code: 'test_1725_6', text: 'Случалось ли за прошедший год, что Вы не могли остановиться после того, как начали употреблять наркотики?', type: 'single', required: true, options: recentFrequencyOptions },
  { code: 'test_1725_7', text: 'Как часто за прошедший год Вы употребляли наркотики и после этого забывали сделать то, что должны были сделать?', type: 'single', required: true, options: recentFrequencyOptions },
  { code: 'test_1725_8', text: 'Как часто за прошедший год Вам приходилось принимать наркотик утром после интенсивного употребления наркотиков накануне?', type: 'single', required: true, options: recentFrequencyOptions },
  { code: 'test_1725_9', text: 'Как часто за прошедший год Вы испытывали чувство вины или угрызения совести из-за употребления наркотиков?', type: 'single', required: true, options: recentFrequencyOptions },
  { code: 'test_1725_10', text: 'Испытывали ли Вы или кто-либо ещё физический или психологический вред из-за употребления Вами наркотиков?', type: 'single', required: true, options: yesNoRecentOptions },
  { code: 'test_1725_11', text: 'Беспокоились ли родственники, друзья, врач, медсестра или кто-либо ещё из-за употребления Вами наркотиков или говорили Вам, что следует прекратить их употребление?', type: 'single', required: true, options: yesNoRecentOptions },
];

export const instrument: SeedSection = {
  code: 'test_1725',
  title: 'Тест выявления расстройств, связанных с употреблением наркотиков (DUDIT)',
  description: 'Скрининговая методика выявляет частоту и интенсивность употребления наркотиков (кроме алкоголя), признаки утраты контроля, тягу, последствия и обеспокоенность окружающих за последний год. Подходит для взрослых респондентов в клинических, консультативных и исследовательских опросах; результат отражает выраженность связанных с употреблением проблем и не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'total', label: 'Суммарный балл DUDIT', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries([
      ...Array.from({ length: 9 }, (_, index) => [index + 1, { '0': 0, '1': 1, '2': 2, '3': 3, '4': 4 }] as const),
      [10, { '0': 0, '2': 2, '4': 4 }],
      [11, { '0': 0, '2': 2, '4': 4 }],
    ]) },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы с минимальным баллом', answers: Object.fromEntries(questions.map((_, index) => [String(index + 1), '0'])), expected: { total: 0 } },
  { title: 'Максимум по всем пунктам', answers: Object.fromEntries(questions.map((_, index) => [String(index + 1), index < 9 ? '4' : '4'])), expected: { total: 44 } },
  { title: 'Проверка шкалы 0, 2, 4 для пунктов 10 и 11', answers: { '1': '0', '2': '0', '3': '0', '4': '0', '5': '0', '6': '0', '7': '0', '8': '0', '9': '0', '10': '2', '11': '4' }, expected: { total: 6 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'dudit-ru-euda-v1.0-scoring-v1',
};
