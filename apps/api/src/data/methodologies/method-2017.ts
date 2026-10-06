import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  'Я всегда любознателен.', 'Мне все быстро надоедает.',
  'Я с удовольствием узнаю что-то новое.', 'Я не посещаю ни музеи, ни другие культурные учреждения.',
  'В случае необходимости я способен мыслить критически.', 'Я склонен к скоропалительным выводам.',
  'Мне нравится все делать по-новому.', 'Большинство моих друзей гораздо более творческие личности, чем я сам.',
  'Я могу приспособиться к любой ситуации.', 'Я плохо улавливаю чувства других людей.',
  'Я всегда способен взглянуть на происходящее в целом, с учетом перспективы.', 'Ко мне редко обращаются за советом.',
  'Я всегда выполняю свой долг несмотря на любые трудности и опасности.', 'Я часто падаю духом перед лицом серьезных трудностей или опасностей.',
  'Я всегда довожу начатое дело до конца.', 'Занимаясь каким-либо делом, я часто отвлекаюсь от основной цели.',
  'Я всегда исполняю обещания.', 'Мне еще никто не говорил, что я реалист.',
  'Я недавно помог соседу, причем добровольно.', 'Я очень редко принимаю близко к сердцу судьбы других людей.',
  'Среди моих друзей есть те, кто заботится обо мне не меньше, чем о себе.', 'Я не часто позволяю себя любить.',
  'Лучше всего я работаю в команде.', 'Я еще подумаю, прежде чем решиться пожертвовать собственными интересами в пользу моего коллектива.',
  'Я одинаково отношусь ко всем людям независимо от их положения.', 'Если я кого-то недолюбливаю, мне трудно относиться к нему объективно.',
  'Я способен организовать работу коллектива, не изводя сотрудников.', 'Я плохо умею организовать работу коллектива.',
  'Я контролирую свои эмоции.', 'Я с трудом выдерживаю диету.',
  'Я избегаю занятий, угрожающих здоровью.', 'Я часто ошибаюсь, выбирая друзей и знакомых.',
  'Недавно я испытал восторг, созерцая произведение искусства (слушая музыку, наслаждаясь спектаклем, спортивным зрелищем, изучая достижения науки).', 'За последний год я не создал ничего прекрасного.',
  'Я всегда благодарю людей, даже за мелочи.', 'Я редко задумываюсь над тем, кому и за что должен быть благодарен.',
  'Я всегда и во всем пытаюсь отыскать положительную сторону.', 'Я редко думаю о том, что хотел бы сделать в будущем.',
  'Моя жизнь подчинена великой цели.', 'Я не знаю, в чем мое призвание.',
  'Я живу под девизом: «Кто прошлое помянет – тому глаз вон».', 'Я всегда свожу счеты с обидчиками.',
  'Я всегда по возможности перемежаю работу шуткой и веселостью.', 'Я редко говорю смешные вещи.',
  'Я всецело отдаюсь всему, что делаю.', 'Я нередко бываю подавлен и ко всему безучастен.',
];

const options = [
  { value: '1', label: 'Совершенно не про меня' },
  { value: '2', label: 'Не про меня' },
  { value: '3', label: 'Нейтрально' },
  { value: '4', label: 'В общем это про меня' },
  { value: '5', label: 'Точно соответствует истине' },
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2033_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2033',
  title: 'Ценности в действии: инвентаризация достоинств (сокращённая русскоязычная версия)',
  description: 'Сокращённый VIA-IS оценивает выраженность личностных достоинств в логике позитивной психологии: мудрость и знание, мужество, гуманизм и любовь, справедливость, умеренность и духовность. Версия Башкатова предназначена для экспресс-диагностики психически здоровых взрослых русскоязычных респондентов; результаты дают профиль сильных сторон характера.',
  questions,
};

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'wisdom_knowledge', label: 'Мудрость и знание', items: range(1, 12), reverseItems: range(2, 12).filter(n => n % 2 === 0), aggregation: 'sum' },
    { key: 'courage', label: 'Мужество', items: range(13, 18), reverseItems: [14, 16, 18], aggregation: 'sum' },
    { key: 'humanity_love', label: 'Гуманизм и любовь', items: range(19, 22), reverseItems: [20, 22], aggregation: 'sum' },
    { key: 'justice', label: 'Справедливость', items: range(23, 28), reverseItems: [24, 26, 28], aggregation: 'sum' },
    { key: 'temperance', label: 'Умеренность', items: range(29, 32), reverseItems: [30, 32], aggregation: 'sum' },
    { key: 'spirituality', label: 'Духовность', items: range(33, 46), reverseItems: range(34, 46).filter(n => n % 2 === 0), aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(statements.map((_, i) => [String(i + 1), value]));
const caseScores = (answers: Record<string, unknown>) => {
  const score = (from: number, to: number) => range(from, to).reduce((sum, item) => {
    const raw = Number(answers[String(item)]);
    return sum + (item % 2 === 0 ? 6 - raw : raw);
  }, 0);
  return {
    wisdom_knowledge: score(1, 12),
    courage: score(13, 18),
    humanity_love: score(19, 22),
    justice: score(23, 28),
    temperance: score(29, 32),
    spirituality: score(33, 46),
  };
};
const validationCases: ValidationCase[] = [
  { title: 'Все ответы — совершенно не про меня', answers: allAnswers(1), expected: { wisdom_knowledge: 36, courage: 18, humanity_love: 12, justice: 18, temperance: 12, spirituality: 42 } },
  { title: 'Все ответы — точно соответствует истине', answers: allAnswers(5), expected: { wisdom_knowledge: 36, courage: 18, humanity_love: 12, justice: 18, temperance: 12, spirituality: 42 } },
  { title: 'Проверка реверсивного пункта Б в первой паре', answers: { ...allAnswers(3), '1': 5, '2': 5 }, expected: { ...caseScores({ ...Object.fromEntries(statements.map((_, i) => [String(i + 1), 3])), '1': 5, '2': 5 }) } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'via-is-bashkatov-ru-short-2020-v1',
};
