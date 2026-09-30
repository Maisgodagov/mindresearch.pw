import type { State } from './types';

export const makeState = (): State => ({
  methodology: {
    title: '',
    author: '',
    version: '1.0',
    year: null,
    summary: '',
    adaptation: '',
    rightsNote: '',
    steps: [],
    keys: [],
    notes: [],
    sources: [],
  },
  questions: [],
  options: [1, 2, 3, 4, 5].map((value) => ({ value: String(value), label: String(value) })),
  scoring: { min: 1, max: 5, scales: [] },
  cases: [],
});
