import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const perceptionItems = [
  'Жёлтый одуванчик', 'Портрет Пушкина', 'Горный пейзаж',
  'Пение птиц', 'Шорох листвы в осеннем парке', 'Звук волн, прибоя',
  'Рукопожатие', 'Прикосновение к лицу', 'Объятия',
  'Запах свежескошенной травы', 'Запах мокрого асфальта', 'Запах душистого мыла',
  'Вкус кофе', 'Вкус соли', 'Вкус спелого томата',
];
const socialItems = [
  'Отношу себя к людям, которые при взаимодействии с другими людьми полагаются только на собственное мнение',
  'Отношу себя к людям, которые, осуществляя ту или иную деятельность, всегда согласуют свои действия с действиями окружающих',
  'Отношу себя к людям, которые при выполнении какой-либо совместной деятельности всегда предлагают соучастникам свою помощь',
  'Обычно я не вижу препятствий и строго следую поставленной мною цели',
  'Перед важным действием я всегда взвешиваю все «за» и «против» и согласую свою позицию с позициями других участников',
  'Предпочитаю действовать в группе согласованно, обсуждать проблему и совместно искать ее решение',
  'Считаю, что действовать всегда нужно самостоятельно, используя любую возможность достижения цели без оглядки на других',
  'Считаю, что в совместных действиях нельзя ущемлять интересы других участников',
  'Считаю, что любое решение о совместной деятельности должно быть достигнуто в процессе обсуждения мнения каждого участника',
];
const activityPairs: [string, string][] = [
  ['Подолгу смотреть на волны моря, в морскую даль', 'Входить в воду, плескаться, плавать'],
  ['Наблюдать играющих во что-либо детей', 'Включиться в игру с детьми'],
  ['Загорать на пляже, лежа на песке, подставляясь лучам солнца', 'Загорать «подвижно», в процессе прогулки или игр на пляже'],
  ['Рассматривать деревья в лесу, любоваться полянами, обитателями леса', 'Собирать грибы, подбирать шишки, веточки и др.'],
  ['Наблюдать за сервировкой стола, рассматривать украшения стола', 'Помогать в сервировке стола, украшать его и др.'],
  ['Пассивно наблюдать за рабочим процессом на производстве', 'Мысленно погружаться в процесс, представлять свои действия'],
  ['Отдаваться своему восприятию, мыслям, воображению и т.д.', 'Записывать свои новые мысли, оригинальные идеи, яркие воспоминания и т.д.'],
  ['Спокойно слушать приятную песню, мелодию', 'Тихо подпевать, двигаться в такт'],
  ['Рассматривать художественные произведения в музее, оставляя впечатления в себе', 'Интересоваться историей создания произведения, судьбой его автора и т.д.'],
  ['Находясь в компании, смотреть телепередачу молча', 'Активно обсуждать видеосюжет с друзьями'],
  ['Наслаждаться одиночеством, отдаваться собственным мыслям, воображению', 'Наслаждаться беседой, активно проводить время с друзьями'],
  ['Молча поддерживать разговор', 'Быть инициатором разговора, активно в нём участвовать'],
  ['Увлечённо смотреть познавательный телеканал, YouTube и т.д. – по случаю, не выбирая сюжета', 'Искать для просмотра интересующие познавательные сюжеты'],
  ['Узнавать о мире из учебников, книг и т.д.', 'Познавать мир, путешествуя, беседуя с бывалыми людьми и т.д.'],
  ['Осваивая новую информацию, оставаться в заранее определённых рамках', 'Искать дополнительные источники информации и обсуждать полученные сведения со знакомыми'],
];
const numericOptions = (values: number[], labels: string[]) => values.map((value, i) => ({ value: String(value), label: labels[i] }));
const perceptionOptions = numericOptions([0, 1, 2, 3, 4], ['Нет представления (образа)', 'Едва заметное представление (образ)', 'Более выраженное представление (образ)', 'Отчётливо выраженное представление (образ)', 'Очень яркое представление (живой образ)']);
const socialOptions = numericOptions([-2, -1, 0, 1, 2], ['Совершенно не согласен', 'Не вполне согласен', 'Затрудняюсь ответить', 'Скорее согласен', 'Полностью согласен']);
const activityOptions = numericOptions([1, 2, 3, 4, 5], ['Минимальная выраженность', 'Невысокая выраженность', 'Умеренная выраженность', 'Выраженная активность', 'Максимальная активность']);
const questions: SeedSection['questions'] = [
  ...perceptionItems.map((text, i) => ({ code: `test_1842_${i + 1}`, text, type: 'single' as const, required: true, options: perceptionOptions })),
  ...socialItems.map((text, i) => ({ code: `test_1842_${i + 16}`, text, type: 'single' as const, required: true, options: socialOptions })),
  ...activityPairs.flatMap(([contemplation, activity], i) => [
    { code: `test_1842_${31 + i * 2}`, text: `Созерцательная форма активности: ${contemplation}`, type: 'single' as const, required: true, options: activityOptions },
    { code: `test_1842_${32 + i * 2}`, text: `Деятельностная форма активности: ${activity}`, type: 'single' as const, required: true, options: activityOptions },
  ]),
];
export const instrument: SeedSection = {
  code: 'test_1842',
  title: 'Тест преобладающего типа сознания (ТПТС)',
  description: 'Комплекс из трёх авторских шкал для описания сенсорно-перцептивного профиля, установок в социальных отношениях и соотношения созерцательной и деятельностной активности в сферах досуга, труда, творчества, общения и познания. Предназначен для исследования индивидуальных особенностей сознания; эта версия соответствует материалам Акопова, Дергуновой и Семеновой (2022).',
  questions,
};

