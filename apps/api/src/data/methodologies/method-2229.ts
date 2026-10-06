import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно верно (всегда)' },
  { value: '2', label: 'Верно в большинстве случаев' },
  { value: '3', label: 'Нечто среднее' },
  { value: '4', label: 'Не совсем верно / скорее неверно' },
  { value: '5', label: 'Абсолютно неверно (никогда)' },
];

const items = [
  'При возникновении проблем я незамедлительно начинаю активно действовать',
  'После окончания рабочего дня я продолжаю думать о незавершенных или предстоящих рабочих делах',
  'Я работаю с интересными и достойными людьми, уважаю их чувства и мнения',
  'Я хорошо знаю свои собственные слабости и сильные качества, помогающие мне в работе',
  'В нашей организации работает довольно много людей, с которыми у меня теплые и доверительные отношения',
  'Мне нравится много работать, я получаю удовольствие от своей работы',
  'На работе мне часто неинтересно, я работаю только из-за денег',
  'Мне интересно встречаться, разговаривать и работать с людьми различных мировоззрений, отличающихся от моих точек зрения',
  'Часто в моей работе я берусь за большее, чем могу успеть сделать в реальное время',
  'В выходные дни я активно отдыхаю',
  'Я могу работать продуктивно только с теми, кто близок мне по духу (культуре, интересам, менталитету), или с теми, кто похож на меня',
  'Я работаю прежде всего для того, чтобы заработать себе на жизнь, а не потому, что я получаю удовольствие от своей работы',
  'В моей работе я всегда действую рационально, четко определяю приоритеты (первостепенные задачи)',
  'На работе я часто вступаю в спор с людьми, которые думают иначе, чем я',
  'Я испытываю беспокойство по поводу сохранения своей работы',
  'В моей жизни кроме работы я успеваю заняться многими другими интересными для меня делами в различных областях (развлечения, хобби, творчество…)',
  'Я расстраиваюсь, когда дело не получается так, как я хочу',
  'Часто я не знаю, как настоять на своем в спорных вопросах',
  'Я легко (без особого напряжения) нахожу выход из проблемных (трудных) рабочих ситуаций, мешающих мне достичь поставленных целей (задач)',
  'Я часто не согласен(а) с моим непосредственным начальником или вышестоящими руководителями',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2245_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2245',
  title: 'Шкала организационного стресса (ШОС)',
  description: 'ШОС Маклина в русскоязычной адаптации Н. Е. Водопьяновой оценивает восприимчивость работающего человека к организационному стрессу. Она охватывает самопознание и оценку рабочих ситуаций, широту интересов и восстановление, принятие иных ценностей, гибкость поведения, активность и продуктивность. Показатели помогают описать индивидуальную уязвимость к стрессу в профессиональной среде и сопоставить эти пять аспектов; версия включает 20 утверждений для работающих взрослых.',
  questions,
};

const allItems = Array.from({ length: 20 }, (_, i) => i + 1);
const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'selfKnowledge', label: 'Способность самопознания (когнитивность)', items: [4, 9, 13, 18], reverseItems: [9, 13], aggregation: 'sum' },
    { key: 'breadthOfInterests', label: 'Широта интересов', items: [2, 5, 7, 16], reverseItems: [2, 5, 16], aggregation: 'sum' },
    { key: 'acceptanceOfOthers', label: 'Принятие ценностей других', items: [3, 8, 14, 20], reverseItems: [14, 20], aggregation: 'sum' },
    { key: 'behavioralFlexibility', label: 'Гибкость поведения', items: [1, 11, 17, 19], reverseItems: [11, 17], aggregation: 'sum' },
    { key: 'activityProductivity', label: 'Активность и продуктивность', items: [6, 10, 12, 15], reverseItems: [12, 15], aggregation: 'sum' },
    { key: 'total', label: 'Общий индекс организационного стресса', items: allItems, reverseItems: [2, 5, 7, 9, 11, 12, 13, 14, 15, 17, 18, 20], aggregation: 'sum' },
  ],
};

const answers = (value: string) => Object.fromEntries(allItems.map((item) => [String(item), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «абсолютно верно»; проверка полного перекодирования обратных формулировок', answers: answers('1'), expected: { selfKnowledge: 14, breadthOfInterests: 10, acceptanceOfOthers: 12, behavioralFlexibility: 12, activityProductivity: 12, total: 68 } },
  { title: 'Все ответы «абсолютно неверно»; проверка минимального индекса после ключа', answers: answers('5'), expected: { selfKnowledge: 6, breadthOfInterests: 10, acceptanceOfOthers: 8, behavioralFlexibility: 8, activityProductivity: 8, total: 52 } },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ['work'],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mclean-oss-vodopyanova-1999-psytests-ru-v1',
};
