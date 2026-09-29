import { describe, expect, it } from 'vitest';
import { karabanovaAutonomyRuInstrument, karabanovaAutonomyRuScoring, karabanovaAutonomyRuValidationCases } from '../data/karabanovaAutonomyRu.js';
import { calculateConfigurableScores, checkConfigurableCases, validateConfigurableMethodology } from './configurable.js';

describe('Karabanova–Poskrebysheva Adolescent Autonomy Questionnaire', () => {
  it('contains the complete 12-item form and five-point response scale', () => {
    expect(karabanovaAutonomyRuInstrument.questions).toHaveLength(12);
    expect(karabanovaAutonomyRuInstrument.questions.every(question => question.options?.length === 5)).toBe(true);
  });

  it('matches minimum, maximum, and mixed manual calculations for all four subscales and raw total', () => {
    expect(checkConfigurableCases({
      questions: karabanovaAutonomyRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: karabanovaAutonomyRuScoring,
      cases: karabanovaAutonomyRuValidationCases,
    }).passed).toBe(true);
  });

  it('reverses only the three published subscale items and rejects missing values', () => {
    expect(calculateConfigurableScores(karabanovaAutonomyRuScoring, karabanovaAutonomyRuValidationCases[0].answers)).toEqual({ emotional: 7, cognitive: 3, behavioral: 7, values: 7, total: 12 });
    expect(calculateConfigurableScores(karabanovaAutonomyRuScoring, { ...karabanovaAutonomyRuValidationCases[0].answers, '12': undefined })).toBeNull();
  });

  it('passes methodology constructor checks with rights uncertainty disclosed', () => {
    expect(validateConfigurableMethodology({
      methodology: {
        title: 'Опросник автономии подростка (О. А. Карабанова, Н. Н. Поскребышева)',
        author: 'О. А. Карабанова, Н. Н. Поскребышева',
        version: 'karabanova-poskrebysheva-adolescent-autonomy-12-v1',
        year: 2014,
        summary: '12 утверждений, четыре субшкалы и общий показатель автономии.',
        rightsNote: 'Открытая лицензия на цифровое воспроизведение полного бланка не указана; включение не означает разрешение на коммерческое использование.',
        steps: ['Оцените каждое утверждение по шкале от 1 («совершенно не верно») до 5 («совершенно верно»).'],
        notes: ['Общий балл рассчитывается в соответствии с опубликованным приложением; сырой общий индекс и субшкалы отличаются по обработке обратных пунктов.'],
        sources: [{ title: 'Статья авторов', url: 'https://doi.org/10.11621/npj.2014.0404' }],
      },
      questions: karabanovaAutonomyRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: karabanovaAutonomyRuScoring,
      cases: karabanovaAutonomyRuValidationCases,
    })).toEqual([]);
  });
});
