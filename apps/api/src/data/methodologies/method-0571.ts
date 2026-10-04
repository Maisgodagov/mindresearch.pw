import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Мне кажется, лидером в классе достоин стать только ученик, который имеет хорошие результаты в учебе.',
  'Родители всегда поощряют меня за хорошие отметки в школе.',
  'Я очень люблю узнавать что-то новое.',
  'Мне нравится брать сложные задания, преодолевать трудности в их выполнении.',
  'Я хочу, чтобы одноклассники считали меня хорошим учеником.',
  'Я стремлюсь к тому, чтобы учитель похвалил меня, если я правильно выполнил задание.',
  'Я всегда рассказываю об успехах в учебе своим родителям.',
  'Меня пугает возможность остаться на второй год или быть отчисленным из школы за плохую успеваемость.',
  'Я часто скрываю свои плохие отметки от родителей, чтобы избежать наказания.',
  'Я учусь прежде всего потому, что знания пригодятся мне в будущем, помогут найти хорошую работу.',
  'Школа для меня прежде всего место общения с друзьями.',
  'Мне нравится участвовать в различных школьных мероприятиях, и было бы здорово не тратить в школе столько времени на уроки.',
  'Учеба для меня сейчас — одна из основных сфер, где я могу проявить себя.',
  'Ребята в нашем классе не будут хорошо относиться к человеку, если он плохо учится, несмотря на другие его заслуги.',
  'Мое образование часто становится темой для разговоров в нашей семье.',
  'Мне нравится проводить самостоятельные исследования, делать какие-то открытия.',
  'Мне важно доказать самому себе, что я способен хорошо учиться.',
  'Когда я получаю хорошую отметку, я стремлюсь, чтобы об этом знали мои одноклассники.',
  'Я расстраиваюсь, когда получаю тетрадь и вижу, что учитель никак не отметил мою работу.',
  'Я начинаю стараться на уроках, если знаю, что родители как-то поощрят мои старания.',
  'Я начинаю учиться старательнее, если знаю, что мою успеваемость будут разбирать на педсовете, на школьной линейке.',
  'Я прилагаю больше усилий к учебе, если знаю, что дома буду наказан за плохую успеваемость.',
  'Мне важно вырасти культурным, образованным человеком.',
  'Мне нравятся те уроки, где есть возможность работать в группе, обсуждать с одноклассниками учебный материал.',
  'Можно сказать, что в школе я больше заинтересован играми и другими интересными делами, чем уроками.',
  'Я люблю участвовать в различных олимпиадах и викторинах в школе, потому что для меня это способ заявить о себе.',
  'Ребята в нашем классе всегда интересуются результатами контрольных работ друг друга.',
  'Для моих родителей очень важно, чтобы я был успешен в учебе.',
  'Мне нравится придумывать новые способы решения задач.',
  'Мне хотелось бы быть лучшим учеником в классе.',
  'Я хочу выглядеть в хорошем свете перед одноклассниками, поэтому стараюсь хорошо учиться.',
  'Мне нравится, когда учителя в конце урока перечисляют учеников, чья работа на уроке была самой лучшей.',
  'Мне очень важно, чтоб родители считали меня способным учеником.',
  'Я расстраиваюсь из-за плохих отметок, потому что понимаю: это значит, что учителя теперь считают меня неспособным учеником.',
  'Я очень переживаю, если родители называют меня неспособным, неуспешным учеником.',
  'Я уже сейчас задумываюсь о том, в какой вуз я буду поступать и какие знания мне для этого понадобятся.',
  'Я всегда очень радуюсь, когда отменяют урок и можно пообщаться с одноклассниками.',
  'Я бы хотел, чтобы в школе остались одни перемены.',
  'Я люблю высказывать на уроке свою точку зрения и отстаивать ее.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_602_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: yesNo,
}));

