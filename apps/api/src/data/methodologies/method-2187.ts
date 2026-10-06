import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items: { text: string; options: { value: string; label: string; score: number }[] }[] = [
  { text: 'Поведение при проведении медикаментозного лечения', options: [{ value: '2', label: 'Самостоятельный прием лекарств', score: 2 }, { value: '1', label: 'Прием лекарств под контролем медицинского персонала, родственников', score: 1 }, { value: '0', label: 'Уклонение от приема лекарств (избегает приема, отказывается)', score: 0 }] },
  { text: 'Заинтересованность в приеме лекарств', options: [{ value: '3', label: 'Активное отношение к приему препарата, понимание необходимости приема, интерес к параметрам терапии', score: 3 }, { value: '2', label: 'Согласие на прием препарата при наличии сомнений в его эффективности', score: 2 }, { value: '1', label: 'Пассивное согласие на прием при отсутствии надежды на эффект', score: 1 }, { value: '0', label: 'Нежелание принимать лекарства', score: 0 }] },
  { text: 'Наличие опасений, связанных с психотропным действием вообще или с возможностью появления побочных эффектов', options: [{ value: '5', label: 'Отсутствие необоснованных опасений относительно медикации', score: 5 }, { value: '4', label: 'Считает, что психотропные препараты в дальнейшем могут вызвать неприятные побочные действия', score: 4 }, { value: '3', label: 'Считает, что препараты, как и любые «химические», то есть неприродные вещества, могут оказаться вредными для организма', score: 3 }, { value: '2', label: 'Считает, что психотропные препараты в дальнейшем могут произвести психологический эффект «зомбирования», «разрушения» личности', score: 2 }, { value: '1', label: 'Негативно относится к принимаемому препарату, так как испытал на себе субъективно тягостные побочные действия или отсутствие эффекта', score: 1 }, { value: '0', label: 'Негативно относится к лекарствам, так как испытал на себе субъективно тягостные побочные действия или отсутствие эффекта нескольких (3 и более) препаратов', score: 0 }] },
  { text: 'Психологически обусловленное саботирование медикации', options: [{ value: '5', label: 'Психологически обусловленное саботирование отсутствует', score: 5 }, { value: '4', label: 'Недостаточность субъективного страдания от болезни', score: 4 }, { value: '3', label: 'Особенности восприятия врача (проявление недоверия, недовольство контактом и т.д.)', score: 3 }, { value: '2', label: 'Страх стигматизации (прием лекарств воспринимается как подтверждение наличия психического заболевания для себя/окружающих)', score: 2 }, { value: '1', label: 'Особенности внутренней картины болезни', score: 1 }, { value: '0', label: 'Наличие вторичной выгоды от болезни (обеспечение заботы родных, освобождение от ответственности и нагрузок, материальные выгоды)', score: 0 }] },
  { text: 'Анамнестические сведения о нарушениях комплайенса (при их наличии)', options: [{ value: '4', label: 'Нет нарушений', score: 4 }, { value: '3', label: 'Снижение дозировок лекарств', score: 3 }, { value: '2', label: 'Нерегулярность приема лекарств', score: 2 }, { value: '1', label: 'Прекращение приема лекарств', score: 1 }, { value: '0', label: 'Прием не рекомендованных врачом лекарств', score: 0 }] },
  { text: 'Отношение больного к принимавшимся ранее препаратам', options: [{ value: '2', label: 'Положительное', score: 2 }, { value: '1', label: 'Нейтральное / ранее не принимал', score: 1 }, { value: '0', label: 'Отрицательное', score: 0 }] },
  { text: 'Оценка больным эффективности принимаемого на данный момент препарата при монотерапии', options: [{ value: '2', label: 'Высокая', score: 2 }, { value: '1', label: 'Средняя', score: 1 }, { value: '0', label: 'Низкая', score: 0 }] },
  { text: 'Оценка больным эффективности принимаемой на данный момент комбинации препаратов', options: [{ value: '2', label: 'Высокая', score: 2 }, { value: '1', label: 'Средняя', score: 1 }, { value: '0', label: 'Низкая', score: 0 }] },
  { text: 'Приемлемость парентерального способа введения препарата', options: [{ value: '1', label: 'Удовлетворен', score: 1 }, { value: '0', label: 'Индифферентен / не используется', score: 0 }, { value: '-1', label: 'Не удовлетворен', score: -1 }] },
  { text: 'Приемлемость перорального приема препарата', options: [{ value: '1', label: 'Удовлетворен', score: 1 }, { value: '0', label: 'Индифферентен / не используется', score: 0 }, { value: '-1', label: 'Не удовлетворен', score: -1 }] },
  { text: 'Удовлетворенность режимом приема препарата', options: [{ value: '2', label: 'Полностью удовлетворен', score: 2 }, { value: '1', label: 'Нейтрален', score: 1 }, { value: '0', label: 'Не удовлетворен', score: 0 }] },
  { text: 'Доступность препарата', options: [{ value: '1', label: 'Доступен', score: 1 }, { value: '0', label: 'Недоступность по финансовым или иным причинам', score: 0 }] },
  { text: 'Информация о времени ожидаемого начала действия препарата', options: [{ value: '1', label: 'Получена больным', score: 1 }, { value: '0', label: 'Не получена', score: 0 }] },
  { text: 'Осознание болезни', options: [{ value: '3', label: 'Инсайт на психологические механизмы болезни', score: 3 }, { value: '2', label: 'Наличие критики к симптомам', score: 2 }, { value: '1', label: 'Частичная критика', score: 1 }, { value: '0', label: 'Отсутствие критики', score: 0 }] },
  { text: 'Уровень продуктивной психопатологической симптоматики (по шкале BPRS)', options: [{ value: '2', label: 'Низкий', score: 2 }, { value: '1', label: 'Средний', score: 1 }, { value: '0', label: 'Высокий', score: 0 }] },
  { text: 'Уровень негативной симптоматики (по шкале SANS)', options: [{ value: '2', label: 'Низкий', score: 2 }, { value: '1', label: 'Средний', score: 1 }, { value: '0', label: 'Высокий', score: 0 }] },
  { text: 'Частота рецидивирования', options: [{ value: '2', label: 'Низкая', score: 2 }, { value: '1', label: 'Средняя', score: 1 }, { value: '0', label: 'Высокая', score: 0 }] },
  { text: 'Суицидальные и прочие тенденции к саморазрушающему поведению', options: [{ value: '2', label: 'Низкие', score: 2 }, { value: '1', label: 'Средние', score: 1 }, { value: '0', label: 'Высокие', score: 0 }] },
  { text: 'Коморбидность со злоупотреблением психоактивными веществами и/или расстройствами личности', options: [{ value: '1', label: 'Отсутствует', score: 1 }, { value: '0', label: 'Имеется', score: 0 }] },
  { text: 'Глобальный уровень социального функционирования, адаптации больного (по шкале GAF)', options: [{ value: '2', label: 'Высокий', score: 2 }, { value: '1', label: 'Средний', score: 1 }, { value: '0', label: 'Низкий', score: 0 }] },
  { text: 'Наличие когнитивных нарушений', options: [{ value: '1', label: 'Отсутствуют', score: 1 }, { value: '0', label: 'Имеются', score: 0 }] },
  { text: 'Уровень социальной поддержки, включая материальное содействие в приобретении лекарственных средств', options: [{ value: '2', label: 'Высокий', score: 2 }, { value: '1', label: 'Средний', score: 1 }, { value: '0', label: 'Низкий', score: 0 }] },
  { text: 'Отношение близкого окружения к медикации', options: [{ value: '3', label: 'Адекватное отношение', score: 3 }, { value: '2', label: 'Отрицательное отношение друзей', score: 2 }, { value: '1', label: 'Отрицательное отношение лечащего психотерапевта / парапрактика', score: 1 }, { value: '0', label: 'Отрицательное / неадекватное отношение семьи', score: 0 }] },
  { text: 'Терапевтический альянс', options: [{ value: '2', label: 'Высокий', score: 2 }, { value: '1', label: 'Средний', score: 1 }, { value: '0', label: 'Низкий', score: 0 }] },
  { text: 'Адекватность врачебного наблюдения вне обострения', options: [{ value: '2', label: 'Высокая', score: 2 }, { value: '1', label: 'Средняя', score: 1 }, { value: '0', label: 'Низкая', score: 0 }] },
];

