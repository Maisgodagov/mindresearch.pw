import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const objectOptions = [
  'Человек (дети и взрослые, ученики и студенты, клиенты и пациенты, покупатели и пассажиры, зрители и читатели, сотрудники и т.д.)',
  'Информация (тексты, формулы, схемы, коды, чертежи, иностранные языки, языки программирования)',
  'Финансы (деньги, акции, фонды, лимиты, кредиты)',
  'Техника (механизмы, станки, здания, конструкции, приборы, машины)',
  'Искусство (литература, музыка, театр, кино, балет, живопись и т.д.)',
  'Животные и растения (дикие, домашние, декоративные и т.д.)',
  'Изделия и продукты (металл, ткани, мех, кожа, дерево, камень, лекарства, хлеб, мясо, молоко, плоды, овощи, фрукты и т.д.)',
  'Природные ресурсы (земли, леса, горы, водоемы, месторождения и т.д.)',
];

const activityOptions = [
  'Управление (руководство чьей-то деятельностью)',
  'Обслуживание (оказание различных услуг)',
  'Образование (воспитание, обучение, формирование личности)',
  'Оздоровление (профилактика и лечение)',
  'Конструирование (проектирование деталей и объектов)',
  'Исследование (научное изучение чего-либо или кого-либо)',
  'Защита (охрана от враждебных действий)',
  'Контроль (проверка и наблюдение)',
];

const optionRows = (labels: string[]) => labels.map((label, index) => ({ value: String(index + 1), label }));
const questions: SeedSection['questions'] = [
  {
    code: 'test_537_1',
    text: 'Какой предмет труда тебя привлекает? Отметь самые привлекательные варианты (1–2 варианта).',
    type: 'multiple',
    required: true,
    options: optionRows(objectOptions),
    validation: { maxSelections: 2 },
  },
  {
    code: 'test_537_2',
    text: 'Какой вид деятельности тебя привлекает? Отметь самые привлекательные варианты (1–2 варианта).',
    type: 'multiple',
    required: true,
    options: optionRows(activityOptions),
    validation: { maxSelections: 2 },
  },
];

export const instrument: SeedSection = {
  code: 'test_537',
  title: 'Матрица профессионального выбора',
  description: 'Профориентационная матрица Г. В. Резапкиной помогает школьникам и поступающим в вузы соотнести предпочтительные предметы труда (людей, информацию, финансы, технику, искусство, живую природу, изделия и ресурсы) с видами деятельности. Пересечения дают возможные направления и специальности высшего образования для дальнейшего обдумывания; методика уточняет профессиональный выбор, а не оценивает способности или личностные качества.',
  questions,
};

// Методика не имеет балльных шкал: scoringConfig сохраняет два исходных перечня
// как отметки категорий; их содержательный результат определяется пересечениями.
export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'subjects', label: 'Предметы труда (категории)', items: [1], reverseItems: [], aggregation: 'count-option', optionValue: '1' },
    { key: 'activities', label: 'Виды деятельности (категории)', items: [2], reverseItems: [], aggregation: 'count-option', optionValue: '1' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: по одной отметке в каждом перечне', answers: { '1': '1', '2': '3' }, expected: { subjects: 1, activities: 1 } },
  { title: 'Ручная проверка: две отметки в каждом перечне', answers: { '1': '1', '2': '1' }, expected: { subjects: 1, activities: 1 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rezapkina-professional-choice-matrix-2010s-v1',
};
