import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Немного согласен' },
  { value: '3', label: 'Во многом согласен' },
  { value: '4', label: 'Абсолютно согласен' },
];

const prompts = [
  'Иногда я ошибался, оценивая отношение других людей ко мне.',
  'Я уверен, что правильно оцениваю то, что со мной происходит.',
  'Окружающие могут лучше понимать причины моих необычных переживаний, нежели я сам.',
  'Порой я слишком поспешно делал выводы из ситуации.',
  'Некоторые мои переживания, которые казались очень реальными, возможно, были плодом моего воображения.',
  'Некоторые идеи, в истинности которых я был уверен, оказались ложными.',
  'Если что-то ощущается истинным, значит, так оно и есть.',
  'Несмотря на то, что я твердо уверен в своей правоте, я могу ошибаться.',
  'Я лучше кого бы то ни было знаю, в чем заключаются мои проблемы.',
  'Когда люди не соглашаются со мной, они, как правило, неправы.',
  'Я не могу доверять мнению других людей о моих собственных переживаниях.',
  'Если кто-то укажет, что мои убеждения ошибочны, я готов это обдумать.',
  'Я всегда могу доверять своим суждениям.',
  'Часто есть более чем одно возможное объяснение, почему люди ведут себя так или иначе.',
  'Мои необычные переживания могут быть вызваны тем, что я очень расстроен или испытываю сильный стресс.',
];

const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_2177_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

const instrument: SeedSection = {
  code: 'test_2177',
  title: 'Шкала когнитивного инсайта Бека (BCIS), перевод psytests.org',
  description: '15-пунктовая шкала оценивает когнитивный инсайт — способность переоценивать собственные интерпретации и убеждения. Она охватывает саморефлексивность (открытость к альтернативным объяснениям и обратной связи) и самоуверенность в собственных суждениях. Предназначена для клинической оценки когнитивного инсайта; эта русская версия является переводом psytests.org по оригинальным материалам BCIS, а не опубликованной русской адаптацией Рассказовой и Плужникова.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'self_reflectiveness', label: 'Саморефлексивность (SR)', items: [1, 3, 4, 5, 6, 8, 12, 14, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'self_certainty', label: 'Самоуверенность (SC)', items: [2, 7, 9, 10, 11, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'cognitive_insight_index', label: 'Индекс когнитивного инсайта (SR−SC)', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], reverseItems: [], aggregation: 'formula', formula: 'self_reflectiveness - self_certainty' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: все ответы «Абсолютно не согласен» дают минимальные суммы подшкал и нулевой индекс',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, index) => [String(index + 1), '1'])),
    expected: { self_reflectiveness: 9, self_certainty: 6, cognitive_insight_index: 3 },
  },
  {
    title: 'Вручную проверено: все ответы «Абсолютно согласен» дают максимальные суммы подшкал и индекс 9',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, index) => [String(index + 1), '4'])),
    expected: { self_reflectiveness: 36, self_certainty: 24, cognitive_insight_index: 12 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'beck-bcis-2004-psytests-ru-sr-minus-sc-v1',
};
