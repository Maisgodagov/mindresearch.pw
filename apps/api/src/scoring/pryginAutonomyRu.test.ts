import { describe, expect, it } from 'vitest';
import { pryginAutonomyRuInstrument, pryginAutonomyRuScoring, pryginAutonomyRuValidationCases } from '../data/pryginAutonomyRu.js';
import { calculateConfigurableScores, checkConfigurableCases, validateConfigurableMethodology } from './configurable.js';

describe('Prygin Autonomy–Dependence Questionnaire, adult/youth form', () => {
  it('contains 18 items and consolidates the two affirmative/negative response variants as the source scoring instructs', () => {
    expect(pryginAutonomyRuInstrument.questions).toHaveLength(18);
    expect(pryginAutonomyRuInstrument.questions.every(question => question.options?.length === 2)).toBe(true);
  });

  it('matches minimum, maximum-key-match, and mixed manual protocols', () => {
    expect(checkConfigurableCases({
      questions: pryginAutonomyRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: pryginAutonomyRuScoring,
      cases: pryginAutonomyRuValidationCases,
    }).passed).toBe(true);
  });

  it('scores each keyed response and rejects missing values', () => {
    expect(calculateConfigurableScores(pryginAutonomyRuScoring, pryginAutonomyRuValidationCases[0].answers)?.autonomy).toBe(0);
    expect(calculateConfigurableScores(pryginAutonomyRuScoring, pryginAutonomyRuValidationCases[1].answers)?.autonomy).toBe(18);
    expect(calculateConfigurableScores(pryginAutonomyRuScoring, { ...pryginAutonomyRuValidationCases[0].answers, '18': undefined })).toBeNull();
  });

  it('passes methodology constructor checks with rights uncertainty disclosed', () => {
    expect(validateConfigurableMethodology({
      methodology: {
        title: 'Опросник автономности—зависимости (Г. С. Прыгин), взрослая и юношеская форма',
        author: 'Г. С. Прыгин',
        version: 'prygin-autonomy-dependence-adult-youth-18-v1',
        year: 2009,
        summary: '18-пунктовая форма с суммарным количеством совпадений с ключом.',
        rightsNote: 'В источниках нет открытой лицензии на цифровое воспроизведение. Условия использования полного текста отдельно не подтверждены; это не означает разрешение на коммерческое использование.',
        steps: ['Выберите один из двух объединённых ответов: «Да / Пожалуй, да» или «Нет / Пожалуй, нет».'],
        notes: ['Пороговые группы приведены в карточке источника и не являются универсальной диагностической нормой.'],
        sources: [{ title: 'Авторская монография с формой и ключом', url: 'https://www.phantastike.com/common_psychology/self_dependence/html/?page=271' }],
      },
      questions: pryginAutonomyRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: pryginAutonomyRuScoring,
      cases: pryginAutonomyRuValidationCases,
    })).toEqual([]);
  });
});
