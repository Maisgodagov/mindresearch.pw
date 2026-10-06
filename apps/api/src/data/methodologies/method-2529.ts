import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Да' },
  { value: '2', label: 'Скорее да, чем нет' },
  { value: '3', label: 'Скорее нет, чем да' },
  { value: '4', label: 'Нет' },
];

const items = [
  'Нравится ли тебе учиться в школе?',
  'Считаешь ли ты, что учеба в школе пригодится тебе в будущем?',
  'Есть ли школьные предметы, по которым тебе особенно трудно учиться?',
  'Есть предметы, которые ты настолько запустил, что самому тебе уже не наверстать упущенное?',
  'Хорошие ли у тебя отношения с учителями в целом?',
  'Хорошие ли у тебя отношения с классным руководителем?',
  'Часто ли у тебя возникают конфликты с родителями из-за учебы?',
  'Часто ли учителя жалуются на тебя родителям?',
  'Часто ли ты пропускаешь школьные занятия без уважительных причин (прогуливаешь)?',
  'Связаны ли твои прогулы с теми или иными проблемами в школе?',
  'Нравится ли тебе принимать участие в классных мероприятиях?',
  'Есть ли среди учителей кто-то, с кем тебе и твоим одноклассникам нравится проводить свободное время и внеклассные мероприятия?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2547_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2547',
  title: 'Школьная ситуация (краткая версия, 2025)',
  description: 'Краткая версия опросника оценивает благополучие школьной ситуации учащихся 7–18 лет по шести аспектам: отношение к учебе и предметам, хронические трудности в учебе, отношения с учителями, отношение родителей к учебе и школе, прогулы и досуг в классе. Результаты помогают автору опроса увидеть области школьной среды, в которых учащемуся может требоваться внимание и социально-психологическая поддержка.',
  categoryIds: ['learning-school'],
  questions,
};

const reverseItems = [3, 4, 7, 8, 9, 10];
export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'study_attitude', label: 'Отношение к учебе и учебным предметам', items: [1, 2], reverseItems: [], aggregation: 'sum' },
    { key: 'learning_difficulties', label: 'Отсутствие хронических трудностей в учебе', items: [3, 4], reverseItems: [3, 4], aggregation: 'sum' },
    { key: 'teachers', label: 'Учителя', items: [5, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'parents_attitude', label: 'Отношение родителей к учебе и школе', items: [7, 8], reverseItems: [7, 8], aggregation: 'sum' },
    { key: 'absence', label: 'Отсутствие прогулов', items: [9, 10], reverseItems: [9, 10], aggregation: 'sum' },
    { key: 'leisure', label: 'Досуг', items: [11, 12], reverseItems: [], aggregation: 'sum' },
  ],
};

const answerSet = (value: string) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: прямые ответы «Да» и обратные «Нет» дают максимум', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), reverseItems.includes(index + 1) ? '4' : '1'])), expected: { study_attitude: 8, learning_difficulties: 8, teachers: 8, parents_attitude: 8, absence: 8, leisure: 8 } },
  { title: 'Ручная проверка: прямые ответы «Нет» и обратные «Да» дают минимум', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), reverseItems.includes(index + 1) ? '1' : '4'])), expected: { study_attitude: 2, learning_difficulties: 2, teachers: 2, parents_attitude: 2, absence: 2, leisure: 2 } },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ['learning-school'],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'school-situation-short-ru-2025-v1',
};
