import { expect, it, vi } from 'vitest';
import { instrument, methodology, scoringConfig } from '../data/methodologies/method-1363.js';

const database = vi.hoisted(() => ({ query: vi.fn(), execute: vi.fn().mockResolvedValue([{}]) }));
vi.mock('../db.js', () => ({ db: database }));
import { calculateConfiguredAssessmentsForSession } from './index.js';

it('saves the MC-SDS result and range from stored JSON yes/no answers', async () => {
  database.query.mockResolvedValue([instrument.questions.map(question => ({
    sectionId: 'section-mcsds', sectionCode: instrument.code, questionCode: question.code,
    value: JSON.stringify('yes'), title: instrument.title, formulaVersion: methodology.formulaVersion,
    scoringConfig: JSON.stringify(scoringConfig),
  }))]);
  await calculateConfiguredAssessmentsForSession('session-mcsds', [instrument.code]);
  const [sql, parameters] = database.execute.mock.calls[0];
  expect(sql).toContain('INSERT INTO assessment_results');
  expect(parameters.slice(0, 3)).toEqual(['session-mcsds', 'section-mcsds', 'hanin-marlowe-crowne-20item-key-v2']);
  expect(JSON.parse(parameters[3])).toMatchObject({ complete: true, answered: 20, scales: { approval_motivation: { score: 11, min: 0, max: 20, minScore: 0, maxScore: 20, itemCount: 20 } } });
});
