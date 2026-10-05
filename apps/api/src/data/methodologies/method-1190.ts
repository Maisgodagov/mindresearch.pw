import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'И согласен, и не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я хорошо себя знаю, и многое из того, что я размещаю в своем профиле в социальной сети, — это способ показать, что я за человек.',
  'В интернете я почти такой же, как в реальной жизни.',
  'Я хорошо представляю себе, чего хочу от жизни, и социальная сеть — это один из способов выразить мои взгляды и убеждения.',
  'Иногда в социальной сети я стараюсь быть не таким человеком, каким являюсь на самом деле.',
  'Мне нравится быть тем, кто я есть, и я горжусь своими убеждениями и делюсь ими в своем профиле в социальной сети.',
  'В социальной сети я проявляю себя так же, как и в реальной жизни.',
  'Я меняю фотографии в своем профиле в социальной сети, чтобы показать другим разные стороны моей личности.',
  'Я совершенно разный в интернете и в реальной жизни.',
  'Мне кажется, что я разносторонний человек, и я показываю это в своем профиле в социальной сети.',
  'Бывает так, что в социальной сети я делаю вид, что я кто-то другой.',
  'Я стараюсь произвести впечатление на других, когда выкладываю свои фотографии в профиле социальной сети.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1220_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1220',
  title: 'Опросник самопрезентации в социальной сети',
  description: 'Методика оценивает способы представления себя пользователями социальных сетей по двум аспектам: реалистичное демонстративное Я (презентация реального образа и разных сторон личности) и фальшивое обманное Я (представление нереалистичного образа или себя как другого человека). Русская универсальная версия адаптирована для пользователей разных социальных сетей; опубликованная проверка проводилась на студентах 18–26 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'realistic_demonstrative_self', label: 'Реалистичное демонстративное Я', items: [1, 3, 5, 7, 9, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'false_deceptive_self', label: 'Фальшивое обманное Я', items: [2, 4, 6, 8, 10], reverseItems: [2, 6], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральная середина шкалы по всем пунктам',
    answers: Object.fromEntries(Array.from({ length: 11 }, (_, i) => [String(i + 1), 3])),
    expected: { realistic_demonstrative_self: 18, false_deceptive_self: 15 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kornienko-rudnova-osvss-2021-11item-v1',
};
