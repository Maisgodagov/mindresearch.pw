import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
  { value: '-1', label: 'Не знаю' },
];

const prompts = [
  'Уверен, что помочь ему (ей) могут только самые строгие меры.',
  'Когда смотрю на него (нее), думаю, что судьба ко мне несправедлива.',
  'Я никогда не знаю, что у него (нее) на уме.',
  'Порой думаю: «Было бы лучше, если бы он (она) куда-нибудь исчез (ла)».',
  'Что бы мы с ним (ней) ни делали, он (она) становится все хуже.',
  'Окружающие считают меня виноватым (виноватой) в том, что происходит с ним (ней).',
  'Нередко он (она) исчезает, и я не знаю, что с ним (ней).',
  'Никто из окружающих не хочет помочь мне.',
  'Он (она) не считается со мной.',
  'Бывает, что мне неприятно иметь с ним (ней) дело.',
  'Я никогда не знаю, что он (она) еще выкинет.',
  'Он (она) относится ко мне враждебно.',
  'К нему (ней) невозможно найти подход.',
  'Из-за него (нее) у меня испорчены отношения со многими людьми.',
  'Он (она) все скрывает от меня.',
  'Если бы его (ее) не было, моя жизнь была бы счастливой и интересной.',
  'Даже если он (она) твердо решит стать лучше, я знаю: все равно он (она) останется таким (ой), как был (а).',
  'Мне стыдно, когда говорят о нем (ней).',
  'Он (она) постоянно обманывает меня.',
  'Его (ее) исправление (выздоровление) очень мало зависит от меня.',
];

const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_463_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_463',
  title: 'Конструктивно-деструктивная семья (КДС)',
  description: 'КДС оценивает характер отношения наиболее вовлеченного члена семьи к родственнику, создающему основные трудности, в семьях с проблемным членом (в исходном описании — при алкогольных проблемах, дезадаптации подростка или психическом заболевании). Четыре шкалы охватывают ощущение возможностей влиять на ситуацию, фрустрацию, понимание поведения родственника и отчуждение; общий показатель помогает специалисту различать конструктивную, неопределенную и деструктивную направленность отношений.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: -1,
  max: 1,
  scales: [
    { key: 'influence', label: 'Влияние', items: [1, 5, 9, 13, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'frustration', label: 'Фрустрация', items: [2, 6, 10, 14, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'information', label: 'Информация', items: [3, 7, 11, 15, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'alienation', label: 'Отчуждение', items: [4, 8, 12, 16, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'destructiveTotal', label: 'Общий показатель деструктивных реакций (сумма D)', items: Array.from({ length: 20 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нулевой балл по каждому пункту дает нули по четырем шкалам и общей сумме.',
    answers: Object.fromEntries(Array.from({ length: 20 }, (_, index) => [String(index + 1), 0])),
    expected: { influence: 0, frustration: 0, information: 0, alienation: 0, destructiveTotal: 0 },
  },
  {
    title: 'Ручная проверка: согласие по всем пунктам дает по 5 баллов на шкалу и 20 по сумме D.',
    answers: Object.fromEntries(Array.from({ length: 20 }, (_, index) => [String(index + 1), 1])),
    expected: { influence: 5, frustration: 5, information: 5, alienation: 5, destructiveTotal: 20 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'eidemiller-yustickis-kds-1987-20-items-dk-response-key-v1',
};
