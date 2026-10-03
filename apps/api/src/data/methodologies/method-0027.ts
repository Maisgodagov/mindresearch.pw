import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Выраженно ближе к первому описанию' },
  { value: '2', label: 'Скорее ближе к первому описанию' },
  { value: '3', label: 'В равной степени к обоим описаниям' },
  { value: '4', label: 'Скорее ближе ко второму описанию' },
  { value: '5', label: 'Выраженно ближе ко второму описанию' },
];

const pairs: [string, string][] = [
  ['Составляю списки', 'Полагаюсь на память'],
  ['Скептически настроен', 'Хочу верить'],
  ['Скучаю, оставаясь в одиночестве', 'Нуждаюсь бывать в одиночестве'],
  ['Принимаю вещи такими, какие они есть', 'Недоволен положением вещей'],
  ['Поддерживаю порядок в комнате', 'Разбрасываю вещи, как придется'],
  ['Сравнение с роботом было бы для меня обидным', 'Стремлюсь мыслить, как механизм'],
  ['Энергичный', 'Мягкий'],
  ['Предпочту пройти тест с вариантами ответов', 'Предпочту написать эссе'],
  ['Хаотичный', 'Организованный'],
  ['Легкоранимый', 'Толстокожий'],
  ['Лучше работаю в коллективе', 'Лучше работаю самостоятельно'],
  ['Сфокусирован на настоящем', 'Сфокусирован на будущем'],
  ['Планирую далеко вперед', 'Решаю в последнюю минуту'],
  ['Хочу, чтобы меня уважали', 'Хочу, чтобы меня любили'],
  ['Вечеринки меня утомляют', 'Заряжаюсь бодростью на вечеринках'],
  ['Вписываюсь в коллектив', 'Держусь особняком'],
  ['Оставляю за собой свободу выбора', 'Беру на себя обязательства'],
  ['Хочу уметь чинить вещи', 'Хочу уметь исправлять людей'],
  ['Больше говорю', 'Больше слушаю'],
  ['Описывая событие, расскажу, что происходило', 'Описывая событие, расскажу, в чем его смысл'],
  ['Выполняю работу сразу же', 'Откладываю работу на потом'],
  ['Слушаю сердце', 'Слушаю рассудок'],
  ['Домосед', 'Провожу время вне дома'],
  ['Хочу видеть общую картину', 'Хочу видеть детали'],
  ['Импровизирую', 'Тщательно готовлюсь'],
  ['Основа морали — справедливость', 'Основа морали — сострадание'],
  ['Громко кричать для меня проблема', 'Запросто крикну человеку в отдалении'],
  ['Теоретик', 'Практик'],
  ['Делаю дело', 'Гуляю смело'],
  ['Испытываю дискомфорт от эмоций', 'Ценю эмоции'],
  ['Люблю выступать перед людьми', 'Избегаю говорить на публику'],
  ['Хочу знать «что?», «где?», «когда?»', 'Хочу знать «почему?»'],
];

const questions: SeedSection['questions'] = pairs.map(([left, right], index) => ({
  code: `test_68_${index + 1}`,
  text: `${left} / ${right}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_68',
  title: 'Определитель типа MBTI по Юнгу, OEJTS 1.2',
  description: "Опросник описывает предпочтения по четырём юнгианским дихотомиям и формирует один из 16 типологических профилей. Подходит для обсуждения индивидуальных предпочтений и самопознания; это не клиническая диагностика и не официальный MBTI.",
  questions,
};

const seq = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const formulaScale = (key: string, label: string, items: number[], signs: number[], offset: number) => ({
  key,
  label,
  items,
  reverseItems: [] as number[],
  // The generic scorer has no intercept field. For an even number of items,
  // adding offset / item-count to each coefficient reproduces the exact intercept
  // because each response is scored from 1 to 5 and centered around 3.
  weights: Object.fromEntries(items.map((item, index) => [item, signs[index] + offset / (items.length * 3)])),
  aggregation: 'sum' as const,
});

// The published equations use signed raw item values plus a constant; the
// coefficient adjustment above encodes each constant exactly in the sum scorer.
export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    formulaScale('IE', 'E / I (более 24 = E; иначе I)', [3, 7, 11, 15, 19, 23, 27, 31], [-1, -1, -1, 1, -1, 1, 1, -1], 30),
    formulaScale('SN', 'N / S (более 24 = N; иначе S)', [4, 8, 12, 16, 20, 24, 28, 32], [1, 1, 1, 1, 1, -1, -1, 1], 12),
    formulaScale('FT', 'T / F (более 24 = T; иначе F)', [2, 6, 10, 14, 18, 22, 26, 30], [-1, 1, 1, -1, -1, 1, -1, -1], 30),
    formulaScale('JP', 'P / J (более 24 = P; иначе J)', [1, 5, 9, 13, 17, 21, 25, 29], [1, 1, 1, -1, 1, -1, 1, -1], 18),
  ],
};

const answers = (values: number[]) => Object.fromEntries(values.map((value, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы по центру; каждая формула даёт 24',
    answers: Object.fromEntries(seq(1, 32).map(item => [String(item), 3])),
    expected: { IE: 24, SN: 24, FT: 24, JP: 24 },
  },
  {
    title: 'Ручная проверка формул: ответы 1..32 по порядку',
    answers: answers(seq(1, 32).map(item => ((item - 1) % 5) + 1)),
    expected: { IE: 26, SN: 22, FT: 24, JP: 18 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'oejts-1.2-openpsychometrics-2015-psytests-ru-v1',
};
