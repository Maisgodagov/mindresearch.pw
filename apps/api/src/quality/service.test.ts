import { EventEmitter } from 'node:events';
import { expect, it, vi } from 'vitest';

const { query, execute, tasks } = vi.hoisted(() => ({
  query: vi.fn(),
  execute: vi.fn(),
  tasks: [] as string[],
}));
vi.mock('../db.js', () => ({ db: { query, execute } }));
vi.mock('../community/router.js', () => ({ settleCommunity: vi.fn() }));
vi.mock('./worker-runtime.js', () => ({
  createQualityWorker() {
    const worker = new EventEmitter();
    return Object.assign(worker, {
      terminate: vi.fn(),
      postMessage(message: { task: string; people: {id: string}[]; baseline: unknown }) {
        tasks.push(message.task);
        const value = message.task === 'baseline'
          ? { id: 'fresh', version: 'fresh', config: { version: '2.0.0' }, configHash: 'new' }
          : { results: Object.fromEntries(message.people.map(p => [p.id, {
            algorithm_version: '2.0.0', baseline_version: 'fresh', input_hash: 'hash',
          }])) };
        queueMicrotask(() => worker.emit('message', { type: 'result', value }));
      },
    });
  },
}));

import { recompute } from './service.js';

it('replaces incompatible calibration, recalculating the entire survey before switching versions', async () => {
  const people = Array.from({length: 10}, (_, i) => ({
    id: String(i), status: 'completed', startedAt: '2026-01-01', completedAt: '2026-01-01',
  }));
  query.mockResolvedValueOnce([[]]).mockResolvedValueOnce([people]).mockResolvedValueOnce([[]])
    .mockResolvedValueOnce([[{ snapshot: { itemHash: 'stale', config: { version: '2.0.0' } } }]]);
  execute.mockResolvedValue([]);

  const result = await recompute('survey', { sessionId: '1' });

  expect(tasks).toEqual(['baseline', 'calculate']);
  expect(result).toMatchObject({ count: 10, baseline_version: 'fresh' });
  const writes = execute.mock.calls.map(([sql]) => sql);
  expect(writes.filter(sql => sql.includes('INSERT INTO quality_result_heads'))).toHaveLength(10);
  expect(writes.at(-1)).toContain('INSERT INTO quality_settings');
});
