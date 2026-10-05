import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Не знаю' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Мне не сложно выражать свои эмоции словами',
  'Как правило, мне сложно посмотреть на ситуацию глазами другого человека',
  'В целом я очень целеустремленный человек',
  'Как правило, мне трудно контролировать свои эмоции',
  'В целом жизнь мне не кажется радостной',
  'Я могу эффективно взаимодействовать с людьми',
  'Я часто меняю свое мнение',
  'Бывает, я не могу понять, какую эмоцию испытываю',
  'Я считаю, что у меня много хороших качеств',
  'Мне обычно трудно отстаивать свои права',
  'Как правило, я могу повлиять на эмоциональное состояние другого человека',
  'В целом я вижу будущее в мрачном свете',
  'Близкие люди часто жалуются, что я плохо обращаюсь с ними',
  'Мне обычно трудно приспособиться к обстоятельствам',
  'В целом я могу справиться со стрессом',
  'Мне обычно трудно показать близким людям, что я их люблю',
  'Как правило, я могу «влезть в шкуру» другого человека и понять, что он чувствует',
  'Мне обычно трудно сохранять интерес к тому, что я делаю',
  'Если мне нужно, я всегда могу найти способ справиться со своими эмоциями',
  'В целом я доволен(-на) своей жизнью',
  'Я считаю, что умею договариваться с людьми',
  'Я часто влезаю во что-то, о чем потом жалею',
  'Я часто делаю паузу, чтобы разобраться в своих переживаниях',
  'Я верю, что у меня много сильных сторон',
  'Я склонен(-на) уступать, даже если знаю, что прав(а)',
  'Думаю, я совсем не могу влиять на чувства других людей',
  'Я верю, что у меня в жизни все будет хорошо',
  'Мне трудно поддерживать тесные эмоциональные связи даже с близкими людьми',
  'Как правило, я легко приспосабливаюсь к новым условиям',
  'Окружающие люди восхищаются моей способностью всегда оставаться спокойным(-ой)',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1142_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1142',
  title: 'Опросник по эмоциональному интеллекту, TEIQue-SF',
  description: 'Русскоязычная взрослая адаптация TEIQue-SF оценивает эмоциональный интеллект как личностную черту по самоотчету: эмоциональное функционирование в повседневности, включая поддержание отношений и социальную компетентность. Подходит для описания индивидуальных различий у взрослых в исследовательских и прикладных опросах; это оценка воспринимаемого эмоционального функционирования, а не тест выполнения эмоциональных задач.',
  questions,
};

const relationship = [4, 5, 7, 8, 10, 12, 13, 14, 15, 16, 18, 19, 20, 22, 23, 27, 28, 30];
const social = [2, 3, 6, 9, 11, 17, 21, 24, 26, 29];
const relationshipReverse = [4, 5, 7, 8, 10, 12, 13, 14, 16, 18, 22, 23, 28];
const socialReverse = [2, 26];

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'relationship_maintenance', label: 'Поддержание отношений', items: relationship, reverseItems: relationshipReverse, aggregation: 'sum' },
    { key: 'social_competence', label: 'Социальная компетентность', items: social, reverseItems: socialReverse, aggregation: 'sum' },
    { key: 'trait_emotional_intelligence', label: 'Общий показатель эмоционального интеллекта как личностной черты', items: [...relationship, ...social], reverseItems: [...relationshipReverse, ...socialReverse], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы 1; реверсивные пункты перекодируются в 7', answers: allAnswers(1), expected: { relationship_maintenance: 102, social_competence: 40, trait_emotional_intelligence: 142 } },
  { title: 'Ручная проверка: все ответы 7; реверсивные пункты перекодируются в 1', answers: allAnswers(7), expected: { relationship_maintenance: 96, social_competence: 54, trait_emotional_intelligence: 150 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'tei-que-sf-pankratova-kornienko-fetisova-2021-ru-v1',
};
