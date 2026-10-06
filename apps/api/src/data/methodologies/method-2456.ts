import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'никогда (ни разу)' },
  { value: '2', label: 'редко (один-два раза в неделю)' },
  { value: '3', label: 'иногда (несколько раз в неделю)' },
  { value: '4', label: 'часто (каждый день)' },
  { value: '5', label: 'всегда (несколько раз в день)' },
];

const prompts = [
  'Если с моим телом происходило что-то непонятное, я пытался найти этому объяснение в Интернете.',
  'Поиск информации о симптомах отрывал меня от чтения новостных, спортивных или развлекательных статей в Интернете.',
  'Для поиска информации об одном и том же симптоме я обращался к самым разным интернет-источникам.',
  'Я паниковал(а), если испытываемое мной состояние подходило под симптом какой-то серьезной или редкой болезни.',
  'Нередко изучение симптомов в Интернете побуждало меня обратиться к врачу общей практики или участковому терапевту.',
  'Обычно я несколько раз обращался к одним и тем же интернет-источникам, чтобы лучше разобраться в своем состоянии.',
  'Поиск информации о симптомах мешал мне сосредоточиться на работе (например, писать деловые письма или просматривать документы).',
  'У меня все было прекрасно ровно до тех пор, пока я не начитался о серьезных болезнях в Интернете.',
  'После изучения информации о симптомах в Интернете я заметно нервничал(а) и пребывал(а) в расстроенных чувствах.',
  'Поиск информации о симптомах нарушал мою социальную активность (например, отнимал у меня время, которое я бы мог провести с родными и близкими людьми).',
  'Я просил(а) медицинских работников назначить мне диагностические обследования, о которых я прочитал(а) в Интернете (например, специфический анализ крови).',
  'После изучения информации о симптомах в Интернете у меня возникало желание обратиться к врачу узкой специализации (например, неврологу, кардиологу и т.д.).',
];

const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_2474_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2474',
  title: 'Шкала тяжести киберхондрии (CSS-12), русскоязычная адаптация',
  description: 'CSS-12 оценивает выраженность киберхондрии — чрезмерного и повторяющегося поиска медицинской информации в Интернете — у взрослых респондентов. Общий балл отражает тяжесть киберхондрии, а четыре подшкалы описывают чрезмерность поисков, связанный с ними дистресс, неуверенность и компульсивное вмешательство онлайн-поиска в повседневную деятельность. Русскоязычная версия адаптирована А. А. Золотаревой для популяционных исследований; её клиническая проверка на различных группах пациентов требует дальнейшего изучения.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'excessiveness', label: 'Чрезмерность', items: [1, 3, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'distress', label: 'Дистресс', items: [4, 8, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'reassurance', label: 'Неуверенность', items: [5, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'compulsivity', label: 'Компульсивность', items: [2, 7, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий показатель киберхондрии', items: Array.from({ length: 12 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «никогда» дают 3 по каждой подшкале и 12 в сумме',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i + 1), 1])),
    expected: { excessiveness: 3, distress: 3, reassurance: 3, compulsivity: 3, total: 12 },
  },
  {
    title: 'Ручная проверка: все ответы «всегда» дают 15 по каждой подшкале и 60 в сумме',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i + 1), 5])),
    expected: { excessiveness: 15, distress: 15, reassurance: 15, compulsivity: 15, total: 60 },
  },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ["clinical-somatic"],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'css-12-zolotareva-2023-psytests-ru-v1',
};
