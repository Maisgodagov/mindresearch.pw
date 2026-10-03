import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '0', label: '0 — Совершенно неверно или часто неверно' },
  { value: '1', label: '1 — Иногда или в некоторой степени неверно' },
  { value: '2', label: '2 — Иногда или в некоторой степени верно' },
  { value: '3', label: '3 — Совершенно верно или часто верно' },
];

const items = [
  'Мои эмоциональные реакции намного сильнее, чем почти у всех остальных.',
  'У меня хорошо получается обманывать.',
  'Я часто беззаботно отношусь к своим и чужим вещам.',
  'Я держусь на расстоянии от людей.',
  'Я часто вижу необычные связи между вещами, которых другие люди не замечают.',
  'Несмотря на то, что это сводит с ума остальных, я настаиваю на том, чтобы всё было идеально.',
  'Я всегда о чем-то переживаю.',
  'Временами нужно преувеличить, чтобы преуспеть.',
  'Мне кажется, я действую только под влиянием импульса.',
  'Ничто не вызывает у меня серьезного интереса.',
  'Люди говорили мне, что то, как я мыслю, очень странно.',
  'Мне важно, чтобы все было сделано определенным образом.',
  'Я много переживаю из-за возможного одиночества.',
  'Я заслуживаю особого обращения.',
  'Я теряю нить разговора, потому что что-то другое привлекает мое внимание.',
  'Я предпочитаю не иметь в своей жизни романтических отношений.',
  'Это странно, но иногда самые обыкновенные вещи кажутся мне другой формы, чем обычно.',
  'Я всегда стараюсь довести вещи до идеала, даже когда они уже и так лучше некуда.',
  'Я легко расстраиваюсь, часто почти без причины.',
  'Я легко пользуюсь другими в своих интересах.',
  'Я часто забываю оплачивать счета.',
  'Мне не нравится проводить время с другими людьми.',
  'Со мной происходили самые странные вещи, которые трудно описать.',
  'Я делаю все строго определенным образом.',
  'Я беспокоюсь практически из-за всего.',
  'Я привру, если это мне на пользу.',
  'Я понимаю, что это неверно, но все равно принимаю опрометчивые решения.',
  'Я редко испытываю воодушевление по какому-либо поводу.',
  'У меня есть несколько привычек, которые люди находят странными или эксцентричными.',
  'Мне говорили, что я трачу много времени на то, чтобы удостовериться, что всё на своих местах.',
  'Я не переношу одиночества, даже на несколько часов.',
  'Мне часто приходится иметь дело с людьми, которые менее значительны, чем я.',
  'Я легко отвлекаюсь.',
  'Я разрываю отношения, как только они начинают становиться близкими.',
  'Иногда бывает так, что я смотрю на знакомый предмет, и мне кажется, что я вижу его впервые.',
  'Люди жалуются на то, что мне постоянно нужно, чтобы все было по определенному порядку.',
];

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const cycleAnswers = Object.fromEntries(items.map((_, index) => [String(index + 1), index % 4]));

export const pid5bfPlusMRuInstrument: SeedSection = {
  code: 'test_58',
  title: 'Модифицированный опросник личности для DSM-5 и МКБ-11, PID-5-BF+M',
  description: 'Русскоязычная 36-пунктовая версия PID5BF+M оценивает 18 фасетов и шесть доменов дезадаптивных черт личности. Пункты и алгоритм опубликованы авторами русскоязычного исследования 2023 года.',
  questions: items.map((text, index) => ({ code: `test_58_${index + 1}`, text, type: 'single', required: true, options })),
};

