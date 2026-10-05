import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: '0', label: 'Нет' },
  { value: '1', label: 'Да' },
];

const questions: SeedSection['questions'] = [
  { code: 'test_862_1', text: 'За последние 12 месяцев, сколько дней вы употребляли более чем несколько глотков пива, вина или других алкогольных напитков? Укажите «0», если не употребляли.', type: 'number', required: true, validation: { min: 0, integer: true } },
  { code: 'test_862_2', text: 'За последние 12 месяцев, сколько дней вы употребляли любой вид марихуаны (марихуану, масла, парафины при курении, электронном курении, вдыхании паров или приёме в пищу) или «синтетическую марихуану» (например, «K2» или «Спайс»)? Укажите «0», если не употребляли.', type: 'number', required: true, validation: { min: 0, integer: true } },
  { code: 'test_862_3', text: 'За последние 12 месяцев, сколько дней вы употребляли что-либо ещё для достижения чувства «кайфа» (например, другие запрещённые наркотики, таблетки, лекарственные препараты без рецепта и вещества, которые можно нюхать, вдыхать или курить методом вейпинга, курить или вводить инъекционно)? Укажите «0», если не употребляли.', type: 'number', required: true, validation: { min: 0, integer: true } },
  { code: 'test_862_4', text: 'Садились ли вы когда-нибудь в машину, за рулём которой находился человек (включая вас) в состоянии алкогольного опьянения, под действием наркотиков или «под кайфом»?', type: 'single', required: true, options: yesNo },
  { code: 'test_862_5', text: 'Употребляли ли вы когда-либо алкоголь или наркотики, чтобы расслабиться, самоутвердиться или «вписаться»?', type: 'single', required: true, options: yesNo },
  { code: 'test_862_6', text: 'Употребляли ли вы когда-либо алкоголь или наркотики без друзей, в одиночку?', type: 'single', required: true, options: yesNo },
  { code: 'test_862_7', text: 'Забывали ли вы когда-нибудь то, что делали под влиянием алкогольных напитков или наркотиков?', type: 'single', required: true, options: yesNo },
  { code: 'test_862_8', text: 'Говорили ли вам когда-нибудь ваши родственники или друзья, что вам нужно меньше употреблять алкоголь или наркотики?', type: 'single', required: true, options: yesNo },
  { code: 'test_862_9', text: 'Попадали ли вы когда-нибудь в неприятности, находясь под влиянием алкогольных напитков или наркотиков?', type: 'single', required: true, options: yesNo },
];

export const instrument: SeedSection = {
  code: 'test_862',
  title: 'Опросник CRAFFT 2.1',
  description: 'Краткий скрининг употребления алкоголя и других психоактивных веществ, связанных рисков поездок за рулём или с нетрезвым водителем и проблем, связанных с употреблением. Предназначен для подростков и молодых людей; эта самозаполняемая версия включает частоту употребления за последние 12 месяцев и шесть вопросов CRAFFT. Результат помогает выявить необходимость дальнейшего клинического обсуждения и сам по себе не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [{ key: 'crafft', label: 'Сумма ответов «Да» по вопросам CRAFFT (0–6)', items: [4, 5, 6, 7, 8, 9], reverseItems: [], aggregation: 'count-option', optionValue: '1' }],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы на CRAFFT «Нет»', answers: { '1': 0, '2': 0, '3': 0, '4': '0', '5': '0', '6': '0', '7': '0', '8': '0', '9': '0' }, expected: { crafft: 0 } },
  { title: 'Ручная проверка: два ответа «Да» по CRAFFT', answers: { '1': 2, '2': 0, '3': 0, '4': '1', '5': '1', '6': '0', '7': '0', '8': '0', '9': '0' }, expected: { crafft: 2 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'crafft-2-1-six-yes-count-v1',
};
