import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const fourFrequency = [
  { value: '4', label: 'Много раз' },
  { value: '3', label: 'Несколько раз' },
  { value: '2', label: 'Однажды' },
  { value: '1', label: 'Никогда' },
  { value: 'refused', label: 'Не желаю сообщать' },
];
const yesNo = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
  { value: 'refused', label: 'Не желаю сообщать' },
];
const binary = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
  { value: 'na', label: 'Не применимо' },
  { value: 'refused', label: 'Не желаю сообщать' },
];
const uncertain = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
  { value: 'unsure', label: 'Не знаю / не уверен' },
  { value: 'refused', label: 'Не желаю сообщать' },
];
const fiveFrequency = [
  { value: '5', label: 'Всегда' },
  { value: '4', label: 'В большинстве случаев' },
  { value: '3', label: 'Иногда' },
  { value: '2', label: 'Редко' },
  { value: '1', label: 'Никогда' },
  { value: 'refused', label: 'Не желаю сообщать' },
];
const bullyingForms = [
  { value: 'physical', label: 'Меня били, толкали, пинали или запирали в помещении' },
  { value: 'race', label: 'Меня высмеивали из-за моей расы, национальности или цвета кожи' },
  { value: 'religion', label: 'Меня высмеивали из-за моей религии' },
  { value: 'sexual', label: 'Меня высмеивали, используя шутки, комментарии или жесты с сексуальным подтекстом' },
  { value: 'excluded', label: 'Меня игнорировали или намеренно исключали из какой-либо деятельности' },
  { value: 'appearance', label: 'Меня высмеивали из-за того, как выглядело мое тело или лицо' },
  { value: 'other', label: 'Я подвергался другому виду травли' },
  { value: 'refused', label: 'Не желаю сообщать' },
];

