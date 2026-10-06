import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items: Array<{ text: string; scale: 'information' | 'learning' | 'goals' | 'protection' | 'control' | 'adaptation' }> = [
  { text: 'Нередко я одним из последних узнаю о каких-то заметных событиях или планах в организации', scale: 'information' },
  { text: 'Я ощущаю, что временами недостаточно информирован(а) о том, что происходит в группе', scale: 'information' },
  { text: 'В этой группе я не вижу перспективу дальнейшего своего профессионального или личностного развития', scale: 'learning' },
  { text: 'На мой взгляд, пребывание в этой группе даёт мне мало возможностей для приобретения нового опыта, знаний и умений', scale: 'learning' },
  { text: 'Мне достаточно трудно достигать своих индивидуальных целей в этой группе', scale: 'goals' },
  { text: 'Некоторые мои важные желания часто не находят отклика у членов нашей группы', scale: 'goals' },
  { text: 'Мне не хватает признания меня как личности или работника со стороны других членов нашей группы', scale: 'goals' },
  { text: 'Некоторые мои интересы или устремления могут быть не поняты и не поддержаны другими в нашей группе', scale: 'goals' },
  { text: 'Если кто-то из сотрудников другого коллектива (клиентов и др.) будет со мной обращаться пренебрежительно или агрессивно, то сомневаюсь, что члены нашей группы за меня заступятся', scale: 'protection' },
  { text: 'Если кто-то из сотрудников другого коллектива (клиентов и др.) будет без причины в чём-то меня обвинять или критиковать, то не уверен(а), что члены нашей группы за меня вступятся', scale: 'protection' },
  { text: 'Если некоторые коллеги будут совершать неблагожелательные поступки, то эти поступки останутся без внимания в нашей группе', scale: 'control' },
  { text: 'Если некоторые члены будут нарушать негласные правила поведения и общения, то это не вызовет должной реакции в нашей группе', scale: 'control' },
  { text: 'Если в группе окажется новичок, то вряд ли ему будут помогать в работе', scale: 'adaptation' },
  { text: 'Сомневаюсь, что новому члену группы будут подсказывать, что можно делать, а что не следует', scale: 'adaptation' },
];

const responseOptions = [
  { value: '1', label: 'Полностью согласен' },
  { value: '2', label: 'Промежуточная степень согласия — несогласия (2)' },
  { value: '3', label: 'Промежуточная степень согласия — несогласия (3)' },
  { value: '4', label: 'Промежуточная степень согласия — несогласия (4)' },
  { value: '5', label: 'Промежуточная степень согласия — несогласия (5)' },
  { value: '6', label: 'Полностью не согласен' },
];

const parts = [
  { suffix: 'subgroup', heading: 'Среди тех, с кем поддерживаю тесные отношения' },
  { suffix: 'group', heading: 'В группе в целом' },
] as const;

const questions: SeedSection['questions'] = parts.flatMap(({ suffix, heading }) => items
  .filter((item) => !(suffix === 'subgroup' && item.text.startsWith('Мне не хватает признания меня')))
  .map((item) => ({
    code: `test_2560_${suffix}_${items.indexOf(item) + 1}`,
    text: `${heading}. ${item.text}`,
    type: 'single' as const,
    required: true,
    options: responseOptions,
  })));

export const instrument: SeedSection = {
  code: 'test_2560',
  title: 'Экспресс-опросник функций производственной группы и неформальных подгрупп',
  description: 'Методика измеряет, в какой степени производственная группа и близкая неформальная подгруппа выполняют для своих членов шесть функций: информирование, научение и развитие, поддержку индивидуальных целей и потребностей, защиту от внешних социальных угроз, контроль и регуляцию, адаптирование новичков. Полная версия подходит для работников производственных групп, отделов и смен и позволяет сопоставить восприятие группы в целом и тесного круга коллег; сокращённая версия оценивает только группу в целом.',
  questions,
};

const scaleItems: Record<string, number[]> = {
  information: [1, 2], learning: [3, 4], goals: [5, 6, 7, 8], protection: [9, 10], control: [11, 12], adaptation: [13, 14],
};
const scaleLabels: Record<string, string> = {
  information: 'Информирование', learning: 'Научение и развитие', goals: 'Обеспечение возможности реализации индивидуальных целей и потребностей', protection: 'Защита от внешнегрупповых угроз', control: 'Контроль и регуляция', adaptation: 'Адаптирование',
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: parts.flatMap(({ suffix }) => Object.entries(scaleItems).map(([key, indexes]) => ({
    key: `${suffix}_${key}`,
    label: `${suffix === 'group' ? 'В группе в целом' : 'Среди тех, с кем поддерживаю тесные отношения'} — ${scaleLabels[key]}`,
    items: indexes.map((index) => suffix === 'group' ? index + 14 : index),
    reverseItems: [],
    aggregation: 'sum' as const,
  }))),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальное согласие (ответ 1) даёт сумму 2 по двум пунктам информирования в обеих частях',
    answers: Object.fromEntries(questions.map((question) => [question.code.replace('test_2560_', ''), '1'])),
    expected: { subgroup_information: 2, group_information: 2 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['work-organization'],
  scoringConfig,
  validationCases,
  formulaVersion: 'sidorenkov-ignatov-shroo-eribekyan-obukhova-2024-14item-six-functions-two-sections-sum-v1',
};
