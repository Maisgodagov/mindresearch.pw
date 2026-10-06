import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerLabels = [
  'Совершенно бессмысленно',
  'Бессмысленно',
  'Скорее бессмысленно',
  'Скорее разумно',
  'Разумно',
  'Совершенно разумно',
];

const items = [
  'Скрытый смысл преображает абстрактную красоту.',
  'Будущее освещает иррациональные факты для ищущего человека.',
  'Наше движение преобразует всеобщее наблюдение.',
  'Вся тишина — это бесконечное явление.',
  'Неведомое находится вне всякой новой неизменности.',
  'Необъяснимое касается неотъемлемого опыта вселенной.',
  'Мы ответственны не только за то, что мы говорим, но и за то, когда мы молчим.',
  'Одно дело испытывать влечение к искушению, но совсем другое — ему поддаться.',
  'Перед глазами у нас чужие недостатки, а за спиной — свои собственные.',
  'Кто никогда НЕ совершал ошибок, тот никогда НЕ пробовал что-то новое.',
];

const options = answerLabels.map((label, index) => ({ value: String(index + 1), label }));
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2083_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2083',
  title: 'Шкала восприимчивости к чуши (русская адаптация, 2025)',
  description: 'Методика измеряет восприимчивость к псевдоглубоким высказываниям, лишенным реального содержания, по тому, насколько разумными они кажутся респонденту. Шесть искусственно составленных фраз образуют шкалу восприимчивости к чуши; четыре осмысленных изречения представлены в бланке как дополнительные сравниваемые высказывания и в эту шкалу не входят. Русская адаптация 2025 года предназначена для исследовательских опросов на русском языке; опубликованная валидизация проведена на выборке взрослых респондентов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'bullshit_receptivity', label: 'Восприимчивость к чуши', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все шесть пунктов оценены как совершенно бессмысленные', answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1 }, expected: { bullshit_receptivity: 1 } },
  { title: 'Ручная проверка: все шесть пунктов оценены как совершенно разумные', answers: { '1': 6, '2': 6, '3': 6, '4': 6, '5': 6, '6': 6 }, expected: { bullshit_receptivity: 6 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'erlandsson-komyaginskaya-ru-2025-bsr-six-item-mean-v1',
};
