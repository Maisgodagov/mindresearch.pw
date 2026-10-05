import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
  { value: '6', label: 'Полностью согласен' },
];

const statements = [
  'Когда что-то пошло не по плану, меня это сильно расстраивает.',
  'Новые и непривычные обстоятельства вызывают у меня настороженность.',
  'Мне нравится пробовать новое.',
  'Неопределенность меня пугает.',
  'Новые и непривычные обстоятельства вызывают у меня опасения.',
  'Если я расстроен, я понимаю причины.',
  'Я понимаю, как происходящее влияет на мое эмоциональное состояние.',
  'Если я расстроен, я анализирую причины.',
  'Я считаю, что в любом, даже самом неприятном, событии есть что-то полезное.',
  'Мне нравятся ситуации, в которых можно столкнуться с чем-то новым, неизведанным.',
  'Я понимаю, что у людей бывают разные точки зрения на один и тот же вопрос.',
  'Я чувствую, что обстоятельства управляют мной.',
  'Я люблю сталкиваться с событиями, которые позволяют по-новому взглянуть на привычные вещи.',
  'Я нахожусь в условиях, где остается только «плыть по течению».',
  'Даже в самых сложных обстоятельствах я могу выбрать, что я могу сделать.',
  'Я считаю, другие люди хотят видеть только позитивные эмоции.',
  'Я гораздо лучше себя чувствую в проверенных, известных ситуациях.',
  'Неприятные чувства я стараюсь просто игнорировать.',
  'Я чувствую себя заложником обстоятельств.',
  'Я считаю, что другие люди хотят получать только позитивные эмоции от общения со мной.',
  'Других не интересуют мои проблемы, поэтому нет смысла рассказывать им о своих отрицательных эмоциях.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_954_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_954',
  title: 'Опросник для измерения открытости опыту в человекоцентрированном подходе',
  description: 'Методика Ясина и Колпачникова оценивает роджерианскую открытость опыту: готовность встречаться с новым и неопределённостью, осознавать и принимать собственные эмоции, включая негативные переживания, а также сохранять активную позицию и ответственность. Пять шкал охватывают собственно открытость, принятие нового опыта, понимание эмоций, принятие негативных эмоций и принятие ответственности. Версия подходит для исследовательского применения у взрослых и старших подростков; она измеряет человекоцентрированный конструкт, отличный от одноимённой черты «Большой пятёрки».',
  questions,
};

// PsyTests publishes a 21-item display form; item order corresponds to the final
// item identifiers in the authors’ appendix. The unpublished q47 wording is not
// included in this displayed form, so the corresponding final-scale item is omitted.
export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'openness', label: 'Открытость опыту', items: [3, 9, 10, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'acceptance_new', label: 'Принятие нового опыта', items: [1, 2, 4, 5, 17], reverseItems: [1, 2, 4, 5, 17], aggregation: 'sum' },
    { key: 'emotion_understanding', label: 'Понимание эмоций', items: [6, 7, 8, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'negative_emotions', label: 'Принятие негативных эмоций', items: [16, 18, 20, 21], reverseItems: [16, 18, 20, 21], aggregation: 'sum' },
    { key: 'responsibility', label: 'Принятие ответственности', items: [12, 14, 15, 19], reverseItems: [12, 14, 19], aggregation: 'sum' },
  ],
};

const responseSet = (value: number) => Object.fromEntries(statements.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы «полностью не согласен» с реверсированием', answers: responseSet(1), expected: { openness: 4, acceptance_new: 25, emotion_understanding: 4, negative_emotions: 20, responsibility: 15 } },
  { title: 'Ручная проверка: все ответы «полностью согласен» с реверсированием', answers: responseSet(6), expected: { openness: 24, acceptance_new: 5, emotion_understanding: 24, negative_emotions: 4, responsibility: 9 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'yasin-kolpachnikov-oioo-2025-psytests-21item-v1',
};