type Item = { code: string; text: string; options: typeof fourFrequency };
const items: Item[] = [
  { code: 'P1', text: 'Ваши родители или опекуны понимали Ваши проблемы или переживания?', options: fiveFrequency },
  { code: 'P2', text: 'Ваши родители или опекуны реально знали, где Вы проводили свободное от учебы и работы время?', options: fiveFrequency },
  { code: 'P3', text: 'Как часто Ваши родители или опекуны не давали Вам достаточно еды, даже когда они могли легко это сделать?', options: fourFrequency },
  { code: 'P4', text: 'Как часто Ваши родители или опекуны находились в настолько сильном алкогольном или наркотическом опьянении, что были не в состоянии заботиться о Вас?', options: fourFrequency },
  { code: 'P5', text: 'Как часто Ваши родители или опекуны не отправляли Вас в школу, даже когда это было возможно?', options: fourFrequency },
  { code: 'F1', text: 'Вы проживали с кем-то, у кого были проблемы с употреблением алкоголя, наркотиков или других препаратов?', options: yesNo },
  { code: 'F2', text: 'Вы проживали с кем-то, кто страдал депрессиями, другими психическими расстройствами, совершил суицид или имел суицидальные намерения?', options: yesNo },
  { code: 'F3', text: 'Вы проживали с кем-то, кто когда-либо был в СИЗО или в тюрьме?', options: yesNo },
  { code: 'F4', text: 'Были ли Ваши родители когда-либо разведены или проживали раздельно?', options: binary },
  { code: 'F5', text: 'Кто-то из Ваших родителей или опекунов умер, когда Вам не было 18 лет?', options: uncertain },
  { code: 'F6', text: 'Вы видели или слышали, как дома на Вашего родителя или домочадца кричали или проклинали, оскорбляли, унижали?', options: fourFrequency },
  { code: 'F7', text: 'Вы видели или слышали, как дома Вашего родителя или домочадца били, давали пощечину, пинали или избивали?', options: fourFrequency },
  { code: 'F8', text: 'Вы видели или слышали, как дома Вашему родителю или домочадцу наносили удары такими предметами, как палка (трость), бутылка, дубинка, нож, кнут и т. д.?', options: fourFrequency },
  { code: 'A1', text: 'Родитель, опекун или другой домочадец кричал, ругал, оскорблял или унижал Вас?', options: fourFrequency },
  { code: 'A2', text: 'Родитель, опекун или другой домочадец угрожал отказаться от Вас или на самом деле отказывался от Вас или выгонял из дома?', options: fourFrequency },
  { code: 'A3', text: 'Родитель, опекун или другой домочадец порол, давал пощечину, бил, пинал или избивал Вас?', options: fourFrequency },
  { code: 'A4', text: 'Родитель, опекун или другой домочадец наносил Вам удары такими предметами, как палка (трость), бутылка, дубинка, нож, кнут и т. д.?', options: fourFrequency },
  { code: 'A5', text: 'Кто-то трогал или ласкал Вас с сексуальными намерениями, когда Вы этого не хотели?', options: fourFrequency },
  { code: 'A6', text: 'Заставлял ли Вас кто-то прикасаться к его/ее телу с сексуальными намерениями, когда Вы этого не хотели?', options: fourFrequency },
  { code: 'A7', text: 'Кто-то пытался установить с Вами оральный, анальный или вагинальный контакт, когда Вы этого не хотели?', options: fourFrequency },
  { code: 'A8', text: 'Кто-то смог установить с Вами оральный, анальный или вагинальный контакт, когда Вы этого не хотели?', options: fourFrequency },
  { code: 'V1', text: 'Как часто Вы подвергались травле (издевательствам, запугиванию)?', options: fourFrequency },
  { code: 'V2', text: 'В какой форме Вы подвергались травле чаще всего?', options: bullyingForms },
  { code: 'V3', text: 'Как часто Вы участвовали в драках?', options: fourFrequency },
  { code: 'V4', text: 'Вы видели или слышали в реальной жизни, как кого-то избивали?', options: fourFrequency },
  { code: 'V5', text: 'Вы видели или слышали в реальной жизни, как кого-то ранили ножом или в кого-то стреляли?', options: fourFrequency },
  { code: 'V6', text: 'Вы видели или слышали в реальной жизни, как кому-то угрожали ножом или как угрожали выстрелить в кого-то?', options: fourFrequency },
  { code: 'V7', text: 'Вы были вынуждены уехать и жить в другом месте в связи с каким-либо из перечисленных выше событий?', options: fourFrequency },
  { code: 'V8', text: 'Ваш дом был разрушен в результате какого-либо из перечисленных выше событий?', options: fourFrequency },
  { code: 'V9', text: 'Вас избивали солдаты, полицейские, ополченцы или бандиты?', options: fourFrequency },
  { code: 'V10', text: 'Кто-то из Ваших друзей или членов семьи был убит или избит солдатами, полицейскими, ополченцами или бандитами?', options: fourFrequency },
];
const byCode = Object.fromEntries(items.map((item, index) => [item.code, index + 1])) as Record<string, number>;

export const instrument: SeedSection = {
  code: 'test_539',
  title: 'Международный опросник неблагоприятного детского опыта (ACE-IQ), русская версия 2024',
  description: 'ACE-IQ оценивает ретроспективный опыт неблагоприятных событий до 18 лет у взрослых. Охватывает насилие и пренебрежение в семье, дисфункцию семейной среды, травлю сверстниками, насилие в окружении и коллективное насилие; автору опроса позволяет описать число типов такого опыта для клинического скрининга и исследовательских задач. Использована валидизированная русскоязычная версия Кибитова и соавторов 2024 года для респондентов от 18 лет.',
  questions: items.map((item, index) => ({
    code: `test_539_${index + 1}`,
    text: `${item.code}: ${item.text}`,
    type: 'single',
    required: true,
    options: item.options,
  })),
};

