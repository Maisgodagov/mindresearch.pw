import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const items = [
  'На протяжении всего дня Вы думаете о том, чтобы поскорее поиграть в любимую компьютерную игру?',
  'Вы тратили на игру больше времени, чем вначале планировали?',
  'Вы играли, чтобы отвлечься от реальной жизни?',
  'Другие люди (родители, родственники, друзья) безуспешно пытались уменьшить время, проводимое вами за компьютерными играми?',
  'Вы чувствуете себя неважно, если вам не удалось поиграть в этот день?',
  'У вас бывают конфликты с другими людьми (родителями, родственниками, друзьями), потому что вы слишком много времени потратили на компьютерные игры?',
  'Вы нечаянно упустили другие важные для вас дела (школьные, спортивные, любые другие), потому что играли в компьютерную игру?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2153_${index + 1}`,
  text: `${index === 0 ? 'За последние 6 месяцев как часто… ' : ''}${text}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2153',
  title: 'Шкала игровой зависимости для подростков (GASA-RU)',
  description: 'Краткий скрининговый опросник оценивает выраженность признаков проблемного увлечения компьютерными играми у подростков за последние шесть месяцев. Семь пунктов охватывают поглощённость игрой, увеличение времени игры, использование игры для ухода от реальности, безуспешные попытки окружающих ограничить игру, неприятные переживания без игры, конфликты и пренебрежение важными делами. Русскоязычная версия GASA-RU предназначена для подростковой популяции и помогает оценивать выраженность игровых проблем в исследовательских и профилактических опросах.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Суммарная выраженность признаков игровой зависимости', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'polyteticCriteria', label: 'Число критериев с частотой не реже «иногда»', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'formula', formula: 'count(ответ >= 3)' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Никогда»', answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1 }, expected: { total: 7, polyteticCriteria: 0 } },
  { title: 'Четыре критерия отмечены как «Часто», остальные «Редко»', answers: { '1': 4, '2': 4, '3': 4, '4': 4, '5': 2, '6': 2, '7': 2 }, expected: { total: 18, polyteticCriteria: 4 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gasa-ru-tereshchenko-gorbacheva-2024-v1',
};
