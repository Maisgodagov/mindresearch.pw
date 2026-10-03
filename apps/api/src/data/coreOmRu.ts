import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const items = [
  'Я чувстовал(а) себя страшно одиноким(ой) и оторванным(ой) ото всех',
  'Я чувствовал(а) напряжение и беспокойство',
  'Я чувстовал(а), что мне есть к кому обратиться за поддержкой',
  'Я чувстовал(а), что у меня всё хорошо',
  'Я чувствовал(а) полное отсутствие сил и энтузиазма',
  'Я проявлял(а) физическую силу по отношению к другим',
  'Я чувствовал(а), что могу справиться с любыми проблемами',
  'Меня беспокоили недомогание, боли и другие проблемы со здоровьем',
  'У меня было желание причинить себе боль',
  'Мне было тяжело общаться с другими людьми',
  'Напряжение и тревога мешали мне заниматься важными делами',
  'Я был(а) доволен(льна) тем, что я делал(а)',
  'Меня беспокоили неприятные мысли и чувства',
  'Мне хотелось плакать',
  'Я чувствовал(а) панику и страх',
  'Я планировал(а) покончить жизнь самоубийством',
  'Я чувствовал(а), что не могу справиться со своими проблемами',
  'Мне было трудно заснуть или сон был беспокойный',
  'Я испытывала(а) тёплые чувства по отношению у кому-то',
  'Я не мог(ла) отвлечься от своих проблем',
  'Я был(а) в состоянии справиться с большинством своих дел',
  'Я угрожал(а) кому-то или запугивал(а) кого-то',
  'Я чувствовал(а) отчаяние и безнадёжность',
  'Мне казалось, было бы лучше, если бы я умер(ла)',
  'Я чувствовал(а) осуждение со стороны других людей',
  'Мне казалось, у меня нет друзей',
  'Я чувствовал(а) себя несчастным(ой)',
  'Меня тревожили неприятные образы и воспоминания',
  'Окружающие меня раздражали',
  'Мне казалось, что я сам(а) виноват(а) в своих проблемах и трудностях',
  'Мысли о будущем вселяли в меня оптимизм',
  'Мне удалось сделать то, что я хотел',
  'Я чувстовал, что окружающие унижали и стыдили меня',
  'Я наносил себе физические повреждения или подвергал своё здоровье серьёзному риску',
];

export const coreOmRuInstrument: SeedSection = {
  code: 'test_61',
  title: 'CORE-OM (официальный русский перевод CORE System Trust, 2024)',
  description: '34 утверждения о самочувствии за последнюю неделю. Выберите частоту переживания каждого состояния: никогда, очень редко, иногда, часто или постоянно.',
  questions: items.map((text, index) => ({
    code: `test_61_${index + 1}`, text, type: 'single', required: true,
    options: [
      { value: '0', label: 'Никогда' }, { value: '1', label: 'Очень редко' },
      { value: '2', label: 'Иногда' }, { value: '3', label: 'Часто' },
      { value: '4', label: 'Постоянно' },
    ],
  })),
};

const wellbeing = [4, 14, 17, 31];
const problems = [2, 5, 8, 11, 13, 15, 18, 20, 23, 27, 28, 30];
const functioning = [1, 3, 7, 10, 12, 19, 21, 25, 26, 29, 32, 33];
const risk = [6, 9, 16, 22, 24, 34];
const reverseItems = [3, 4, 7, 12, 19, 21, 31, 32];

export const coreOmRuScoring: ConfigurableScoring = {
  min: 0, max: 4,
  scales: [
    { key: 'wellbeing', label: 'Субъективное благополучие', items: wellbeing, reverseItems, aggregation: 'mean' },
    { key: 'problems', label: 'Проблемы и симптомы', items: problems, reverseItems, aggregation: 'mean' },
    { key: 'functioning', label: 'Жизненное функционирование', items: functioning, reverseItems, aggregation: 'mean' },
    { key: 'risk', label: 'Риск', items: risk, reverseItems, aggregation: 'mean' },
    { key: 'total', label: 'Общий средний балл', items: Array.from({ length: 34 }, (_, i) => i + 1), reverseItems, aggregation: 'mean' },
    { key: 'nonRisk', label: 'Средний балл без шкалы риска', items: [...wellbeing, ...problems, ...functioning], reverseItems, aggregation: 'mean' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, i) => [String(i + 1), value]));
export const coreOmRuValidationCases: ValidationCase[] = [
  { title: 'Все ответы минимальны', answers: answers(0), expected: { wellbeing: 2, problems: 0, functioning: 2, risk: 0, total: 32 / 34, nonRisk: 32 / 28 } },
  { title: 'Все ответы максимальны', answers: answers(4), expected: { wellbeing: 2, problems: 4, functioning: 2, risk: 4, total: 104 / 34, nonRisk: 80 / 28 } },
  { title: 'Все ответы нейтральны', answers: answers(2), expected: { wellbeing: 2, problems: 2, functioning: 2, risk: 2, total: 2, nonRisk: 2 } },
];
