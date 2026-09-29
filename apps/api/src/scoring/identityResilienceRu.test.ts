import { describe, expect, it } from 'vitest';
import { identityResilienceRuInstrument, identityResilienceRuScoring, identityResilienceRuValidationCases } from '../data/identityResilienceRu.js';
import { calculateConfigurableScores, checkConfigurableCases, validateConfigurableMethodology } from './configurable.js';

describe('Identity Resilience Index, Russian adaptation', () => {
  it('contains the exact 16-item Russian form and five response options', () => {
    expect(identityResilienceRuInstrument.questions).toHaveLength(16);
    expect(identityResilienceRuInstrument.questions.every(question => question.options?.length === 5)).toBe(true);
  });

  it('reproduces the minimum, maximum, and mixed manual subscale sums', () => {
    expect(checkConfigurableCases({
      questions: identityResilienceRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: identityResilienceRuScoring,
      cases: identityResilienceRuValidationCases,
    }).passed).toBe(true);
  });

  it('reverses only items 2, 3, 4, and 14 and rejects incomplete protocols', () => {
    expect(calculateConfigurableScores(identityResilienceRuScoring, identityResilienceRuValidationCases[0].answers)).toEqual({ selfEsteem: 16, selfEfficacy: 4, continuity: 4, uniqueness: 8 });
    expect(calculateConfigurableScores(identityResilienceRuScoring, { ...identityResilienceRuValidationCases[0].answers, '16': undefined })).toBeNull();
  });

  it('passes constructor validation while disclosing unresolved digital reproduction rights', () => {
    expect(validateConfigurableMethodology({
      methodology: {
        title: 'Индекс устойчивости идентичности (IRI; русская адаптация Я. А. Соловьёвой и М. А. Одинцовой)',
        author: 'G. M. Breakwell, E. Fino, R. Jaspal; адаптация Я. А. Соловьёвой и М. А. Одинцовой',
        version: 'iri-ru-solovyeva-odintsova-2023-16-v1',
        year: 2023,
        summary: '16 утверждений, четыре отдельные шкалы; общего балла и диагностических порогов в реализации нет.',
        rightsNote: 'Открытая лицензия на цифровое воспроизведение полного бланка не обнаружена; включение не означает разрешение на коммерческое использование.',
        steps: ['Оцените степень согласия с каждым утверждением по шкале от 1 до 5.'],
        notes: ['Результат рассчитывается отдельно по четырём опубликованным шкалам.'],
        sources: [{ title: 'Адаптация русской версии', url: 'https://doi.org/10.51944/20738544_2023_2_21' }],
      },
      questions: identityResilienceRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: identityResilienceRuScoring,
      cases: identityResilienceRuValidationCases,
    })).toEqual([]);
  });
});
