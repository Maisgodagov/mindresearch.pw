import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Время от времени' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда' },
];

const prompts = [
  'огорчение по поводу вашей сексуальной жизни?',
  'недовольство вашими сексуальными отношениями?',
  'вину из-за сексуальных трудностей?',
  'разочарование из-за сексуальных проблем?',
  'стресс по причинам, связанным с сексом?',
  'свою неполноценность из-за сексуальных проблем?',
  'беспокойство по поводу секса?',
  'свою сексуальную неадекватность?',
  'сожаления по поводу своей сексуальности?',
  'стыд по поводу своих сексуальных проблем?',
  'неудовлетворенность своей сексуальной жизнью?',
  'гнев из-за своей сексуальной жизни?',
  'беспокойство из-за низкого сексуального влечения?',
];

const questions: SeedSection['questions'] = prompts.map((prompt, index) => ({
  code: `test_2144_${index + 1}`,
  text: `Как часто вы чувствовали ${prompt}`,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2144',
  title: 'Шкала женской сексуальной дисфункции — пересмотренная версия (FSDS-R)',
  description: 'FSDS-R оценивает личный дистресс, связанный с сексуальной жизнью и функционированием у взрослых женщин: огорчение, неудовлетворённость, вину, стресс, тревогу, стыд и переживания из-за низкого сексуального влечения. Подходит для скринингового и исследовательского описания сексуально связанного дистресса; показатель не является самостоятельным диагнозом.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{
    key: 'sexual_distress',
    label: 'Сексуально связанный личный дистресс',
    items: Array.from({ length: 13 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 0, 1, 2, 3, 4 повторяются; сумма равна 24',
    answers: Object.fromEntries(Array.from({ length: 13 }, (_, index) => [String(index + 1), index % 5])),
    expected: { sexual_distress: 24 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'fsds-r-derogatis-2008-psytests-ru-0-to-4-total-sum-v1',
};
