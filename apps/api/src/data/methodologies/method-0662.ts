import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'поддерживать отношения с близкими людьми',
  'поддерживать отношения с людьми, с которыми иначе контакт был бы потерян',
  'познакомиться с новыми людьми',
  'продемонстрировать другим людям мои мысли, чувства, интересы и т. д.',
  'другим людям увидеть меня с лучшей стороны',
  'рассказывать другим людям то, что я считаю важным, чтобы они обо мне знали',
  'мне быть таким/ой же, как мои сверстники',
  'поддерживать отношения с единомышленниками',
  'присоединяться к группам, которые мне интересны',
];

const options = Array.from({ length: 7 }, (_, index) => ({
  value: String(index + 1),
  label: index === 0 ? 'Абсолютно не согласен/а' : index === 6 ? 'Абсолютно согласен/а' : String(index + 1),
}));

const questions: SeedSection['questions'] = items.map((item, index) => ({
  code: `test_693_${index + 1}`,
  text: `Я использую социальные сети, потому что они позволяют ${item}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_693',
  title: 'Методика оценки социальной мотивации использования социальных сетей',
  description: 'Оценивает выраженность трёх социальных мотивов использования социальных сетей: поддержания и развития отношений, самопрезентации и принадлежности к группе. Подходит для изучения мотивов пользователей социальных сетей; исходная публикация проверяла методику на студентах российских вузов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'relationships', label: 'Поддержание и развитие отношений', items: [1, 2, 3], reverseItems: [], aggregation: 'sum' },
    { key: 'selfPresentation', label: 'Самопрезентация', items: [4, 5, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'groupBelonging', label: 'Принадлежность к группе', items: [7, 8, 9], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1–9 равны 1, 2, 3, 4, 5, 6, 7, 1, 2',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 1, '9': 2 },
    expected: { relationships: 6, selfPresentation: 15, groupBelonging: 10 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'priporova-agadullina-social-motives-2019-v1',
};
