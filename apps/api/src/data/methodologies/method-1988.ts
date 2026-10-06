import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'Почти не имеет значения' },
  { value: '2', label: 'Частично значимо' },
  { value: '3', label: 'Заметно значимо' },
  { value: '4', label: 'Очень значимо' },
];

const items = [
  'Чтобы я хорошо учил предмет, мне должен нравиться учитель.',
  'Мне очень нравится учиться, узнавать новое, расширять свои знания о мире.',
  'Общаться с друзьями, с компанией в школе гораздо интереснее, чем сидеть на уроках, учиться.',
  'Для меня совсем немаловажно получить хорошую оценку.',
  'Все, что я делаю, я делаю хорошо – это моя позиция.',
  'Знания помогают развить ум, сообразительность, смекалку.',
  'Если ты школьник, то обязан учиться хорошо.',
  'Если на уроке царит обстановка недоброжелательности, излишней строгости, и у меня пропадает всякое желание учиться.',
  'Я испытываю интерес только к отдельным предметам.',
  'Считаю, что успех в учебе – немаловажная основа для уважения и признания среди одноклассников.',
  'Приходится учиться, чтобы избежать надоевших нравоучений и разносов со стороны родителей и учителей.',
  'Я испытываю чувство удовлетворения, подъема, когда сам решу трудную задачу, хорошо выучу правило и т.д.',
  'Хочу знать как можно больше, чтобы стать интересным, культурным человеком.',
  'Хорошо учиться, не пропускать уроки – моя гражданская обязанность на данном этапе моей жизни.',
  'На уроке я не люблю болтать и отвлекаться, потому что для меня очень важно понять объяснение учителя, правильно ответить на его вопросы.',
  'Мне очень нравится, если на уроке организуют совместную с ребятами работу (в паре, в бригаде, в команде).',
  'Я очень чувствителен к похвале учителя, родителей за мои школьные успехи.',
  'Учусь хорошо, так как всегда стремлюсь быть в числе лучших.',
  'Я много читаю книг, кроме учебников (по истории, спорту, природе и т.д.).',
  'Учеба в моем возрасте – самое главное дело.',
  'В школе весело, интереснее, чем дома, во дворе.',
];

const scaleDefs = [
  { key: 'cognitive', label: 'Познавательные мотивы', items: [2, 9, 15] },
  { key: 'communicative', label: 'Коммуникативные мотивы', items: [3, 10, 16] },
  { key: 'emotional', label: 'Эмоциональные мотивы', items: [1, 8, 21] },
  { key: 'self_development', label: 'Мотивы саморазвития', items: [6, 13, 19] },
  { key: 'school_position', label: 'Позиция школьника', items: [7, 14, 20] },
  { key: 'achievement', label: 'Мотивы достижения', items: [5, 12, 18] },
  { key: 'external', label: 'Внешние мотивы (поощрения, наказания)', items: [4, 11, 17] },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2004_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2004',
  title: 'Учебная мотивация (Г. А. Карпова)',
  description: 'Опросник выявляет осознаваемые мотивы учебной деятельности школьников: познавательные, коммуникативные и эмоциональные мотивы, саморазвитие, позицию школьника, достижение и внешние стимулы. Опубликованный вариант рассчитан на учащихся 7–9 классов; на странице русской версии указан возрастной диапазон 5–8 классов, поэтому при выборе версии следует учитывать эту разницу.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: scaleDefs.map((scale) => ({ ...scale, reverseItems: [], aggregation: 'sum' as const })),
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная сверка ключа: все оценки минимальны', answers: allAnswers(1), expected: { cognitive: 3, communicative: 3, emotional: 3, self_development: 3, school_position: 3, achievement: 3, external: 3 } },
  { title: 'Ручная сверка ключа: все оценки максимальны', answers: allAnswers(4), expected: { cognitive: 12, communicative: 12, emotional: 12, self_development: 12, school_position: 12, achievement: 12, external: 12 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'karpova-educational-motivation-1996-21item-v1',
};
