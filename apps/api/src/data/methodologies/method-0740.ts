import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: '1 балл — незначимо' },
  { value: '2', label: '2 балла — незначимо' },
  { value: '3', label: '3 балла — значимо' },
  { value: '4', label: '4 балла — значимо' },
  { value: '5', label: '5 баллов — очень значимо' },
];

const items = [
  'Переживание удовлетворения, радости',
  'Устойчивая позиция личности в конкретной ситуации',
  'Удачное достижение желаемой цели',
  'Материальное благополучие',
  'Реализация возможности делать что хочешь',
  'Власть, влияние на других',
  'Самоутверждение',
  'Умение выделиться в обществе',
  'Душевное равновесие, эмоциональная стабильность',
  'Возможность полнее проявить себя, свои способности',
  'Самоуважение, удовлетворенность собой',
  'Положительный результат в учебе, работе',
  'Благоприятное стечение обстоятельств',
  'Возможность командовать людьми',
  'Общественное признание, одобрение',
  'Хорошее самочувствие, настроение',
  'Возможность поездить по миру',
  'Уверенность в безопасности',
  'Проявление себя в творчестве',
  'Личное благосостояние',
  'Источник внутренних сил человека',
  'Профессионализм, мастерство',
  'Везение в большинстве случаев',
  'Признание Вашего авторитета окружающими',
  'Высокий социальный статус',
  'Самореализация',
  'Удовлетворенность в любви и здоровье',
  'Служение высшей идее',
  'Свое дело в предпринимательстве',
  'Осуществление ожидаемого результата',
  'Возможность попасть в нужное окружение',
  'Ощущение положительного эмоционального подъема',
  'Популярность, значимость для других',
  'Самостоятельность, независимость, свобода действий',
  'Возможность принимать решения за других',
  'Дело по душе, интересная работа',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_770_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_770',
  title: 'Мотивация достижения успеха студентов в вузе',
  description: 'Методика С. А. Пакулиной изучает ценностные предпочтения мотивов успеха у студентов вузов и структуру мотивации достижения. Девять аспектов охватывают внешние критерии успеха (удача, материальное благополучие, признание и власть) и внутренние (результат собственной деятельности, личный успех, эмоциональное состояние, преодоление препятствий и призвание); полезна для исследования связей мотивации достижения с учебной мотивацией и адаптацией студентов.',
  questions,
};

const scaleDefinitions = [
  { key: 'success_luck', label: 'Успех-удача', items: [3, 13, 23, 31] },
  { key: 'success_material', label: 'Успех как материальный уровень жизни', items: [4, 17, 20, 29] },
  { key: 'success_recognition', label: 'Успех-признание', items: [8, 15, 25, 33] },
  { key: 'success_power', label: 'Успех-власть', items: [6, 14, 24, 35] },
  { key: 'success_own_activity', label: 'Успех как результат собственной деятельности', items: [5, 12, 22, 30] },
  { key: 'personal_success', label: 'Личный успех', items: [11, 18, 26, 27] },
  { key: 'success_mental_state', label: 'Успех как психическое состояние', items: [1, 9, 16, 32] },
  { key: 'success_overcoming', label: 'Успех как преодоление препятствий', items: [2, 7, 21, 34] },
  { key: 'success_calling', label: 'Успех-призвание', items: [10, 19, 28, 36] },
];

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    ...scaleDefinitions.map(({ key, label, items }) => ({ key, label, items, reverseItems: [], aggregation: 'sum' as const })),
    { key: 'exteriorized_success', label: 'Экстериоризированный успех (сырая сумма)', items: [3, 13, 23, 31, 4, 17, 20, 29, 8, 15, 25, 33, 6, 14, 24, 35], reverseItems: [], aggregation: 'sum' },
    { key: 'interiorized_success', label: 'Интериоризированный успех', items: [5, 12, 22, 30, 11, 18, 26, 27, 1, 9, 16, 32, 2, 7, 21, 34, 10, 19, 28, 36], reverseItems: [], aggregation: 'sum' },
  ],
};

const lowAnswers = Object.fromEntries(items.map((_, index) => [String(index + 1), 1]));
const highAnswers = Object.fromEntries(items.map((_, index) => [String(index + 1), 5]));
const validationCases: ValidationCase[] = [
  { title: 'Все оценки минимальны', answers: lowAnswers, expected: Object.fromEntries(scoringConfig.scales.map(scale => [scale.key, scale.items.length])) },
  { title: 'Все оценки максимальны', answers: highAnswers, expected: Object.fromEntries(scoringConfig.scales.map(scale => [scale.key, scale.items.length * 5])) },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pakulina-mdus-2008-v1',
};
