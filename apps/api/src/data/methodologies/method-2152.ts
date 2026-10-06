import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Совсем не свойственно мне' },
  { value: '2', label: 'Скорее не свойственно мне' },
  { value: '3', label: 'Иногда свойственно, иногда нет' },
  { value: '4', label: 'Скорее характерно для меня' },
  { value: '5', label: 'Полностью характерно для меня' },
];

const items = [
  'Неопределенность мешает мне придерживаться твердого, непоколебимого мнения.',
  'Быть в состоянии неопределенности — это быть неорганизованным.',
  'Неопределенность делает жизнь невыносимой.',
  'Это несправедливо — не иметь никаких гарантий в жизни.',
  'Я не могу расслабиться, если я не знаю, что будет завтра.',
  'Неопределенность вызывает у меня беспокойство, тревогу и стресс.',
  'Непредвиденные события сильно меня расстраивают.',
  'Меня расстраивает, что у меня нет всей необходимой информации.',
  'Неопределенность не дает мне жить полной жизнью.',
  'Всегда нужно смотреть вперед, чтобы избежать неожиданностей.',
  'Даже при самом лучшем планировании, какое-то маленькое непредвиденное событие может всё испортить.',
  'Когда приходит время действовать, неопределенность парализует меня.',
  'Быть в состоянии неопределенности означает, что я не идеален(-а).',
  'Когда я в состоянии неопределенности, я не могу идти вперед.',
  'Когда я в состоянии неопределенности, я не могу действовать продуктивно.',
  'В отличие от меня, другие выглядят так, будто всегда знают, как им жить и что делать дальше.',
  'Неопределенность делает меня уязвимым(-ой), несчастным(-ой) или грустным(-ой).',
  'Я всегда хочу знать, что меня ждет в будущем.',
  'Терпеть не могу, когда меня застают врасплох.',
  'Малейшее сомнение может помешать мне действовать.',
  'Я должен(-а) иметь возможность всё организовывать заранее.',
  'Быть в состоянии неопределенности означает то, что мне не хватает уверенности.',
  'Думаю, что это несправедливо, что другие выглядят уверенными в своем будущем.',
  'Неопределенность мешает мне хорошо спать.',
  'Я должен(-а) избегать всех ситуаций неопределённости.',
  'Двусмысленность в жизни вводит меня в состояние стресса.',
  'Терпеть не могу оставаться в состоянии неопределенности относительно моего будущего.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2166_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2166',
  title: 'Шкала интолерантности к неопределённости (IUS)',
  description: 'Оценивает выраженность интолерантности к неопределённости: переживание неопределённости как неприемлемой, стрессовой и мешающей действовать, планировать и сохранять уверенность. Русскоязычная 27-пунктовая версия апробирована на взрослых пациентах с хроническими соматическими заболеваниями; исследовательская публикация допускает применение в дальнейших русскоязычных исследованиях, но отдельно отмечает необходимость проверки на здоровых людях.',
  questions,
};

const allItems = Array.from({ length: 27 }, (_, index) => index + 1);
const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общий показатель интолерантности к неопределённости', items: allItems, reverseItems: [], aggregation: 'sum' },
    { key: 'distress_action', label: 'Неопределённость расстраивает и приводит к неспособности действовать', items: [7, 12, 14, 15, 17, 20, 22, 23], reverseItems: [], aggregation: 'sum' },
    { key: 'cannot_relax', label: 'Неопределённость не дает расслабиться', items: [3, 4, 5, 6, 8, 9, 27], reverseItems: [], aggregation: 'sum' },
    { key: 'planning_productivity', label: 'Неопределённость мешает планированию и продуктивности в жизни', items: [1, 11, 18, 19, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'stress_avoidance', label: 'Неопределённость вызывает стресс, и ее следует избегать', items: [16, 24, 25, 26], reverseItems: [], aggregation: 'sum' },
    { key: 'imperfection_disorganization', label: 'Быть в состоянии неопределенности — это быть неидеальным и неорганизованным', items: [2, 10, 13], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы минимальны', answers: Object.fromEntries(allItems.map(item => [String(item), 1])), expected: { total: 27, distress_action: 8, cannot_relax: 7, planning_productivity: 5, stress_avoidance: 4, imperfection_disorganization: 3 } },
  { title: 'Все ответы максимальны', answers: Object.fromEntries(allItems.map(item => [String(item), 5])), expected: { total: 135, distress_action: 40, cannot_relax: 35, planning_productivity: 25, stress_avoidance: 20, imperfection_disorganization: 15 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ius-27-ru-tkhostov-nelyubina-2022-v1',
};
