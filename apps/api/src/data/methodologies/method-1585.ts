import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  '…чтобы помогать другим людям',
  '…чтобы быть свободным',
  '…чтобы получать удовольствие',
  '…чтобы совершенствоваться',
  '…чтобы добиваться успеха',
  '…чтобы быть с близким человеком',
  '…чтобы передать всё лучшее своим детям',
  '…чтобы понять себя самого',
  '…чтобы делать добро',
  '…чтобы жить',
  '…чтобы испытывать счастье',
  '…чтобы осуществить себя',
  '…чтобы сделать хорошую карьеру',
  '…чтобы чувствовать, что кому-то нужен',
  '…чтобы жить ради своей семьи',
  '…чтобы познавать Бога',
  '…чтобы улучшать мир',
  '…чтобы любить',
  '…чтобы получать как можно больше ощущений и переживаний',
  '…чтобы реализовать все свои возможности',
  '…чтобы занимать достойное положение в обществе',
  '…чтобы радоваться общению с другими',
  '…чтобы помогать своим родным и близким',
  '…чтобы понять жизнь',
];
const ranks = Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}-е место` }));
const categories = [
  { key: 'altruistic', label: 'Альтруистические смыслы', items: [1, 9, 17] },
  { key: 'existential', label: 'Экзистенциальные смыслы', items: [2, 10, 18] },
  { key: 'hedonistic', label: 'Гедонистические смыслы', items: [3, 11, 19] },
  { key: 'self_realization', label: 'Смыслы самореализации', items: [4, 12, 20] },
  { key: 'status', label: 'Статусные смыслы', items: [5, 13, 21] },
  { key: 'communicative', label: 'Коммуникативные смыслы', items: [6, 14, 22] },
  { key: 'family', label: 'Семейные смыслы', items: [7, 15, 23] },
  { key: 'cognitive', label: 'Когнитивные смыслы', items: [8, 16, 24] },
];
const questions: SeedSection['questions'] = [
  { code: 'test_1602_instruction', text: 'Перед вами перечень из 24 жизненных смыслов. Прочитайте весь список. Распределите утверждения по 8 местам: выберите ровно три утверждения для 1-го места, затем по три для каждого следующего места до 8-го. Запишите для каждого утверждения присвоенное ему место.', type: 'text', required: false, options: [] },
  ...statements.map((text, index) => ({ code: `test_1602_${index + 1}`, text: `Смысл моей жизни состоит в том ${text}`, type: 'single' as const, required: true, options: ranks })),
];

export const instrument: SeedSection = {
  code: 'test_1602',
  title: 'Система жизненных смыслов (СЖС)',
  description: 'Методика В. Ю. Котлякова изучает индивидуальную систему жизненных смыслов и относительный вес восьми категорий: альтруистических, экзистенциальных, гедонистических, самореализации, статусных, коммуникативных, семейных и когнитивных. Подходит для исследования смысловых приоритетов взрослых и социальных групп; результат представляет ранговый профиль, а не нормативную диагностику.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 8,
  scales: categories.map(category => ({ ...category, reverseItems: [], aggregation: 'sum' as const })),
};

const answers = Object.fromEntries(Array.from({ length: 24 }, (_, i) => [String(i + 1), Math.floor(i / 3) + 1]));
const validationCases: ValidationCase[] = [{
  title: 'Ручная проверка: по три последовательных пункта распределены на каждое место; суммы категорий равны ключу',
  answers,
  expected: { altruistic: 10, existential: 11, hedonistic: 12, self_realization: 13, status: 14, communicative: 15, family: 16, cognitive: 17 },
}];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kotlyakov-szs-rank-category-sums-v1',
};