const responseScores = (items: number[], values: number[]) => Object.fromEntries(items.map(item => [item, Object.fromEntries(values.map(v => [String(v), v]))]));
const domainNames = ['Досуг', 'Труд', 'Творчество', 'Общение', 'Познание'];
const scoringConfig: ConfigurableScoring = {
  min: -2, max: 5,
  scales: [
    ...['Визуальная', 'Аудиальная', 'Тактильная', 'Ольфакторная', 'Вкусовая'].map((label, i) => {
      const items = [i * 3 + 1, i * 3 + 2, i * 3 + 3];
      return { key: ['visual', 'auditory', 'tactile', 'olfactory', 'taste'][i], label: `${label} модальность`, items, reverseItems: [], aggregation: 'sum' as const, itemScores: responseScores(items, [0, 1, 2, 3, 4]) };
    }),
    ...[
      { key: 'directive', label: 'Директивная установка', items: [16, 19, 22] },
      { key: 'conventional', label: 'Конвенциональная установка', items: [17, 20, 23] },
      { key: 'consolidating', label: 'Консолидирующая установка', items: [18, 21, 24] },
    ].map(scale => ({ ...scale, reverseItems: [], aggregation: 'sum' as const, itemScores: responseScores(scale.items, [-2, -1, 0, 1, 2]) })),
    ...(['Созерцание', 'Деятельность'] as const).flatMap((pole, p) => domainNames.map((domain, d) => {
      const items = Array.from({ length: 3 }, (_, j) => 31 + 2 * (d * 3 + j) + p);
      return { key: `${p === 0 ? 'contemplation' : 'activity'}_${['leisure', 'work', 'creative', 'communication', 'cognitive'][d]}`, label: `${pole}: ${domain}`, items, reverseItems: [], aggregation: 'sum' as const, itemScores: responseScores(items, [1, 2, 3, 4, 5]) };
    })),
  ],
};
const validationAnswers = Object.fromEntries([
  ...Array.from({ length: 15 }, (_, i) => [String(i + 1), '4']),
  ...Array.from({ length: 9 }, (_, i) => [String(i + 16), '2']),
  ...Array.from({ length: 30 }, (_, i) => [String(i + 31), '5']),
]);
const validationCases: ValidationCase[] = [{
  title: 'Ручная проверка: максимум по всем ответам', answers: validationAnswers,
  expected: {
    visual: 12, auditory: 12, tactile: 12, olfactory: 12, taste: 12,
    directive: 6, conventional: 6, consolidating: 6,
    contemplation_leisure: 15, contemplation_work: 15, contemplation_creative: 15, contemplation_communication: 15, contemplation_cognitive: 15,
    activity_leisure: 15, activity_work: 15, activity_creative: 15, activity_communication: 15, activity_cognitive: 15,
  },
}];
export const methodology: MethodologyRegistration = { instrument, scoringConfig, validationCases, formulaVersion: 'akopov-dergunova-semenova-tpts-2022-v1' };
