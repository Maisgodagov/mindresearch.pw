import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
];

const statements = [
  'Мне удается перехитрить какого-нибудь учителя, списать или прогулять урок',
  'Я справляюсь с задачей, которая раньше мне не давалась',
  'Родители хвалят меня за то, что я в чем-то лучше моих сверстников',
  'Я чувствую, что я успешен в учебе и / или других значимых для меня сферах жизни',
  'Мне удается справляться с разными жизненными проблемами',
  'Учитель ставит меня в пример моим одноклассникам',
  'Мне удается умело у кого-то списать и получить хорошую оценку',
  'Мой преподаватель говорит при всех, что я в чем-то лучше других',
  'Я что-то знаю или умею лучше других ребят, вызывая их зависть',
  'Мой тренер или преподаватель (в музыкальной, спортивной или художественной школе, по танцам и пр.) хвалит меня при всех за мои успехи',
  'Родители одобрительно отзываются родным и знакомым обо мне и моих успехах',
  'Мои родители одобряют мои поступки, при всех хвалят меня',
  'Мне удается ловко соврать родителям, и они этого не замечают',
  'Я преодолеваю лень и делаю какое-то нужное и полезное дело',
  'Мои родители хвалят при всех мои способности',
  'Мои учителя хвалят меня и ставят в пример другим',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1105_${index + 1}`,
  text: `Я уважаю себя, когда ${text.charAt(0).toLowerCase()}${text.slice(1)}.`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1105',
  title: 'Опросник оснований самоуважения подростков (ООСАП)',
  description: 'ООСАП оценивает, на каких основаниях подросток строит самоуважение: на собственной компетентности, одобрении родителей, одобрении учителей или компенсаторных псевдодостижениях. Профиль четырёх аспектов помогает исследователю или школьному психологу дополнить оценку общего самоуважения сведениями о его основаниях у подростков.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'competence', label: 'Самоуважение, основанное на компетентности', items: [2, 4, 5, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'teacher_approval', label: 'Самоуважение, основанное на одобрении учителей', items: [6, 8, 10, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'parent_approval', label: 'Самоуважение, основанное на одобрении родителей', items: [3, 11, 12, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'compensatory', label: 'Компенсаторное самоуважение', items: [1, 7, 9, 13], reverseItems: [], aggregation: 'sum' },
  ],
};

const allOnes = Object.fromEntries(Array.from({ length: 16 }, (_, index) => [String(index + 1), 1]));
const allFives = Object.fromEntries(Array.from({ length: 16 }, (_, index) => [String(index + 1), 5]));

const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: минимальный ответ по всем 16 пунктам дает 4 за каждую шкалу', answers: allOnes, expected: { competence: 4, teacher_approval: 4, parent_approval: 4, compensatory: 4 } },
  { title: 'Ручная проверка: максимальный ответ по всем 16 пунктам дает 20 за каждую шкалу', answers: allFives, expected: { competence: 20, teacher_approval: 20, parent_approval: 20, compensatory: 20 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lunkina-gordeeva-oosap-2019-v1',
};
