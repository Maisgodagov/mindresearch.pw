import type { SeedSection } from '../types.js';

export const briefCopeRuOptions = [
  { value: '1', label: 'Никогда или почти никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Время от времени' },
  { value: '4', label: 'Очень часто' },
];

// Item numbering follows the 32-item Russian form in Pavlova et al. (2022).
// The validated revised form retains 24 items; omitted item numbers are intentional.
export const briefCopeRuItems: ReadonlyArray<{ number: number; text: string }> = [
  { number: 1, text: 'Я погружаюсь в работу или другие дела, чтобы отключиться от проблем.' },
  { number: 2, text: 'Я сосредоточиваю усилия на том, чтобы как-то решить проблему.' },
  { number: 3, text: 'Я говорю себе: «Этого не может быть».' },
  { number: 4, text: 'Я прошу помощи у Бога.' },
  { number: 6, text: 'Я стараюсь получить эмоциональную поддержку у друзей или родных.' },
  { number: 8, text: 'Я надеюсь на то, что Бог мне поможет.' },
  { number: 9, text: 'Я предпринимаю какие-то ещё действия, стараясь преодолеть сложившуюся ситуацию.' },
  { number: 11, text: 'Я предаюсь фантазиям на другие темы, чтобы отвлечься.' },
  { number: 12, text: 'Я даю выход своим переживаниям.' },
  { number: 13, text: 'Мне не хочется верить, что это произошло.' },
  { number: 14, text: 'Я ищу совета у других людей, что делать.' },
  { number: 16, text: 'Я думаю, как лучше всего я могу справиться с этой проблемой.' },
  { number: 17, text: 'Я ищу сочувствия и понимания у других людей.' },
  { number: 19, text: 'Я учусь жить с этим.' },
  { number: 21, text: 'Я перевожу случившееся в шутку.' },
  { number: 23, text: 'Я стараюсь принять ситуацию, сжиться с ней.' },
  { number: 24, text: 'Я переживаю и активно проявляю свои чувства.' },
  { number: 25, text: 'Я пытаюсь найти утешение в вере (религии).' },
  { number: 26, text: 'Я говорю с кем-нибудь, кто мог бы конкретно помочь решить мою проблему.' },
  { number: 27, text: 'Я стараюсь привыкнуть к мысли, что это случилось, адаптироваться к ситуации.' },
  { number: 28, text: 'Я тщательно обдумываю шаги, которые буду предпринимать для решения проблемы.' },
  { number: 29, text: 'Я молюсь (больше, чем обычно).' },
  { number: 30, text: 'Я стараюсь принять то, что случилось, привыкнуть к этому.' },
  { number: 32, text: 'Я нахожу в случившемся забавные моменты.' },
];

export const briefCopeRuInstrument: SeedSection = {
  code: 'test_20',
  title: 'Brief COPE — краткая русская версия (24 пункта)',
  description: 'Пересмотренная русская версия Brief COPE, проверенная на выборке российских школьных педагогов. Шесть шкал второго порядка; оригинальная 28-пунктовая структура здесь не используется.',
  questions: briefCopeRuItems.map(({ number, text }) => ({
    code: `test_20_${number}`,
    text,
    type: 'single',
    required: true,
    options: briefCopeRuOptions,
  })),
};
