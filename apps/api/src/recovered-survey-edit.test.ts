import { describe, expect, it, vi } from 'vitest';
import { assertRecoveredStructure, canEditRecoveredSurvey, updateRecoveredSurvey } from './recovered-survey-edit.js';
import { priorityQuestions } from './data/instrumentForms.js';

const surveyId = '6b64468e-d38e-471b-ab1a-a51e6a491a80';
const stored = [{ id: 'custom', instrumentId: null, questions: [{ id: 'q1' }, { id: 'q2' }] }, { id: 'library', instrumentId: 'instrument', questions: [] }];
const incoming = [{ id: 'custom', kind: 'custom', questions: [{ id: 'q1', text: 'Changed', type: 'multiple' }, { id: 'q2' }] }, { id: 'library', kind: 'library', instrumentId: 'instrument', formGender: 'female' }];

describe('Recovered survey editing exceptions', () => {
  it('allows only the two specific surveys', () => {
    expect(canEditRecoveredSurvey(surveyId)).toBe(true);
    expect(canEditRecoveredSurvey('9c9a8e58-d204-49bb-a5a0-29a8e8f6abc0')).toBe(true);
    expect(canEditRecoveredSurvey('f7cc998d-6a95-4a82-a22b-ec9e2416f84b')).toBe(false);
    expect(canEditRecoveredSurvey('other')).toBe(false);
  });
  it('allows field changes while rejecting block replacement, deletion and reordering', () => {
    expect(() => assertRecoveredStructure(stored, incoming)).not.toThrow();
    for (const changed of [incoming.slice(1), [...incoming].reverse(), [...incoming, incoming[0]], [incoming[0], { ...incoming[1], instrumentId: 'other' }]]) {
      expect(() => assertRecoveredStructure(stored, changed)).toThrow();
    }
  });
  it('rejects question removal, replacement and reordering', () => {
    for (const questions of [[{ id: 'q1' }], [{ id: 'q2' }, { id: 'q1' }], [{ id: 'new' }, { id: 'q2' }]]) {
      expect(() => assertRecoveredStructure(stored, [{ ...incoming[0], questions }, incoming[1]])).toThrow();
    }
  });
  it('updates existing question IDs without writing responses or scores, and uses canonical forms', async () => {
    const base = priorityQuestions('test_3001');
    const query = vi.fn(async (sql: string) => {
      if (sql.includes('FROM sections')) return [[{ id: 'library', code: 'test_3001', instrumentId: 'instrument' }]];
      if (sql.includes('FROM instrument_questions')) return [base];
      return [base.map((q, i) => ({ id: `saved-${i}`, code: q.code }))];
    });
    const execute = vi.fn(async () => []);
    const connection = { query, execute } as any;
    for (const formGender of ['female', 'male']) {
      await updateRecoveredSurvey(connection, surveyId, [{ id: 'library', kind: 'library', instrumentId: 'instrument', formGender, formFallback: 'male' }]);
    }
    expect(execute).toHaveBeenCalledTimes(24);
    expect(execute.mock.calls.every(([sql]: any) => sql.startsWith('UPDATE questions SET'))).toBe(true);
    expect((execute.mock.calls as any)[0][1][3]).toBe('saved-0');
    expect((execute.mock.calls as any)[12][1][0]).toBe(base[0].text);
    await expect(updateRecoveredSurvey(connection, 'other', [])).rejects.toThrow();
  });
});
