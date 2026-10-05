import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Чувствовал(-а) себя ненужным(-ой)',
  'Чувствовал(-а) себя одиноко',
  'На меня не обращали внимания',
  'Чувствовал(-а) себя лишним(-ей) в кампании людей',
  'Слышал(-а) за своей спиной смех',
  'Внезапно стал(-а) плохо себя чувствовать',
  'Чувствовал(-а) себя заболевшим(-ей), испытывал(-а) недомогание, физический дискомфорт, боль',
  'Общался(-ась) с незнакомыми, малознакомыми людьми',
  'Я был(-а) смущен(-а), чувствовал(-а) себя неловко',
  'Думал(-а) о своем будущем',
  'Пришлось долго ждать чего-то (транспорт, окончание учебного дня, очередь и пр.)',
  'Очень много думал(-а) о своих делах',
  'Не мог(-ла) справиться с домашним заданием',
  'Не было времени заняться интересным делом',
  'Пришлось слушать, как кто-то говорит что-то неинтересное',
  'Потратил(-а) на учебу больше времени, чем ожидал(-а)',
  'Отвечал(-а) у доски, выступал(-а) перед одноклассниками',
  'Испытывал(-а) волнение, когда учитель смотрел по журналу, кого бы спросить',
  'Проиграл(-а) в споре',
  'На уроке учитель неожиданно задал мне вопрос',
  'Окружающие замолчали, когда я подошел(-ла)',
  'Требовалось обратиться с вопросом, просьбой к незнакомому человеку',
  'Был(-а) осмеян(-а), надо мной подшучивали окружающие',
  'Получил(-а) плохие новости',
  'Были тяжелые дни',
  'Казалось, что нечто необъяснимое могло помешать добиться желаемого',
  'Оказался(-ась) в темноте, видел(-а) неясные силуэты, слышал(-а) непонятные шорохи',
  'Слышал(-а) предсказания о катастрофах',
  'Хотел(-а) быть лучше кого-то',
  'После контрольной учитель вслух зачитывал отметки',
  'Думал(-а) о своей привлекательности для других людей',
  'Сравнивал(-а) себя с другими',
  'Был(-а) недоволен(-на) своей внешностью',
  'Не смог(-ла) ответить у доски',
  'Не смог(-ла) выступить так хорошо, как хотелось бы',
  'Потратил(-а) больше денег, чем планировал(-а)',
  'Пришлось брать деньги в долг',
  'Не хватило денег на покупку чего-либо; не смог (-ла) купить то, что хотел(-а)',
  'Ел(-а) невкусную, пресную, сухую пищу',
  'Пришлось сильно экономить',
  'Меня критиковали, в чем- то обвиняли',
  'Пришлось находиться рядом с неприятным человеком',
  'Меня обзывали',
  'Осуждали мой внешний вид',
  'Общался(-ась) с людьми, которые мне не интересны',
  'Чувствовал(-а) осуждение со стороны одноклассников, друзей',
  'Меня перебивали, не слушали',
  'Было неприятное знакомство, неприятная встреча',
  'Писал(-а) контрольную работу',
  'Думал(-а) об экзаменах, контрольной работе, важном задании',
  'Учитель делал мне замечание, ругал меня',
  'Не понимал(-а) объяснений учителя',
  'Получил(-а) не ту оценку, которую ожидал(-а)',
  'Оценивалась моя работа',
  'Чувствовал(-а) сильную усталость после занятий, работы',
  'Не хватило времени на отдых, сон',
  'Оценивали мои способности',
  'Разговаривал(-а) с классным руководителем, директором, учителем',
  'Был серьезный разговор со взрослыми',
  'Меня ругал кто-то из взрослых',
  'Родители не отпустили гулять',
  'Были конфликты, скандалы с родными',
  'Был получен запрет на использование гаджетов, компьютера',
  'Меня ругали за оценки в школе',
  'Не соглашался(-лась) с родителями',
];

const domains = [
  { key: 'loneliness_wellbeing', label: 'Одиночество, самочувствие', from: 1, to: 9 },
  { key: 'affairs_planning', label: 'Дела, планирование', from: 10, to: 16 },
  { key: 'fears_worry', label: 'Страхи, беспокойство', from: 17, to: 25 },
  { key: 'mystical_fears', label: 'Мистические страхи', from: 26, to: 28 },
  { key: 'self_attitude', label: 'Самоотношение', from: 29, to: 35 },
  { key: 'finances', label: 'Финансы', from: 36, to: 40 },
  { key: 'rejection', label: 'Отвержение', from: 41, to: 48 },
  { key: 'school_study', label: 'Школа, учеба', from: 49, to: 57 },
  { key: 'communication_elders', label: 'Общение со старшими', from: 58, to: 65 },
];

const questions: SeedSection['questions'] = items.flatMap((text, index) => {
  const n = index + 1;
  return [
    { code: `test_1148_${n}_occurred`, text, type: 'single' as const, required: true, options: [
      { value: '0', label: 'Не было' }, { value: '1', label: 'Было' },
    ] },
    { code: `test_1148_${n}_intensity`, text: `Сила переживания события: ${text}`, type: 'single' as const, required: true,
      options: [{ value: '0', label: 'События не было' }, ...Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))] },
  ];
});

export const instrument: SeedSection = {
  code: 'test_1148',
  title: 'Опросник повседневных стрессоров для подростков',
  description: 'Авторский опросник Л. А. Головей и О. С. Галашевой оценивает повседневную стрессовую нагрузку подростков 13–17 лет за последние две недели. Он охватывает девять сфер внутренней жизни и внешней среды — от одиночества и самоотношения до учебы, общения со старшими и финансов — и позволяет автору опроса отдельно увидеть частоту событий и субъективную силу их переживания.',
  questions,
};

const occurredItems = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => 2 * (from + i) - 1);
const intensityItems = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => 2 * (from + i));

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 10,
  scales: domains.flatMap(domain => [
    { key: `${domain.key}_event_count`, label: `${domain.label}: количество событий`, items: occurredItems(domain.from, domain.to), reverseItems: [], aggregation: 'count-option' as const, optionValue: '1' },
    { key: `${domain.key}_intensity_sum`, label: `${domain.label}: сила переживания`, items: intensityItems(domain.from, domain.to), reverseItems: [], aggregation: 'sum' as const },
  ]),
};

const none = Object.fromEntries(items.flatMap((_, i) => [[String(2 * i + 1), '0'], [String(2 * i + 2), 0]]));
const noneExpected = Object.fromEntries(scoringConfig.scales.map(scale => [scale.key, 0]));
const sample = { ...none, '1': '1', '2': 4, '19': '1', '20': 3 };
const sampleExpected = Object.fromEntries(scoringConfig.scales.map(scale => [scale.key,
  scale.key === 'loneliness_wellbeing_event_count' ? 1
    : scale.key === 'loneliness_wellbeing_intensity_sum' ? 4
      : scale.key === 'fears_worry_event_count' ? 1
        : scale.key === 'fears_worry_intensity_sum' ? 3 : 0,
]));

export const validationCases: ValidationCase[] = [
  { title: 'Все события отсутствуют', answers: none, expected: noneExpected },
  { title: 'Два события отмечены с интенсивностью 4 и 3', answers: sample, expected: sampleExpected },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'golovey-galasheva-daily-stressors-adolescents-2024-v1',
};
