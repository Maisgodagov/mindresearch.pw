import type { Instrument, Question } from './types';

export const russianCatalogExclusions = new Set([
  'test_4', // NSPS — Russian translation without confirmed psychometric adaptation
  'test_8', // AMS-C 28 — English form
  'test_10', // GPS — English student form
  'test_11', // PPS-12 — English form
  'test_15', // IPIP-NEO-120 — English public-domain form
  'test_16', // Mini-IPIP — English public-domain form
  'test_18', // CSES — English form
]);

export const filterRussianCatalog = (items: Instrument[]) =>
  items.filter((instrument) => !russianCatalogExclusions.has(instrument.code ?? ''));

export const questionTypeOptions = [
  { value: 'single', label: 'Один вариант' },
  { value: 'multiple', label: 'Несколько вариантов' },
  { value: 'text', label: 'Текстовый ответ' },
  { value: 'number', label: 'Числовой ответ' },
] as const;

export const makeQuestion = (): Question => ({
  id: crypto.randomUUID(),
  text: '',
  type: 'single',
  required: true,
  options: [
    { value: '1', label: '' },
    { value: '2', label: '' },
  ],
});
