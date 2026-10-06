import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем не согласен' },
  { value: '1', label: 'Скорее не согласен' },
  { value: '2', label: 'Скорее согласен' },
  { value: '3', label: 'Полностью согласен' },
];

const items: { text: string; subscale: 'mp' | 'mu' | 'vp' | 'vu' | 've'; reverse: boolean }[] = [
  { text: 'Я замечаю, когда близкий человек переживает, даже если он (она) пытается это скрыть', subscale: 'mp', reverse: false },
  { text: 'Если человек на меня обижается, я не знаю, как восстановить с ним хорошие отношения', subscale: 'mu', reverse: true },
  { text: 'Мне легко догадаться о чувствах человека по выражению его лица', subscale: 'mp', reverse: false },
  { text: 'Я хорошо знаю, чем заняться, чтобы улучшить себе настроение', subscale: 'vu', reverse: false },
  { text: 'У меня обычно не получается повлиять на эмоциональное состояние своего собеседника', subscale: 'mu', reverse: true },
  { text: 'Когда я раздражаюсь, то не могу сдержаться, и говорю всё, что думаю', subscale: 've', reverse: true },
  { text: 'Я хорошо понимаю, почему мне нравятся или не нравятся те или иные люди', subscale: 'vp', reverse: false },
  { text: 'Я не сразу замечаю, когда начинаю злиться', subscale: 'vp', reverse: true },
  { text: 'Я умею улучшить настроение окружающих', subscale: 'mu', reverse: false },
  { text: 'Если я увлекаюсь разговором, то говорю слишком громко и активно жестикулирую', subscale: 've', reverse: true },
  { text: 'Я понимаю душевное состояние некоторых людей без слов', subscale: 'mp', reverse: false },
  { text: 'В экстремальной ситуации я не могу усилием воли взять себя в руки', subscale: 'vu', reverse: true },
  { text: 'Я легко понимаю мимику и жесты других людей', subscale: 'mp', reverse: false },
  { text: 'Когда я злюсь, я знаю, почему', subscale: 'vp', reverse: false },
  { text: 'Я знаю, как ободрить человека, находящегося в тяжелой ситуации', subscale: 'mu', reverse: false },
  { text: 'Окружающие считают меня слишком эмоциональным человеком', subscale: 've', reverse: true },
  { text: 'Я способен успокоить близких, когда они находятся в напряжённом состоянии', subscale: 'mu', reverse: false },
  { text: 'Мне бывает трудно описать, что я чувствую по отношению к другим', subscale: 'vp', reverse: true },
  { text: 'Если я смущаюсь при общении с незнакомыми людьми, то могу это скрыть', subscale: 've', reverse: false },
  { text: 'Глядя на человека, я легко могу понять его эмоциональное состояние', subscale: 'mp', reverse: false },
  { text: 'Я контролирую выражение чувств на своем лице', subscale: 've', reverse: false },
  { text: 'Бывает, что я не понимаю, почему испытываю то или иное чувство', subscale: 'vp', reverse: true },
  { text: 'В критических ситуациях я умею контролировать выражение своих эмоций', subscale: 've', reverse: false },
  { text: 'Если надо, я могу разозлить человека', subscale: 'mu', reverse: false },
  { text: 'Когда я испытываю положительные эмоции, я знаю, как поддержать это состояние', subscale: 'vu', reverse: false },
  { text: 'Как правило, я понимаю, какую эмоцию испытываю', subscale: 'vp', reverse: false },
  { text: 'Если собеседник пытается скрыть свои эмоции, я сразу чувствую это', subscale: 'mp', reverse: false },
  { text: 'Я знаю как успокоиться, если я разозлился', subscale: 'vu', reverse: false },
  { text: 'Можно определить, что чувствует человек, просто прислушиваясь к звучанию его голоса', subscale: 'mp', reverse: false },
  { text: 'Я не умею управлять эмоциями других людей', subscale: 'mu', reverse: true },
  { text: 'Мне трудно отличить чувство вины от чувства стыда', subscale: 'vp', reverse: true },
  { text: 'Я умею точно угадывать, что чувствуют мои знакомые', subscale: 'mp', reverse: false },
  { text: 'Мне трудно справляться с плохим настроением', subscale: 'vu', reverse: true },
  { text: 'Если внимательно следить за выражением лица человека, то можно понять, какие эмоции он скрывает', subscale: 'mp', reverse: false },
  { text: 'Я не нахожу слов, чтобы описать свои чувства друзьям', subscale: 'vp', reverse: true },
  { text: 'Мне удаётся поддержать людей, которые делятся со мной своими переживаниями', subscale: 'mu', reverse: false },
  { text: 'Я умею контролировать свои эмоции', subscale: 'vu', reverse: false },
  { text: 'Если мой собеседник начинает раздражаться, я подчас замечаю это слишком поздно', subscale: 'mp', reverse: true },
  { text: 'По интонациям моего голоса легко догадаться о том, что я чувствую', subscale: 've', reverse: true },
  { text: 'Если близкий человек плачет, я теряюсь', subscale: 'mu', reverse: true },
  { text: 'Мне бывает весело или грустно без всякой причины', subscale: 'vp', reverse: true },
  { text: 'Мне трудно предвидеть смену настроения у окружающих меня людей', subscale: 'mp', reverse: true },
  { text: 'Я не умею преодолевать страх', subscale: 'vu', reverse: true },
  { text: 'Бывает, что я хочу поддержать человека, а он этого не чувствует, не понимает', subscale: 'mu', reverse: true },
  { text: 'У меня бывают чувства, которые я не могу точно определить', subscale: 'vp', reverse: true },
  { text: 'Я не понимаю, почему некоторые люди на меня обижаются', subscale: 'mp', reverse: true },
];

