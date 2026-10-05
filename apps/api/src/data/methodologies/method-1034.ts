import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '4', label: 'Полностью согласен' },
  { value: '3', label: 'Согласен в большей степени, чем не согласен' },
  { value: '2', label: 'В большей степени не согласен, чем согласен' },
  { value: '1', label: 'Полностью не согласен' },
];

const blocks = [
  {
    key: 'profession',
    label: 'Отношение к педагогической профессии',
    items: [
      'Учитель — главная фигура, от него зависит успех и эффективность учебного процесса.',
      'Основная задача учителя — вооружать детей знаниями, умениями, навыками.',
      'Быть педагогом — значит быть примером для детей.',
      'Творчество учителя лишь благое пожелание, реально его деятельность полностью регламентирована.',
      'Выполняй точно все указания администрации, и у тебя будет меньше хлопот.',
      'Педагогическая профессия неблагодарна.',
    ],
  },
  {
    key: 'children',
    label: 'Отношение к детям',
    items: [
      'По своей природе дети эгоистичны.',
      'Хорошим можно назвать ребёнка, который выполняет все требования учителя.',
      'Девочки в школе более послушны и аккуратны, чем мальчики.',
      'Мальчики в школе более подвижны и активны, чем девочки.',
      'Плохой ребёнок — это конфликтный, упрямый и неуправляемый ребёнок.',
      'Воспитание детей — разрушительная работа для нервов.',
    ],
  },
  {
    key: 'parents',
    label: 'Отношение к родителям',
    items: [
      'Большинство родителей не занимаются воспитанием своих детей.',
      'Родители предъявляют завышенные требования к школе.',
      'Основную ответственность за воспитание детей несёт семья, а не школа.',
      'Дети часто повторяют судьбу своих родителей.',
      'Дети с проблемами в развитии, как правило, из неблагополучных семей.',
      'Основное бремя в воспитании детей в семье ложится на мать.',
    ],
  },
  {
    key: 'methods',
    label: 'Отношение к методам обучения и воспитания',
    items: [
      'Наказание не лучшая мера, но оно необходимо.',
      'Деятельность детей нуждается в постоянном контроле.',
      'Хорошая дисциплина — залог успеха в воспитании и обучении.',
      'Ребёнку нельзя прощать его провинности.',
      'Необходимо учитывать индивидуальные особенности ребёнка — миф, в реальных условиях осуществить это невозможно.',
      'В воспитании детей нужно сочетать методы «кнута» и «пряника».',
    ],
  },
];

const items = blocks.flatMap(block => block.items);
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1064_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1064',
  title: 'Опросник на выявление уровня стереотипности педагогов',
  description: 'Опросник И. А. Бучиловой оценивает выраженность профессиональных стереотипов у воспитателей дошкольных учреждений в четырёх областях: представления о педагогической профессии, детях, родителях и методах обучения и воспитания. Результаты помогают автору опроса увидеть, какие установки требуют обсуждения и рефлексии в педагогической практике.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: blocks.map((block, index) => ({
    key: block.key,
    label: block.label,
    items: Array.from({ length: 6 }, (_, itemIndex) => index * 6 + itemIndex + 1),
    reverseItems: [],
    aggregation: 'sum' as const,
  })),
};

const answersWith = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы — полное несогласие', answers: answersWith(1), expected: { profession: 6, children: 6, parents: 6, methods: 6 } },
  { title: 'Все ответы — полное согласие', answers: answersWith(4), expected: { profession: 24, children: 24, parents: 24, methods: 24 } },
  {
    title: 'Ручная проверка порога выраженного уровня: три блока достигают 16',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index < 18 ? 3 : 2])),
    expected: { profession: 18, children: 18, parents: 18, methods: 12 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'buchilova-pedagogical-stereotypes-four-block-sum-1-4-v1',
};
