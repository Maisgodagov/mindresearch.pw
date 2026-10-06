import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Ни то, ни другое' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const statements = [
  'Я сомневаюсь, что мой врач при лечении учитывает все особенности моей личности',
  'Мой врач обычно внимательно относится к моим потребностям и ставит их на первое место',
  'Я настолько доверяю своему врачу, что всегда стараюсь следовать его советам',
  'Если мой врач говорит мне, что что-то не так, значит, это правда',
  'Иногда я не доверяю мнению своего врача и хотел бы получить повторное заключение',
  'Я доверяю суждениям своего врача о моем медицинском обслуживании',
  'Я чувствую, что мой врач не делает все, что должен, для моего медицинского обслуживания',
  'Я доверяю своему врачу в том, что он ставит мои медицинские потребности превыше всех других соображений при лечении моих медицинских проблем',
  'Мой врач – настоящий эксперт в решении медицинских проблем, подобных моей',
  'Я доверяю своему врачу и верю, что он сообщит мне, если в моем лечении была допущена ошибка',
  'Я иногда беспокоюсь, что мой врач может не сохранить в тайне информацию, которую мы обсуждаем',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2135_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2135',
  title: 'Шкала доверия к врачу (TPS), русскоязычная адаптация',
  description: 'Шкала оценивает межличностное доверие пациента к своему врачу: учет потребностей пациента, следование советам, компетентность, честность и конфиденциальность. Русскоязычная адаптация опубликована и проверена на выборке пациентов с хроническими заболеваниями; она подходит для изучения восприятия отношений пациента с врачом.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'physician_trust',
    label: 'Доверие к врачу',
    items: Array.from({ length: 11 }, (_, index) => index + 1),
    reverseItems: [1, 5, 7, 11],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1 по прямым и 5 по обратным пунктам дают минимальный итог 11',
    answers: { '1': 5, '2': 1, '3': 1, '4': 1, '5': 5, '6': 1, '7': 5, '8': 1, '9': 1, '10': 1, '11': 5 },
    expected: { physician_trust: 11 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'trust-in-physician-scale-russian-maksimenko-zolotareva-trotsenko-2025-v1',
};
