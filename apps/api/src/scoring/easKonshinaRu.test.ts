import { describe, expect, it } from 'vitest';
import { easKonshinaRuInstrument, easKonshinaRuScoring, easKonshinaRuValidationCases } from '../data/easKonshinaRu.js';
import { calculateConfigurableScores, checkConfigurableCases, validateConfigurableMethodology } from './configurable.js';

describe('Russian Emotional Autonomy Scale (Konshina & Sadovnikova)', () => {
  it('contains the complete 20-item Russian form and four-point response scale', () => {
    expect(easKonshinaRuInstrument.questions).toHaveLength(20);
    expect(easKonshinaRuInstrument.questions.every(question => question.options?.length === 4)).toBe(true);
  });

  it('matches minimum, maximum, and mixed manual scoring protocols', () => {
    expect(checkConfigurableCases({
      questions: easKonshinaRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: easKonshinaRuScoring,
      cases: easKonshinaRuValidationCases,
    }).passed).toBe(true);
  });

  it('reverses each negatively keyed item and rejects a missing answer', () => {
    expect(calculateConfigurableScores(easKonshinaRuScoring, easKonshinaRuValidationCases[0].answers)?.emotionalAutonomy).toBe(53);
    expect(calculateConfigurableScores(easKonshinaRuScoring, { ...easKonshinaRuValidationCases[0].answers, '18': undefined })).toBeNull();
  });

  it('passes the methodology constructor checks with a recorded rights basis', () => {
    expect(validateConfigurableMethodology({
      methodology: {
        title: 'Шкала эмоциональной автономии (EAS), русская версия Коньшиной и Садовниковой',
        author: 'L. Steinberg, S. Silverberg; русская версия Т. М. Коньшиной и Т. Ю. Садовниковой',
        version: 'konshina-sadovnikova-ru-2022-eas-20-v1',
        year: 2022,
        summary: '20 пунктов, четыре шкалы и общий показатель эмоциональной автономии.',
        rightsNote: 'Статья-адаптация CC BY-NC; коммерческое использование не разрешено этой лицензией. Отдельные условия оригинала указаны в карточке.',
        steps: ['Ответьте на все пункты по шкале 1–4.'],
        notes: ['Не использовать как диагноз.'],
        sources: [{ title: 'Первичная публикация', url: 'https://doi.org/10.11621/pir.2022.0306' }],
      },
      questions: easKonshinaRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: easKonshinaRuScoring,
      cases: easKonshinaRuValidationCases,
    })).toEqual([]);
  });
});
