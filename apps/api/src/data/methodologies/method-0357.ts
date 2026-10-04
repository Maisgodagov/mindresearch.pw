import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const agreement = [
  { value: '0', label: 'Совершенно не согласен' },
  { value: '1', label: 'Скорее не согласен' },
  { value: '2', label: 'Скорее согласен' },
  { value: '3', label: 'Полностью согласен' },
];
const frequency4 = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Часто' },
  { value: '3', label: 'Очень часто' },
];
const frequency5 = [
  { value: '0', label: 'Ни разу' },
  { value: '1', label: 'Один или два раза' },
  { value: '2', label: 'Несколько раз' },
  { value: '3', label: 'Много раз' },
  { value: '4', label: 'Каждый день' },
];

const groups: { key: string; label: string; instruction?: string; choices: typeof agreement; statements: { text: string; reverse?: boolean }[] }[] = [
  { key: 'belonging', label: 'Общее отношение к школе: чувство принадлежности и удовлетворенность школой', choices: agreement, statements: [
    { text: 'В школе мне хорошо.' }, { text: 'Мне нравится моя школа.' }, { text: 'В школе я ощущаю себя в безопасности.' }, { text: 'Каждое утро я с удовольствием иду в школу.' }, { text: 'В школе ко мне хорошо относятся.' }, { text: 'В школе я могу быть самим(-ой) собой.' }, { text: 'Иногда мне кажется, что я чужой(-ая) в этой школе.', reverse: true }, { text: 'Таким, как я, трудно в этой школе.', reverse: true }, { text: 'Обычно, когда я ухожу из школы, я доволен(-на) прошедшим днем.' },
  ] },
  { key: 'engagement', label: 'Вовлеченность в учебный процесс', choices: agreement, statements: [
    { text: 'Мне интересно учиться в школе.' }, { text: 'Есть такие предметы, которые мы с одноклассниками обсуждаем после уроков.' }, { text: 'Некоторые предметы меня настолько интересуют, что я сам(-а) занимаюсь ими сверх программы.' }, { text: 'Я готов(-а) ездить в школу далеко от дома, лишь бы она была хорошая.' }, { text: 'В школе нет предметов, которые бы меня увлекали.', reverse: true }, { text: 'То, чему меня учат в школе, никогда не пригодится в жизни.', reverse: true }, { text: 'Учеба мало готовит меня к взрослой жизни.', reverse: true }, { text: 'Учеба в школе — это напрасная трата времени.', reverse: true },
  ] },
  { key: 'aggression', label: 'Агрессивная среда в школе', instruction: 'Как часто в прошлом году в вашем классе происходило что-то из перечисленного?', choices: frequency4, statements: [
    { text: 'Мои одноклассники дрались друг с другом.' }, { text: 'Мои одноклассники ставили подножки и толкали более слабых школьников.' }, { text: 'Мои одноклассники угрожали взрослым в школе.' }, { text: 'Мои одноклассники издевались над другими школьниками и говорили о них гадости.' }, { text: 'Мои одноклассники писали гадости о других школьниках в Интернете (в сети «ВКонтакте», в чатах и т.п.).' },
  ] },
  { key: 'victimization', label: 'Буллинг — личный опыт жертв', instruction: 'Как часто в прошлом году в школе с тобой случалось что-то из перечисленного? Отметь подходящий вариант ответа для каждой из описанных ситуаций.', choices: frequency4, statements: [
    { text: 'Над тобой издевались.' }, { text: 'Тебя дразнили.' }, { text: 'О тебе распространяли сплетни.' }, { text: 'Тебя побили.' }, { text: 'Тебя пнули или толкнули.' }, { text: 'Прятали твои вещи (сумку, тетради и т.д.).' }, { text: 'Ты с кем-то подрался(-ась).' }, { text: 'Одноклассники долго с тобой не разговаривали, игнорировали тебя.' }, { text: 'Над тобой шутили всем классом.' },
  ] },
  { key: 'cyberbullying', label: 'Кибербуллинг — личный опыт жертв', instruction: 'Как часто за последний месяц в Интернете...', choices: frequency5, statements: [
    { text: 'Тебе писали (в «ВКонтакте», чатах, форумах и др.) что-то обидное и неприятное.' }, { text: 'Про тебя запостили что-то такое, что тебе было неприятно.' }, { text: 'Про тебя писали гадости и обсуждали тебя так, что это тебя раздражало.' },
  ] },
  { key: 'teachers', label: 'Отношение к учителям', choices: agreement, statements: [
    { text: 'Если мы чего-то не понимаем на уроках, учителя всегда находят способ это объяснить.' }, { text: 'Учителя в моем классе хорошо учат.' }, { text: 'Учителя в моем классе понятно объясняют сложные темы.' }, { text: 'Большинство учителей в этой школе справедливо относятся к ученикам.' }, { text: 'Я всегда могу обратиться за помощью и советом к учителю.' }, { text: 'Учителя в этой школе дружелюбно настроены к ученикам.' }, { text: 'Учителя в этой школе вежливы с учениками.' },
  ] },
  { key: 'math', label: 'Уверенность в своих силах по математике', choices: agreement, statements: [
    { text: 'Математика мне легко дается.' }, { text: 'Мне интересно решать математические задачи.' }, { text: 'Мне не нравится математика.', reverse: true }, { text: 'На уроках математики я чувствую беспомощность.', reverse: true },
  ] },
  { key: 'humanities', label: 'Уверенность в своих силах по гуманитарным предметам', choices: agreement, statements: [
    { text: 'Мне легко учиться по гуманитарным предметам (например, по русскому языку, литературе, истории).' }, { text: 'Если я постараюсь, я могу учиться на «пятерки» по гуманитарным предметам (например, по русскому языку, литературе, истории).' }, { text: 'Мне не нравятся гуманитарные предметы (например, русский язык, литература, история).', reverse: true }, { text: 'Мне трудно писать контрольные / сдавать экзамены по гуманитарным предметам (например, по русскому языку, литературе, истории).', reverse: true },
  ] },
  { key: 'discipline', label: 'Дисциплина в школе', choices: agreement, statements: [
    { text: 'Поведение некоторых учеников на уроках мешает мне заниматься.' }, { text: 'Часто мне бывает трудно слушать учителя, потому что в классе очень шумно.' }, { text: 'Ученики в этой школе часто опаздывают на уроки.' }, { text: 'Ученики в этой школе часто пропускают уроки.' }, { text: 'Ученики в этой школе стараются приходить на уроки вовремя.', reverse: true },
  ] },
];

