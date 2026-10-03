import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  '1а. Отмечаете ли Вы (при любом волнении) склонность к покраснению лица?',
  '1б. Отмечаете ли Вы (при любом волнении) склонность к побледнению лица?',
  '2а. Бывает ли у Вас онемение или похолодание пальцев кистей, стоп?',
  '2б. Бывает ли у Вас онемение или похолодание целиком кистей, стоп?',
  '3а. Бывает ли у Вас изменение окраски (побледнение, покраснение, синюшность) пальцев кистей, стоп?',
  '3б. Бывает ли у Вас изменение окраски (побледнение, покраснение, синюшность) целиком кистей, стоп?',
  '4. Отмечаете ли Вы повышенную потливость?',
  '5. Бывают ли у Вас ощущения сердцебиения, «замирания», «остановки сердца»?',
  '6. Бывают ли у Вас часто ощущения затруднения при дыхании: чувство нехватки воздуха, учащенное дыхание?',
  '7. Характерно ли для Вас нарушение функции желудочно-кишечного тракта: склонность к запорам, поносам, «вздутиям» живота, боли?',
  '8. Бывают ли у Вас обмороки (потеря внезапно сознания или чувство, что можете его потерять)?',
  '9. Бывают ли у Вас приступообразные головные боли?',
  '10. Отмечаете ли Вы в настоящее время снижение работоспособности, быструю утомляемость?',
  '11. Отмечаете ли Вы нарушения сна?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_170_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: yesNo,
}));

export const instrument: SeedSection = {
  code: 'test_170',
  title: 'Вопросник для выявления признаков вегетативных изменений',
  description: 'Вопросник А. М. Вейна и др. (1998), заполняемый пациентом. Для положительных ответов на пункты с уточнениями источник предлагает подчеркнуть соответствующую характеристику; сами уточнения не меняют балльный ключ.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'vegetativeSymptoms', label: 'Сумма признаков вегетативных изменений', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], reverseItems: [], weights: { 1: 3, 2: 3, 3: 3, 4: 4, 5: 5, 6: 5, 7: 4, 8: 7, 9: 7, 10: 6, 11: 7, 12: 7, 13: 5, 14: 5 }, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Нет»: нулевая сумма',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { vegetativeSymptoms: 0 },
  },
  {
    title: 'Только ответ «Да» на ощущение сердцебиения, замирания или остановки сердца: 7 баллов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 7 ? 1 : 0])),
    expected: { vegetativeSymptoms: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'wein-vegetative-changes-questionnaire-1998-v1',
};
