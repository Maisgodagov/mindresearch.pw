import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Не могу решить' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Смерть, несомненно, – это страшное испытание.',
  'Знание о том, что я когда-нибудь умру, вызывает у меня тревогу.',
  'Я любой ценой избегаю мыслей о смерти.',
  'Я верю, что после смерти буду пребывать на небесах.',
  'Смерть положит конец всем моим бедам.',
  'Смерть необходимо понимать как естественное, неоспоримое и неизбежное событие.',
  'Меня расстраивает то, что со смертью все для меня закончится.',
  'Смерть – это вход в место самого большого блаженства.',
  'Смерть дает выход из этого ужасного мира.',
  'Если мысль о смерти приходит мне в голову, я стараюсь выбросить ее оттуда.',
  'Смерть есть избавление от боли и страданий.',
  'Я стараюсь никогда не думать о смерти.',
  'Я верю, что небеса являются лучшим местом по сравнению с этим миром.',
  'Смерть является естественной стороной жизни.',
  'Смерть является единением с Богом и вечным блаженством.',
  'Смерть дает надежду на новую и чудесную жизнь.',
  'Я смерти не боюсь, но и не приветствую ее.',
  'Я испытываю сильный страх смерти.',
  'Я вообще стараюсь избегать думать о смерти.',
  'Тема жизни после смерти очень сильно волнует меня.',
  'Меня пугает знание о том, что смерть будет концом всего.',
  'Я надеюсь, что после смерти воссоединюсь со своими близкими людьми.',
  'Я рассматриваю смерть как освобождение от земных страданий.',
  'Смерть является просто частью процесса жизни.',
  'Я представляю смерть как переход в вечный и счастливый мир.',
  'Я стараюсь не затрагивать тему смерти.',
  'Смерть предлагает чудесный отдых для души.',
  'Вера в жизнь после смерти является единственным средством, которое утешает меня при столкновении со смертью.',
  'Я представляю смерть как отдых от бремени этой жизни.',
  'Смерть – ни плоха, ни хороша.',
  'Я предвкушаю жизнь после смерти.',
  'Меня беспокоит неопределенность знания о том, что будет после смерти.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1496_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1496',
  title: 'Профиль аттитьюдов по отношению к смерти (DAP-R)',
  description: 'DAP-R оценивает многомерные установки к смерти у взрослых: страх смерти, избегание мыслей о ней, нейтральное принятие смерти как естественной части жизни, религиозно окрашенное принятие смерти как перехода к благой загробной жизни и принятие смерти как избавления от страданий. Пять отдельных профилей помогают автору опроса различать эти отношения, не сводя их к единому показателю тревоги; здесь представлена полная 32-пунктовая русская форма Гавриловой (2011), а не сокращённая адаптация.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'fearOfDeath', label: 'Страх смерти', items: [1, 2, 7, 18, 20, 21, 32], reverseItems: [], aggregation: 'mean' },
    { key: 'deathAvoidance', label: 'Избегание смерти', items: [3, 10, 12, 19, 26], reverseItems: [], aggregation: 'mean' },
    { key: 'neutralAcceptance', label: 'Нейтральное принятие', items: [6, 14, 17, 24, 30], reverseItems: [], aggregation: 'mean' },
    { key: 'approachAcceptance', label: 'Принятие как перехода к загробной жизни', items: [4, 8, 13, 15, 16, 22, 25, 27, 28, 31], reverseItems: [], aggregation: 'mean' },
    { key: 'escapeAcceptance', label: 'Принятие как избавления от страданий', items: [5, 9, 11, 23, 29], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка ключа на равных ответах: среднее каждой шкалы равно 4',
    answers: Object.fromEntries(Array.from({ length: 32 }, (_, index) => [String(index + 1), 4])),
    expected: { fearOfDeath: 4, deathAvoidance: 4, neutralAcceptance: 4, approachAcceptance: 4, escapeAcceptance: 4 },
  },
  {
    title: 'Ручная сверка границ: минимальные ответы дают 1 по всем шкалам',
    answers: Object.fromEntries(Array.from({ length: 32 }, (_, index) => [String(index + 1), 1])),
    expected: { fearOfDeath: 1, deathAvoidance: 1, neutralAcceptance: 1, approachAcceptance: 1, escapeAcceptance: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'dap-r-wong-reker-gesser-1994-gavrilova-2011-32item-mean-v1',
};
