import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

// The Russian PsyTests blank preserves the original six-item forced-choice order:
// structural, human-resource, political, symbolic (confirmed by Lee Bolman's instructions).
const options = [
  { value: '4', label: 'максимально для меня характерно' },
  { value: '3', label: 'характерно для меня' },
  { value: '2', label: 'не характерно для меня' },
  { value: '1', label: 'совсем не характерно для меня' },
];

const itemTexts = [
  'Моей сильной стороной является:',
  'Лучший способ описать меня:',
  'Добиваться успеха мне помогает способность:',
  'Люди отмечают во мне:',
  'Моя самая главная лидерская черта:',
  'Одним словом меня можно назвать как:',
];

const frameLabels = ['Рациональная', 'Гуманистическая', 'Политическая', 'Вдохновляющая'];
const answerLabels = [
  ['аналитические способности', 'коммуникативные навыки', 'управленческие способности', 'артистические способности'],
  ['технический эксперт', 'хороший слушатель', 'умелый посредник', 'вдохновляющий лидер'],
  ['принимать верные решения', 'направлять и помогать развиваться другим людям', 'умение заключать союзы с целью накопления власти', 'вдохновлять и побуждать к действиям других людей'],
  ['внимательность к мелочам', 'интерес и внимание к другим людям', 'умение легко находить выход из сложных ситуаций, преодолевать препятствия', 'харизма'],
  ['умение мыслить структурно', 'забота и помощь окружающим', 'жесткость и несгибаемость', 'воображение и креативность'],
  ['аналитик', 'гуманист', 'политик', 'провидец'],
];

const questions: SeedSection['questions'] = answerLabels.flatMap((labels, promptIndex) => labels.map((label, frameIndex) => ({
  code: `test_572_${promptIndex * 4 + frameIndex + 1}`,
  text: `${itemTexts[promptIndex]} ${label}`,
  type: 'single',
  required: true,
  options,
})));

export const instrument: SeedSection = {
  code: 'test_572',
  title: 'Методика диагностики лидерских ориентаций',
  description: 'Краткая самооценочная методика описывает предпочитаемые лидерские ориентации в четырёх рамках Болмана и Дила: рациональной (структура, анализ и решения), гуманистической (люди и развитие), политической (влияние, союзы и преодоление препятствий) и вдохновляющей (видение, харизма и побуждение к действиям). Подходит для экспресс-обсуждения профиля лидера у взрослых, в том числе руководителей и участников организаций; это адаптированная шестипунктовая версия, а не полная версия авторского опросника.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: frameLabels.map((label, frameIndex) => ({
    key: ['rational', 'humanistic', 'political', 'inspiring'][frameIndex],
    label,
    items: Array.from({ length: 6 }, (_, promptIndex) => promptIndex * 4 + frameIndex + 1),
    reverseItems: [],
    weights: Object.fromEntries(Array.from({ length: 6 }, (_, promptIndex) => [promptIndex * 4 + frameIndex + 1, 1])),
    aggregation: 'sum' as const,
  })),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все 24 оценки равны 1: вручную проверенные минимумы шкал',
    answers: Object.fromEntries(Array.from({ length: 24 }, (_, index) => [String(index + 1), 1])),
    expected: { rational: 6, humanistic: 6, political: 6, inspiring: 6 },
  },
  {
    title: 'Первое задание: оценки 4, 3, 2, 1; остальные оценки равны 1',
    answers: Object.fromEntries(Array.from({ length: 24 }, (_, index) => [String(index + 1), index < 4 ? 4 - index : 1])),
    expected: { rational: 9, humanistic: 8, political: 7, inspiring: 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bolman-deal-leadership-orientations-survey-section-ii-smyslov-2013-psytests-ru-v1',
};
