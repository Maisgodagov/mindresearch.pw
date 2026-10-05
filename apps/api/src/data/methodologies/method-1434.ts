import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Почти всегда' },
];

const items = [
  'Мне трудно попросить своего партнера о том, чего я хочу в сексе.',
  'Я боюсь проявлять свои сексуальные эмоции полностью.',
  'Я боюсь дать понять своему партнеру, что в сексе доставляет мне удовольствие.',
  'Я признаю, что мое наслаждение сексом в значительной степени зависит от наслаждения моего партнера.',
  'Я боюсь, что мое тело может показаться моему партнеру непривлекательным.',
  'Я боюсь, что мой партнер может быть потрясен моими сексуальными эмоциями.',
  'Я втайне мечтаю, чтобы мой партнер уделял мне больше внимания, когда мы занимаемся любовью.',
  'Я воспринимаю секс, главным образом, как физическую разрядку.',
  'Я боюсь, что не смогу удовлетворить своего партнера.',
  'Я считаю секс тяжелой работой.',
  'Я испытываю печаль и одиночество после занятия сексом.',
  'Я использую секс для того, чтобы сгладить споры с партнером.',
  'Я ревную, когда мой партнер обращает внимание на других.',
  'Я испытываю страх, когда мой партнер проявляет инициативу заняться со мной сексом.',
  'Я боюсь проявлять инициативу по поводу занятия сексом с партнером.',
  'Я боюсь потерять контроль во время занятия любовью.',
  'Я боюсь, что мой партнер не поддержит то, что я делаю и ощущаю во время секса.',
  'Я не считаю, что мастурбация доставляет удовольствие и удовлетворение.',
  'Я боюсь изучать свое тело и то, что доставляет ему удовольствие.',
  'Я боюсь выражать свою истинную сущность во время занятия любовью.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1462_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1462',
  title: 'Преграды для сексуальной близости',
  description: 'Опросник самооценки выявляет внутренние барьеры сексуальной близости: трудности с доверием и эмоциональной открытостью, страх уязвимости и потери контроля, опасения по поводу собственного тела и реакции партнера, а также трудности с выражением желаний и инициативы. Подходит взрослым людям, оценивающим близкие партнерские отношения; опубликованная форма представлена как самооценка в книге Уайнхолд и Уайнхолд.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [{ key: 'sexualIntimacyBarriers', label: 'Преграды для сексуальной близости', items: items.map((_, index) => index + 1), reverseItems: [], aggregation: 'sum' }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Никогда»: минимальный итог 20',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { sexualIntimacyBarriers: 20 },
  },
  {
    title: 'Все ответы «Почти всегда»: максимальный итог 80',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { sexualIntimacyBarriers: 80 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'weinhold-barriers-sexual-intimacy-2008-shepeleva-2011-v1',
};