export const instrument: SeedSection = {
  code: 'test_602',
  title: 'Методика диагностики типа школьной мотивации у старшеклассников',
  description: 'Опросник Е. Лепешовой выявляет преобладающие механизмы школьной учебной мотивации: познавательный интерес, достижение, социальное одобрение и страх наказания, осознание социальной необходимости, общение, внеучебную школьную мотивацию и самореализацию; отдельно оценивает престижность учебы в классе и семье. Предназначен преимущественно для учащихся 6–9-х классов и может применяться в 10–11-х классах; результаты помогают педагогам и авторам опросов понять, какие учебные мотивы выражены у учащихся и учитывать их при планировании поддержки и обучения.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'prestige_class', label: 'Престижность учебы в классе (1а)', items: [1, 14, 27], reverseItems: [], aggregation: 'sum' },
    { key: 'prestige_family', label: 'Престижность учебы в семье (1б)', items: [2, 15, 28], reverseItems: [], aggregation: 'sum' },
    { key: 'cognitive_interest', label: 'Познавательный интерес (2)', items: [3, 16, 29], reverseItems: [], aggregation: 'sum' },
    { key: 'achievement', label: 'Мотивация достижения (3)', items: [4, 17, 30], reverseItems: [], aggregation: 'sum' },
    { key: 'approval_classmates', label: 'Социальное одобрение одноклассниками (4а)', items: [5, 18, 31], reverseItems: [], aggregation: 'sum' },
    { key: 'approval_teachers', label: 'Социальное одобрение педагогами (4б)', items: [6, 19, 32], reverseItems: [], aggregation: 'sum' },
    { key: 'approval_parents', label: 'Социальное одобрение родителями (4в)', items: [7, 20, 33], reverseItems: [], aggregation: 'sum' },
    { key: 'punishment_school', label: 'Боязнь наказания со стороны школы (5а)', items: [8, 21, 34], reverseItems: [], aggregation: 'sum' },
    { key: 'punishment_family', label: 'Боязнь наказания со стороны семьи (5б)', items: [9, 22, 35], reverseItems: [], aggregation: 'sum' },
    { key: 'social_necessity', label: 'Осознание социальной необходимости (6)', items: [10, 23, 36], reverseItems: [], aggregation: 'sum' },
    { key: 'communication', label: 'Мотив общения (7)', items: [11, 24, 37], reverseItems: [], aggregation: 'sum' },
    { key: 'extracurricular_school', label: 'Внеучебная школьная мотивация (8)', items: [12, 25, 38], reverseItems: [], aggregation: 'sum' },
    { key: 'self_realization', label: 'Мотив самореализации (9)', items: [13, 26, 39], reverseItems: [], aggregation: 'sum' },
    { key: 'classmates_influence', label: 'Влияние одноклассников (10)', items: [5, 11, 18, 24, 31, 37], reverseItems: [], aggregation: 'mean' },
    { key: 'family_influence', label: 'Влияние семьи (11)', items: [7, 9, 20, 22, 33, 35], reverseItems: [], aggregation: 'mean' },
    { key: 'school_influence', label: 'Влияние школы (12)', items: [6, 8, 19, 21, 32, 34], reverseItems: [], aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Нет» дают нули по основным и дополнительным шкалам',
    answers: allAnswers(0),
    expected: { prestige_class: 0, prestige_family: 0, cognitive_interest: 0, achievement: 0, approval_classmates: 0, approval_teachers: 0, approval_parents: 0, punishment_school: 0, punishment_family: 0, social_necessity: 0, communication: 0, extracurricular_school: 0, self_realization: 0, classmates_influence: 0, family_influence: 0, school_influence: 0 },
  },
  {
    title: 'Проверка колоночного ключа: «Да» по пунктам 5, 11, 18, 24, 31 и 37 даёт сумму 1 в 4а и среднее 1 по шкале влияния одноклассников',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [5, 11, 18, 24, 31, 37].includes(index + 1) ? 1 : 0])),
    expected: { prestige_class: 0, prestige_family: 0, cognitive_interest: 0, achievement: 0, approval_classmates: 3, approval_teachers: 0, approval_parents: 0, punishment_school: 0, punishment_family: 0, social_necessity: 0, communication: 3, extracurricular_school: 0, self_realization: 0, classmates_influence: 1, family_influence: 0, school_influence: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lepeshova-school-motivation-2007-v1',
};