const questionRecords = groups.flatMap((group) => group.statements.map((statement) => ({ group, statement })));
const questions: SeedSection['questions'] = questionRecords.map(({ group, statement }, index) => ({
  code: `test_393_${index + 1}`,
  text: `${group.instruction ? `${group.instruction}\n` : ''}${statement.text}`,
  type: 'single',
  required: true,
  options: group.choices,
}));

export const instrument: SeedSection = {
  code: 'test_393',
  title: 'Инструмент для измерения школьного климата (НУЛ СОН ВШЭ)',
  description: 'Многомерная оценка восприятия школьной жизни учащимися: принадлежности и удовлетворенности школой, учебной вовлеченности, отношений с учителями, уверенности в учебных силах, дисциплины и агрессивной среды, включая личный опыт буллинга и кибербуллинга. Подходит для опросов школьников; авторская публикация описывает применение инструмента прежде всего в 6–9-х классах, а отдельные более ранние версии — в 9–11-х классах.',
  questions,
};

const indicesFor = (key: string) => questionRecords.flatMap(({ group }, index) => group.key === key ? [index + 1] : []);
const reverseIndicesFor = (key: string) => questionRecords.flatMap(({ group, statement }, index) => group.key === key && statement.reverse ? [index + 1] : []);
export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: groups.map((group) => ({
    key: group.key,
    label: group.label,
    items: indicesFor(group.key),
    reverseItems: reverseIndicesFor(group.key),
    aggregation: 'sum',
  })),
};

const all = (value: number) => Object.fromEntries(questionRecords.map((_, index) => [String(index + 1), value]));
const allExpected = (value: number) => Object.fromEntries(groups.map((group) => [group.key, indicesFor(group.key).length * value]));
const mixedAnswers = Object.fromEntries(questionRecords.map(({ group, statement }, index) => [String(index + 1), statement.reverse ? 0 : group.key === 'cyberbullying' || group.key === 'aggression' || group.key === 'victimization' ? 1 : 2]));
const mixedExpected = Object.fromEntries(groups.map((group) => [group.key, indicesFor(group.key).reduce((sum, item) => {
  const raw = mixedAnswers[String(item)];
  return sum + (reverseIndicesFor(group.key).includes(item) ? 4 - raw : raw);
}, 0)]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: минимальные ответы; реверсивные ответы перекодированы', answers: all(0), expected: allExpected(0) },
  { title: 'Ручная проверка смешанного профиля с реверсивными и частотными ответами', answers: mixedAnswers, expected: mixedExpected },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'nulson-school-climate-2018-appendix1-raw-sums-reverse-v1',
};
