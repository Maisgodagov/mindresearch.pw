import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '0', label: 'Неверно' },
  { value: '1', label: 'Отчасти верно' },
  { value: '2', label: 'Верно' },
];

const statements = [
  'Неугомонный/ая, слишком активный/ая, не может долго оставаться спокойным/ой',
  'Часто жалуется на головные боли, боли в животе, тошноту',
  'Часто испытывает состояние сильного раздражения, гнев',
  'Обычно послушен/на, подчиняется требованиям взрослых',
  'Часто выглядит беспокойным/ой, озабоченным/ой',
  'Постоянно ерзает и вертится',
  'Часто дерется с другими детьми или задирает их',
  'Часто чувствует себя несчастным/ой, грустит, готов/а расплакаться',
  'Легко отвлекается, внимание рассеянное',
  'В новой обстановке нервозен/на, надоедлив/а, легко теряет уверенность',
  'Часто врет, обманывает',
  'Хорошенько подумает, прежде чем действовать',
  'Крадет вещи из дома, из школы, из других мест',
  'Характерны страхи, легко пугается',
  'Выполняет задания от начала до конца, внимателен/на и сосредоточен/а',
];

export const instrument: SeedSection = {
  code: 'test_1510',
  title: 'Карта наблюдения «Психологические трудности»',
  description: 'Карта педагогического наблюдения оценивает выраженность психологических трудностей ребёнка: гиперактивность и невнимательность, эмоциональные проблемы и проблемы с поведением. Профиль из трёх областей и общий показатель помогают автору опроса выявить направления, требующие внимания и психологической поддержки. Русская 15-пунктовая адаптация Хухлаева и коллег предназначена прежде всего для оценки детей-иностранных граждан школьного возраста педагогом, знакомым с поведением ребёнка.',
  questions: statements.map((text, index) => ({
    code: `test_1510_${index + 1}`,
    text,
    type: 'single',
    required: false,
    options: answerOptions,
  })),
};

const scale = (key: string, label: string, items: number[], reverseItems: number[] = []) => ({
  key, label, items, reverseItems, aggregation: 'sum' as const,
});

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 2,
  scales: [
    scale('emotional_problems', 'Эмоциональные проблемы', [2, 5, 8, 10, 14]),
    scale('behavioral_problems', 'Проблемы с поведением', [3, 4, 7, 11, 13], [4]),
    scale('hyperactivity', 'Гиперактивность', [1, 6, 9, 12, 15], [12, 15]),
    scale('total_difficulties', 'Общий балл психологических трудностей', [2, 5, 8, 10, 14, 3, 4, 7, 11, 13, 1, 6, 9, 12, 15], [4, 12, 15]),
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Неверно»: проверка обратного кодирования и нулевых сумм',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 0])),
    expected: { emotional_problems: 0, behavioral_problems: 2, hyperactivity: 4, total_difficulties: 6 },
  },
  {
    title: 'Все ответы «Верно»: проверка максимума шкал',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 2])),
    expected: { emotional_problems: 10, behavioral_problems: 8, hyperactivity: 6, total_difficulties: 24 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'khukhlaev-psychological-difficulties-observation-2022-v1',
};