export const pid5bfPlusMRuScoring: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'emotionalLability', label: 'Эмоциональная лабильность', items: [1, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'anxiousness', label: 'Тревожность', items: [7, 25], reverseItems: [], aggregation: 'sum' },
    { key: 'separationInsecurity', label: 'Страх сепарации', items: [13, 31], reverseItems: [], aggregation: 'sum' },
    { key: 'negativeAffectivity', label: 'Негативный аффект', items: [1, 19, 7, 25, 13, 31], reverseItems: [], aggregation: 'mean' },
    { key: 'withdrawal', label: 'Отстранение', items: [4, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'anhedonia', label: 'Ангедония', items: [10, 28], reverseItems: [], aggregation: 'sum' },
    { key: 'intimacyAvoidance', label: 'Избегание близости', items: [16, 34], reverseItems: [], aggregation: 'sum' },
    { key: 'detachment', label: 'Отчуждение', items: [4, 22, 10, 28, 16, 34], reverseItems: [], aggregation: 'mean' },
    { key: 'manipulativeness', label: 'Манипулятивность', items: [2, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'deceitfulness', label: 'Лживость', items: [8, 26], reverseItems: [], aggregation: 'sum' },
    { key: 'grandiosity', label: 'Грандиозность', items: [14, 32], reverseItems: [], aggregation: 'sum' },
    { key: 'antagonism', label: 'Антагонизм', items: [2, 20, 8, 26, 14, 32], reverseItems: [], aggregation: 'mean' },
    { key: 'irresponsibility', label: 'Безответственность', items: [3, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'impulsivity', label: 'Импульсивность', items: [9, 27], reverseItems: [], aggregation: 'sum' },
    { key: 'distractibility', label: 'Отвлекаемость', items: [15, 33], reverseItems: [], aggregation: 'sum' },
    { key: 'disinhibition', label: 'Расторможенность', items: [3, 21, 9, 27, 15, 33], reverseItems: [], aggregation: 'mean' },
    { key: 'perfectionism', label: 'Перфекционизм', items: [6, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'rigidity', label: 'Ригидность', items: [12, 24], reverseItems: [], aggregation: 'sum' },
    { key: 'orderliness', label: 'Любовь к порядку', items: [30, 36], reverseItems: [], aggregation: 'sum' },
    { key: 'anankastia', label: 'Ананкастность', items: [6, 18, 12, 24, 30, 36], reverseItems: [], aggregation: 'mean' },
    { key: 'unusualBeliefs', label: 'Необычные убеждения и опыт', items: [5, 23], reverseItems: [], aggregation: 'sum' },
    { key: 'eccentricity', label: 'Эксцентричность', items: [11, 29], reverseItems: [], aggregation: 'sum' },
    { key: 'perceptualDysregulation', label: 'Когнитивная и перцептивная дизрегуляция', items: [17, 35], reverseItems: [], aggregation: 'sum' },
    { key: 'psychoticism', label: 'Психотизм', items: [5, 23, 11, 29, 17, 35], reverseItems: [], aggregation: 'mean' },
  ],
};

export const pid5bfPlusMRuValidationCases: ValidationCase[] = [
  { title: 'Все ответы — 0', answers: answers(0), expected: Object.fromEntries(pid5bfPlusMRuScoring.scales.map(scale => [scale.key, 0])) },
  { title: 'Все ответы — 3', answers: answers(3), expected: Object.fromEntries(pid5bfPlusMRuScoring.scales.map(scale => [scale.key, scale.aggregation === 'sum' ? 6 : 3])) },
  { title: 'Контроль: цикл 0–3', answers: cycleAnswers, expected: { emotionalLability: 2, anxiousness: 2, separationInsecurity: 2, negativeAffectivity: 1, withdrawal: 4, anhedonia: 4, intimacyAvoidance: 4, detachment: 2, manipulativeness: 4, deceitfulness: 4, grandiosity: 4, antagonism: 2, irresponsibility: 2, impulsivity: 2, distractibility: 2, disinhibition: 1, perfectionism: 2, rigidity: 6, orderliness: 4, anankastia: 2, unusualBeliefs: 2, eccentricity: 2, perceptualDysregulation: 2, psychoticism: 1 } },
];
