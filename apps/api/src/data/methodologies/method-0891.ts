import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем нет' },
  { value: '1', label: 'В течение нескольких дней' },
  { value: '2', label: 'Более чем половину этого времени' },
  { value: '3', label: 'Почти каждый день' },
];

const statements = [
  'Снижение интереса и удовольствия от привычных дел',
  'Чувство подавленности или безнадежности',
  'Проблемы со сном (неспособность заснуть, раннее пробуждение или слишком долгий сон)',
  'Чувство усталости или недостатка энергии',
  'Плохой аппетит или переедание',
  'Плохое мнение о себе или чувство, что не смог оправдать ожиданий моей семьи',
  'Проблемы с концентрацией внимания (например, при чтении газеты или просмотре телевизионной передачи)',
  'Замедленность движений или речи, которая стала заметна другим людям, или, напротив, суетливость, когда движения и речь стали более быстрыми и беспокойными',
  'Мысли о том, что мне бы хотелось умереть или причинить себе боль',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_921_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_921',
  title: 'Опросник здоровья пациента PHQ-9 (русскоязычная версия А. А. Золотарёвой)',
  description: 'PHQ-9 оценивает выраженность депрессивной симптоматики за последние две недели: снижение интереса и удовольствия, подавленность, нарушения сна, энергии, аппетита, самооценки, концентрации, психомоторные изменения и мысли о смерти или самоповреждении. Краткий скрининговый инструмент для взрослых; общий балл помогает оценить выраженность симптомов и определить необходимость дальнейшей клинической оценки, но сам по себе не устанавливает диагноз.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'depressive_symptoms', label: 'Общая выраженность депрессивных симптомов', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «совсем нет»: сумма равна 0',
    answers: Object.fromEntries(Array.from({ length: 9 }, (_, index) => [String(index + 1), 0])),
    expected: { depressive_symptoms: 0 },
  },
  {
    title: 'Ручная проверка: ответы 0–3 по порядку дают сумму 13',
    answers: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 0, '6': 1, '7': 2, '8': 3, '9': 1 },
    expected: { depressive_symptoms: 13 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'phq9-zolotareva-2023-sum-v1',
};