const binaryGroups: Record<string, string[]> = {
  physical_abuse: ['A3', 'A4'],
  emotional_abuse: ['A1', 'A2'],
  sexual_abuse: ['A5', 'A6', 'A7', 'A8'],
  household_violence: ['F6', 'F7', 'F8'],
  emotional_neglect: ['P1', 'P2'],
  physical_neglect: ['P3', 'P4', 'P5'],
  bullying: ['V1'],
  community_violence: ['V3', 'V4', 'V5', 'V6'],
  collective_violence: ['V7', 'V8', 'V9', 'V10'],
  household_substance: ['F1'],
  household_incarceration: ['F3'],
  household_mental_health: ['F2'],
  parental_loss_separation: ['F4', 'F5'],
};
const frequencyGroups: Record<string, string[]> = {
  physical_abuse: ['A3', 'A4'],
  emotional_abuse: ['A1', 'A2'],
  sexual_abuse: ['A5', 'A6', 'A7', 'A8'],
  household_violence: ['F6', 'F7', 'F8'],
  emotional_neglect: ['P1', 'P2'],
  physical_neglect: ['P3', 'P4', 'P5'],
  bullying: ['V1'],
  community_violence: ['V3', 'V4', 'V5', 'V6'],
  collective_violence: ['V7', 'V8', 'V9', 'V10'],
  household_substance: ['F1'],
  household_incarceration: ['F3'],
  household_mental_health: ['F2'],
  parental_loss_separation: ['F4', 'F5'],
};
const groupLabels: Record<string, string> = {
  physical_abuse: 'Физическое насилие', emotional_abuse: 'Эмоциональное насилие', sexual_abuse: 'Сексуальное насилие',
  household_violence: 'Насилие по отношению к домочадцам', emotional_neglect: 'Эмоциональное пренебрежение',
  physical_neglect: 'Физическое пренебрежение', bullying: 'Буллинг', community_violence: 'Насилие в окружении',
  collective_violence: 'Коллективное насилие', household_substance: 'Проживание с человеком с проблемами употребления ПАВ',
  household_incarceration: 'Проживание с человеком, побывавшим в местах лишения свободы',
  household_mental_health: 'Проживание с человеком с психическим расстройством', parental_loss_separation: 'Лишение или разлучение с родителем',
};
const binaryItems = Object.values(binaryGroups).flatMap(group => group.map(code => byCode[code]));
const frequencyItems = Object.values(frequencyGroups).flatMap(group => group.map(code => byCode[code]));

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'ace_binary', label: 'Количество типов НДО, бинарный подход', items: binaryItems, reverseItems: [], aggregation: 'sum' },
    { key: 'ace_frequency', label: 'Количество типов НДО, частотный подход', items: frequencyItems, reverseItems: [], aggregation: 'sum' },
  ],
};

const positive = (code: string, answer: unknown, approach: 'binary' | 'frequency') => {
  if (answer === 'refused' || answer === undefined || answer === null) return false;
  if (code === 'F1' || code === 'F2' || code === 'F3') return answer === 'yes';
  if (code === 'F4' || code === 'F5') return answer === 'yes';
  const numeric = Number(answer);
  if (!Number.isFinite(numeric)) return false;
  return approach === 'binary' ? numeric > 1 : numeric === 4;
};
const expectedFor = (answers: Record<string, unknown>, approach: 'binary' | 'frequency') => Object.fromEntries(
  Object.entries(approach === 'binary' ? binaryGroups : frequencyGroups).map(([key, codes]) => [
    key,
    Number(codes.some(code => positive(code, answers[String(byCode[code])], approach))),
  ]),
);
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все частотные события отсутствуют, один бинарный опыт отмечен однажды',
    answers: Object.fromEntries(items.map((item, index) => [String(index + 1),
      item.code === 'V2' ? 'physical' : ['F1', 'F2', 'F3', 'F4', 'F5'].includes(item.code) ? 'no' : item.code === 'P1' || item.code === 'P2' ? '5' : '1'])),
    expected: { ace_binary: 1, ace_frequency: 0 },
  },
  {
    title: 'Ручная проверка: частотный порог и не-применимо/отказ не засчитываются',
    answers: Object.fromEntries(items.map((item, index) => [String(index + 1),
      item.code === 'V2' ? 'physical' : item.code === 'A3' || item.code === 'A4' ? '4' : item.code === 'F1' ? 'yes' : item.code === 'F4' ? 'na' : item.code === 'F5' ? 'unsure' : item.code === 'V9' ? 'refused' : item.code === 'P1' || item.code === 'P2' ? '1' : '1'])),
    expected: { ace_binary: 2, ace_frequency: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'who-ace-iq-kibitov-trusova-ru-2024-binary-frequency-v1',
};

// Keep mappings available in source for explicit provenance and auditability.
void groupLabels;
