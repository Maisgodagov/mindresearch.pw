import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const rankOptions = Array.from({ length: 18 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));

const values = [
  { name: 'Активная деятельная жизнь', detail: 'полнота и эмоциональная насыщенность жизни', scale: 'terminal' },
  { name: 'Жизненная мудрость', detail: 'зрелость суждений и здравый смысл, достигаемые благодаря жизненному опыту', scale: 'terminal' },
  { name: 'Здоровье', detail: 'физическое и психическое', scale: 'terminal' },
  { name: 'Интересная работа', detail: '', scale: 'terminal' },
  { name: 'Красота природы и искусства', detail: 'переживание прекрасного в природе и в искусстве', scale: 'terminal' },
  { name: 'Любовь', detail: 'духовная и физическая близость с любимым человеком', scale: 'terminal' },
  { name: 'Материально обеспеченная жизнь', detail: 'отсутствие материальных проблем', scale: 'terminal' },
  { name: 'Наличие хороших и верных друзей', detail: '', scale: 'terminal' },
  { name: 'Общественное признание', detail: 'уважение окружающих, коллектива, коллег', scale: 'terminal' },
  { name: 'Познание', detail: 'возможность расширения своего образования, кругозора, общей культуры, интеллектуальное развитие', scale: 'terminal' },
  { name: 'Продуктивная жизнь', detail: 'максимально полное использование своих возможностей, сил и способностей', scale: 'terminal' },
  { name: 'Развитие', detail: 'работа над собой, постоянное физическое и духовное совершенствование', scale: 'terminal' },
  { name: 'Свобода', detail: 'самостоятельность, независимость в суждениях и поступках', scale: 'terminal' },
  { name: 'Счастливая семейная жизнь', detail: '', scale: 'terminal' },
  { name: 'Счастье других', detail: 'благосостояние, развитие и совершенствование других людей, всего народа, человечества в целом', scale: 'terminal' },
  { name: 'Творчество', detail: 'возможность заниматься творчеством', scale: 'terminal' },
  { name: 'Уверенность в себе', detail: 'внутренняя гармония, свобода от внутренних противоречий, сомнений', scale: 'terminal' },
  { name: 'Удовольствия', detail: 'приятное, необременительное времяпрепровождение, отсутствие обязанностей, развлечения', scale: 'terminal' },
  { name: 'Аккуратность', detail: 'чистоплотность, умение содержать в порядке вещи, четкость в ведении дел', scale: 'instrumental' },
  { name: 'Воспитанность', detail: 'хорошие манеры, умение вести себя в соответствии с нормами культуры поведения', scale: 'instrumental' },
  { name: 'Высокие запросы', detail: 'высокие требования к жизни и высокие притязания', scale: 'instrumental' },
  { name: 'Жизнерадостность', detail: 'оптимизм, чувство юмора', scale: 'instrumental' },
  { name: 'Исполнительность', detail: 'дисциплинированность', scale: 'instrumental' },
  { name: 'Независимость', detail: 'способность действовать самостоятельно, решительно', scale: 'instrumental' },
  { name: 'Непримиримость к недостаткам', detail: 'в себе и других', scale: 'instrumental' },
  { name: 'Образованность', detail: 'широта знаний, высокий культурный уровень', scale: 'instrumental' },
  { name: 'Ответственность', detail: 'чувство долга, умение держать свое слово', scale: 'instrumental' },
  { name: 'Рационализм', detail: 'умение здраво и логично мыслить, принимать обдуманные, рациональные решения', scale: 'instrumental' },
  { name: 'Самоконтроль', detail: 'сдержанность, самодисциплина', scale: 'instrumental' },
  { name: 'Смелость в отстаивании своего мнения', detail: 'своих взглядов', scale: 'instrumental' },
  { name: 'Чуткость', detail: 'заботливость', scale: 'instrumental' },
  { name: 'Терпимость', detail: 'к взглядам и мнениям других, умение прощать другим их ошибки и заблуждения', scale: 'instrumental' },
  { name: 'Широта взглядов', detail: 'умение понять чужую точку зрения, уважать иные вкусы, обычаи, привычки', scale: 'instrumental' },
  { name: 'Твердая воля', detail: 'умение настоять на своем, не отступать перед трудностями', scale: 'instrumental' },
  { name: 'Честность', detail: 'правдивость, искренность', scale: 'instrumental' },
  { name: 'Эффективность в делах', detail: 'трудолюбие, продуктивность в работе', scale: 'instrumental' },
];

const questions: SeedSection['questions'] = values.map(({ name, detail }, index) => ({
  code: `test_645_${index + 1}`,
  text: `${name}${detail ? ` (${detail})` : ''}. Укажите ранг в соответствующем списке: 1 — наиболее значимая ценность, 18 — наименее значимая. Каждый ранг используется один раз отдельно в каждом списке.`,
  type: 'single',
  required: true,
  options: rankOptions,
}));

export const instrument: SeedSection = {
  code: 'test_645',
  title: 'Методика изучения ценностных ориентаций Рокича (адаптация Гоштаутаса, Семенова и Ядова)',
  description: 'Методика описывает индивидуальную иерархию ценностных ориентаций в двух аспектах: терминальные ценности как жизненные цели и инструментальные ценности как предпочитаемые качества и способы поведения. Профиль рангов помогает автору опроса увидеть приоритеты человека или сопоставить группы; версия включает русскую адаптацию Гоштаутаса, Семенова и Ядова и подходит для взрослых и старших подростков при осмысленном самостоятельном ранжировании.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 18,
  scales: [
    { key: 'terminal', label: 'Терминальные ценности (ранги)', items: Array.from({ length: 18 }, (_, index) => index + 1), reverseItems: [], aggregation: 'mean' },
    { key: 'instrumental', label: 'Инструментальные ценности (ранги)', items: Array.from({ length: 18 }, (_, index) => index + 19), reverseItems: [], aggregation: 'mean' },
  ],
};

const rankingAnswers = (offset: number, ranks: number[]) => Object.fromEntries(ranks.map((rank, index) => [String(offset + index + 1), rank]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: последовательные ранги; среднее каждого списка = 9,5',
    answers: { ...rankingAnswers(0, Array.from({ length: 18 }, (_, index) => index + 1)), ...rankingAnswers(18, Array.from({ length: 18 }, (_, index) => index + 1)) },
    expected: { terminal: 9.5, instrumental: 9.5 },
  },
  {
    title: 'Ручная проверка: обратный порядок; среднее рангов обоих списков = 9,5',
    answers: { ...rankingAnswers(0, Array.from({ length: 18 }, (_, index) => 18 - index)), ...rankingAnswers(18, Array.from({ length: 18 }, (_, index) => 18 - index)) },
    expected: { terminal: 9.5, instrumental: 9.5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rokeach-goshtautas-semenov-yadov-1979-rank-profile-v1',
};
