import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

export type MethodologyRegistration = {
  instrument: SeedSection;
  scoringConfig?: ConfigurableScoring;
  validationCases?: ValidationCase[];
  formulaVersion?: string;
};

/** Loads independently-authored methodology modules without editing seed.ts. */
export async function loadMethodologyRegistry(): Promise<MethodologyRegistration[]> {
  const directory = join(dirname(fileURLToPath(import.meta.url)), 'methodologies');
  const extension = import.meta.url.endsWith('.ts') ? '.ts' : '.js';
  let files: string[];
  try {
    files = (await readdir(directory)).filter((file) => file.endsWith(extension)).sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }

  const registrations: MethodologyRegistration[] = [];
  for (const file of files) {
    const loaded = (await import(pathToFileURL(join(directory, file)).href)) as {
      methodology?: MethodologyRegistration;
    };
    if (!loaded.methodology?.instrument?.code?.startsWith('test_')) {
      throw new Error(`Invalid methodology registration module: ${file}`);
    }
    registrations.push(loaded.methodology);
  }
  const codes = registrations.map(({ instrument }) => instrument.code);
  if (new Set(codes).size !== codes.length) throw new Error('Duplicate codes in methodology registry.');
  return registrations;
}
