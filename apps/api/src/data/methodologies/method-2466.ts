import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не соответствует' },
  { value: '2', label: 'По большей части не соответствует' },
  { value: '3', label: 'По большей части соответствует' },
  { value: '4', label: 'Полностью соответствует' },
];

const items = [
  'Я умею находить баланс между работой и отдыхом.',
  'Я достаточно хорошо адаптируюсь к изменениям.',
  'Я получаю уважение и признание от других людей.',
  'Я регулярно занимаюсь полезной физической активностью.',
  'У меня хорошие отношения в семье.',
  'Я достаточно времени нахожусь на свежем воздухе.',
  'Я удовлетворен своей жизнью.',
  'Я не испытываю дефицит общения с другими людьми.',
  'Я чувствую себя частью сообщества/коллектива.',
  'Я чувствую поддержку и заботу от других людей.',
  'У меня регулярное и полноценное питание.',
  'Я чувствую себя в безопасности в своей повседневной жизни.',
  'Окружающие люди учитывают мое мнение.',
  'Я могу свободно выражать себя.',
  'Окружающие люди хорошо ко мне относятся.',
  'Мои финансовые возможности позволяют удовлетворять основные биологические потребности.',
  'У меня есть контроль над собственной жизнью и своими решениями.',
  'У меня есть мотивы для личного и профессионального роста.',
  'Я умею находить радость и наслаждение в повседневной жизни.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2484_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2484',
  title: 'Шкала удовлетворенности потребностей (ШУП)',
  description: 'Шкала оценивает удовлетворенность потребностей в биологической, психологической и социальной областях, а также общий показатель. Она охватывает отдых и физическое благополучие, безопасность, адаптацию, самовыражение и рост, отношения, принятие, поддержку и принадлежность. Разработана для взрослых; исходная проверка итоговой версии проводилась на участниках 18–60 лет. Показатели помогают автору опроса выявить области удовлетворенных и фрустрированных потребностей для исследования и предварительной диагностической оценки.',
  categoryIds: ['meaning-existential'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'biological', label: 'Биологические потребности', items: [1, 4, 6, 11, 12, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'psychological', label: 'Психологические потребности', items: [2, 7, 14, 17, 18, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'social', label: 'Социальные потребности', items: [3, 5, 8, 9, 10, 13, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общая удовлетворенность потребностей', items: Array.from({ length: 19 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const constantAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: минимальные ответы дают минимальные суммы по ключу', answers: constantAnswers(1), expected: { biological: 6, psychological: 6, social: 7, total: 19 } },
  { title: 'Ручная проверка: максимальные ответы дают максимальные суммы по ключу', answers: constantAnswers(4), expected: { biological: 24, psychological: 24, social: 28, total: 76 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'shup-kovpak-zryutin-murtazin-granitsa-2025-v1',
};