const questions: SeedSection['questions'] = items.map((item, index) => ({
  code: `test_1894_${index + 1}`,
  text: item.text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1894',
  title: 'Опросник эмоционального интеллекта ЭмИн',
  description: 'Опросник Д. В. Люсина оценивает субъективно воспринимаемые способности понимать и регулировать собственные эмоции и эмоции других людей. Пять субшкал охватывают понимание чужих эмоций, управление чужими эмоциями, понимание своих эмоций, управление своими эмоциями и контроль внешнего выражения эмоций; составные шкалы показывают межличностный и внутриличностный аспекты, понимание и управление эмоциями, а также их общий показатель. Полная версия 2006 года предназначена для самоотчётного исследования взрослых респондентов.',
  questions,
};

const groups = {
  mp: { label: 'Понимание чужих эмоций (МП)', items: items.flatMap((x, i) => x.subscale === 'mp' ? [i + 1] : []) },
  mu: { label: 'Управление чужими эмоциями (МУ)', items: items.flatMap((x, i) => x.subscale === 'mu' ? [i + 1] : []) },
  vp: { label: 'Понимание своих эмоций (ВП)', items: items.flatMap((x, i) => x.subscale === 'vp' ? [i + 1] : []) },
  vu: { label: 'Управление своими эмоциями (ВУ)', items: items.flatMap((x, i) => x.subscale === 'vu' ? [i + 1] : []) },
  ve: { label: 'Контроль экспрессии (ВЭ)', items: items.flatMap((x, i) => x.subscale === 've' ? [i + 1] : []) },
};
const reversed = (keys: (keyof typeof groups)[]) => items.flatMap((x, i) => keys.includes(x.subscale) && x.reverse ? [i + 1] : []);
const scales = [
  ...Object.entries(groups).map(([key, value]) => ({ key, label: value.label, items: value.items, reverseItems: reversed([key as keyof typeof groups]), aggregation: 'sum' as const })),
  { key: 'mei', label: 'Межличностный эмоциональный интеллект (МЭИ)', items: [...groups.mp.items, ...groups.mu.items], reverseItems: reversed(['mp', 'mu']), aggregation: 'sum' as const },
  { key: 'vei', label: 'Внутриличностный эмоциональный интеллект (ВЭИ)', items: [...groups.vp.items, ...groups.vu.items, ...groups.ve.items], reverseItems: reversed(['vp', 'vu', 've']), aggregation: 'sum' as const },
  { key: 'pe', label: 'Понимание эмоций (ПЭ)', items: [...groups.mp.items, ...groups.vp.items], reverseItems: reversed(['mp', 'vp']), aggregation: 'sum' as const },
  { key: 'ue', label: 'Управление эмоциями (УЭ)', items: [...groups.mu.items, ...groups.vu.items, ...groups.ve.items], reverseItems: reversed(['mu', 'vu', 've']), aggregation: 'sum' as const },
  { key: 'oei', label: 'Общий эмоциональный интеллект (ОЭИ)', items: items.map((_, i) => i + 1), reverseItems: reversed(['mp', 'mu', 'vp', 'vu', 've']), aggregation: 'sum' as const },
];

export const scoringConfig: ConfigurableScoring = { min: 0, max: 3, scales };

const allAnswers = (value: string) => Object.fromEntries(items.map((_, i) => [String(i + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все прямые/обратные пункты получают 3 после реверса', answers: allAnswers('3'), expected: { mp: 54, mu: 36, vp: 45, vu: 30, ve: 24, mei: 90, vei: 99, pe: 99, ue: 90, oei: 189 } },
  { title: 'Ручная проверка пункта 2: обратный ответ 3 преобразуется в 0', answers: { ...allAnswers('0'), '2': '3' }, expected: { mp: 0, mu: 0, vp: 0, vu: 0, ve: 0, mei: 0, vei: 0, pe: 0, ue: 0, oei: 0 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'emin-lyusin-2006-five-subscales-and-four-composites-v1',
};
