import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';
import type { Methodology } from '../scoring/methodologies.js';

export type MethodologyRegistration = {
  instrument: SeedSection;
  scoringConfig?: ConfigurableScoring;
  validationCases?: ValidationCase[];
  formulaVersion?: string;
  /** Optional curated text; a usable catalog card is generated when omitted. */
  details?: Omit<Methodology, 'code' | 'title'>;
};

async function reviewSources(moduleName: string): Promise<Methodology['sources']> {
  const reviewName = moduleName.replace(/\.ts$/, '.md');
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
  try {
    const review = await readFile(join(repoRoot, 'docs', 'methodologies', 'reviews', reviewName), 'utf8');
    const urls = [...review.matchAll(/https?:\/\/[^\s)\]>]+/g)].map(([url]) => url.replace(/[.,;]+$/, ''));
    return [...new Set(urls)].slice(0, 8).map((url) => ({ title: url, url }));
  } catch {
    return [];
  }
}

function catalogDetails(registration: MethodologyRegistration): Omit<Methodology, 'code' | 'title'> {
  if (registration.details) return registration.details;
  const { instrument, scoringConfig, formulaVersion } = registration;
  const scales = scoringConfig?.scales ?? [];
  const steps = scales.length
    ? scales.map((scale) => `Шкала «${scale.label}»: ${scale.aggregation === 'sum' ? 'суммируются' : 'усредняются'} ответы по пунктам ${scale.items.join(', ')}${scale.reverseItems.length ? `. Обратные пункты (${scale.reverseItems.join(', ')}) перекодируются в диапазоне ${scoringConfig!.min}–${scoringConfig!.max}` : ''}.`)
    : ['В системе доступны вопросы методики; автоматический расчёт результата для этой версии не настроен.'];
  return {
    version: formulaVersion ?? 'версия подсчёта не указана',
    summary: instrument.description ?? 'Описание методики пока не добавлено.',
    steps,
    keys: scales.map((scale) => ({
      label: scale.label,
      value: `Пункты: ${scale.items.join(', ')}. ${scale.reverseItems.length ? `Обратные пункты: ${scale.reverseItems.join(', ')}. ` : ''}Расчёт: ${scale.aggregation === 'sum' ? 'сумма' : 'среднее'} ответов.`,
    })),
    notes: ['Сведения сформированы из зарегистрированного описания и ключа подсчёта. Если авторская публикация задаёт дополнительные правила или нормы, сверяйтесь с первоисточником.'],
    sources: [],
  };
}

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
    const details = catalogDetails(loaded.methodology);
    if (!details.sources.length) details.sources = await reviewSources(file);
    registrations.push({ ...loaded.methodology, details });
  }
  const codes = registrations.map(({ instrument }) => instrument.code);
  if (new Set(codes).size !== codes.length) throw new Error('Duplicate codes in methodology registry.');
  return registrations;
}