const questions: SeedSection['questions'] = items.map((item, index) => ({
  code: `test_2201_${index + 1}`,
  text: item.text,
  type: 'single',
  required: true,
  options: item.options.map(({ value, label }) => ({ value, label })),
}));

export const instrument: SeedSection = {
  code: 'test_2201',
  title: 'Шкала медикаментозного комплайенса',
  description: 'Клиническая шкала для врачебной оценки комплайенса при добровольной лекарственной терапии в психиатрии. Охватывает поведение и отношение к медикации, факторы пациента, поддержку близкого окружения и взаимодействие с лечащим врачом; помогает описывать факторы, связанные со следованием лекарственным назначениям. Предназначена для заполнения специалистом на основе анамнеза, клинической информации и наблюдений, а не как самоотчет пациента.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: -1,
  max: 5,
  scales: [{
    key: 'total',
    label: 'Суммарный балл комплайенса',
    items: Array.from({ length: 25 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
    itemScores: Object.fromEntries(items.map((item, index) => [index + 1, Object.fromEntries(item.options.map(option => [option.value, option.score]))])),
  }],
};

const validationCases: ValidationCase[] = [{
  title: 'Ручная проверка: минимальные градации, включая два отрицательных значения, дают −2',
  answers: Object.fromEntries(items.map((item, index) => [String(index + 1), item.options.reduce((lowest, option) => option.score < lowest.score ? option : lowest).value])),
  expected: { total: -2 },
}];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lutova-bortsov-vuks-vid-medication-compliance-scale-2007-item-score-sum-v1',
};
