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
  const reviewName = moduleName.replace(/\.(?:ts|js)$/, '.md');
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
  try {
    const review = await readFile(join(repoRoot, 'docs', 'methodologies', 'reviews', reviewName), 'utf8');
    const sources: Methodology['sources'] = [];
    const seen = new Set<string>();
    const addSource = (title: string, url: string) => {
      const normalizedUrl = url.replace(/[.,;]+$/, '');
      if (!seen.has(normalizedUrl)) {
        seen.add(normalizedUrl);
        sources.push({ title: title.trim().slice(0, 500) || 'Источник методики', url: normalizedUrl });
      }
    };
    for (const [, title, url] of review.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)) addSource(title, url);
    for (const line of review.split(/\r?\n/)) {
      for (const match of line.matchAll(/https?:\/\/[^\s)\]>]+/g)) {
        const url = match[0].replace(/[.,;]+$/, '');
        if (seen.has(url)) continue;
        const title = line
          .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1')
          .replace(/https?:\/\/[^\s)\]>]+/g, '')
          .replace(/^\s*[-*]\s*/, '')
          .replace(/[;:,\s]+$/, '');
        addSource(title || url, url);
      }
    }
    return sources.slice(0, 20);
  } catch {
    return [];
  }
}

function catalogDetails(registration: MethodologyRegistration): Omit<Methodology, 'code' | 'title'> {
  if (registration.details) return registration.details;
  const { instrument, scoringConfig, formulaVersion } = registration;
  const scales = scoringConfig?.scales ?? [];
  const steps = scales.length
    ? scales.map((scale) => `Шкала «${scale.label}»: ${scale.aggregation === 'sum' ? '\u0441\u0443\u043c\u043c\u0438\u0440\u0443\u044e\u0442\u0441\u044f' : scale.aggregation === 'mean' ? '\u0443\u0441\u0440\u0435\u0434\u043d\u044f\u044e\u0442\u0441\u044f' : `\u043f\u043e\u0434\u0441\u0447\u0438\u0442\u044b\u0432\u0430\u044e\u0442\u0441\u044f \u0432\u044b\u0431\u043e\u0440\u044b \u00ab${scale.optionValue}\u00bb`} ответы по пунктам ${scale.items.join(', ')}${scale.reverseItems.length ? `. Обратные пункты (${scale.reverseItems.join(', ')}) перекодируются в диапазоне ${scoringConfig!.min}–${scoringConfig!.max}` : ''}.`)
    : ['В системе доступны вопросы методики; автоматический расчёт результата для этой версии не настроен.'];
  return {
    version: formulaVersion ?? 'версия подсчёта не указана',
    summary: instrument.description ?? 'Описание методики пока не добавлено.',
    steps,
    keys: scales.map((scale) => ({
      label: scale.label,
      value: `Пункты: ${scale.items.join(', ')}. ${scale.reverseItems.length ? `Обратные пункты: ${scale.reverseItems.join(', ')}. ` : ''}Расчёт: ${scale.aggregation === 'sum' ? '\u0441\u0443\u043c\u043c\u0430' : scale.aggregation === 'mean' ? '\u0441\u0440\u0435\u0434\u043d\u0435\u0435' : `\u0447\u0438\u0441\u043b\u043e \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u0445 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u043e\u0432 \u00ab${scale.optionValue}\u00bb`} ответов.`,
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
