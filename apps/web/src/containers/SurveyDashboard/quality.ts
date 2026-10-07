import type { Respondent } from './types';
export type { QualityV2 as Quality, Index, Flag } from '../../../../api/src/quality/types';
import type { QualityV2 as Quality } from '../../../../api/src/quality/types';
export const QUALITY_VERSION = '2.0.0';
export const COHORTS = { unassigned: 'Не размечена', trusted: 'Личное приглашение', public: 'Публичный набор', admin_test: 'Проверка администратора' };
export const STATUS = { high: 'Высокий', acceptable: 'Приемлемый', review: 'Проверить', high_concern: 'Выраженные признаки', insufficient_data: 'Недостаточно данных' };
export const METRICS = [
  { key: 'overall', label: 'Общий индекс', unit: 'баллы' },
  { key: 'behavioral', label: 'Поведенческий индекс', unit: 'баллы' },
  { key: 'response', label: 'Качество ответов', unit: 'баллы' },
  { key: 'confidence', label: 'Уверенность общего индекса', unit: '%' },
  { key: 'behaviorConfidence', label: 'Уверенность поведенческого', unit: '%' },
  { key: 'responseConfidence', label: 'Уверенность ответов', unit: '%' },
  { key: 'rpr', label: 'RPR', unit: 'r' },
  { key: 'pairs', label: 'Согласованность пар', unit: '0–1' },
  { key: 'fastShare', label: 'Нормализованно быстрые ответы', unit: '%' },
  { key: 'extremeShare', label: 'Крайне быстрые ответы', unit: '%' },
  { key: 'fastRun', label: 'Длиннейшая быстрая серия', unit: 'вопросов' },
  { key: 'speedRatio', label: 'Отношение к медианам вопросов', unit: 'отношение' },
  { key: 'durationRatio', label: 'Активная длительность / reference', unit: 'отношение' },
  { key: 'acceleration', label: 'Время последней трети / первой', unit: 'отношение' },
  { key: 'sameRun', label: 'Длиннейшая одинаковая серия', unit: 'вопросов' },
  { key: 'coverage', label: 'Покрытие телеметрией', unit: '%' },
  { key: 'strongFlags', label: 'Сильные признаки', unit: 'шт.' },
  { key: 'warningFlags', label: 'Предупреждения', unit: 'шт.' },
  { key: 'domains', label: 'Независимые домены сильных признаков', unit: 'шт.' },
] as const;
export type MetricKey = typeof METRICS[number]['key'];
const number = (v: unknown) => typeof v === 'number' && Number.isFinite(v) ? v : null;
export function metricValue(q: Quality | undefined, key: MetricKey): number | null {
  if (!q) return null;
  const b = q.behavioral.metrics, r = q.response.components;
  switch (key) {
    case 'overall': case 'behavioral': case 'response': return q[key].score;
    case 'confidence': return q.overall.confidence * 100;
    case 'behaviorConfidence': return q.behavioral.confidence * 100;
    case 'responseConfidence': return q.response.confidence * 100;
    case 'rpr': return number(r.rpr?.metrics.rpr);
    case 'pairs': return number(r.pairs?.metrics.pair_consistency);
    case 'fastShare': return number(b.fast_fraction) === null ? null : Number(b.fast_fraction) * 100;
    case 'extremeShare': return number(b.extreme_fast_fraction) === null ? null : Number(b.extreme_fast_fraction) * 100;
    case 'fastRun': return number(b.longest_fast_run);
    case 'speedRatio': return number(b.median_ratio);
    case 'durationRatio': return number(b.duration_ratio);
    case 'acceleration': return number(b.acceleration_ratio);
    case 'coverage': return number(b.telemetry_coverage) === null ? null : Number(b.telemetry_coverage) * 100;
    case 'sameRun': {
      const patterns = q.response.metrics.patterns as Record<string, { run: number }> | undefined;
      const runs = Object.values(patterns ?? {}).map(v => v.run);
      return runs.length ? Math.max(...runs) : null;
    }
    case 'strongFlags': return q.strong_flag_count;
    case 'warningFlags': return q.warning_flag_count;
    case 'domains': return q.independent_concerning_domains;
  }
}
export type QualityFilter = { metric: MetricKey; operator: 'gte' | 'lte' | 'missing'; value: string };
export type QualityView = { sort: 'newest' | 'oldest' | 'insufficient' | MetricKey; direction: 'asc' | 'desc'; status: string; cohort: string; eligibility: string; available: string; telemetry: string; qualityStatus: string; filters: QualityFilter[] };
export const DEFAULT_QUALITY_VIEW: QualityView = { sort: 'newest', direction: 'desc', status: 'all', cohort: 'all', eligibility: 'all', available: 'all', telemetry: 'all', qualityStatus: 'all', filters: [] };
export function applyQualityView(people: Respondent[], qualities: Record<string, Quality>, view: QualityView) {
  const visible = people.filter(p => {
    const q = qualities[p.id];
    return (view.status === 'all' || p.status === view.status)
      && (view.cohort === 'all' || (p.cohort ?? 'unassigned') === view.cohort)
      && (view.eligibility === 'all' || (p.eligibility ?? 'unknown') === view.eligibility)
      && (view.available === 'all' || (view.available === 'present' ? q?.overall.score != null : q?.overall.score == null))
      && (view.telemetry === 'all' || (view.telemetry === 'present' ? (metricValue(q,'coverage')??0)>0 : (metricValue(q,'coverage')??0)===0))
      && (view.qualityStatus === 'all' || (q?.overall.status ?? 'insufficient_data') === view.qualityStatus)
      && view.filters.every(f => {
        const v = metricValue(q, f.metric);
        if (f.operator === 'missing') return v === null;
        if (!f.value.trim() || !Number.isFinite(Number(f.value))) return true;
        return v !== null && (f.operator === 'gte' ? v >= Number(f.value) : v <= Number(f.value));
      });
  });
  if (view.sort === 'newest') return visible;
  if (view.sort === 'oldest') return visible.reverse();
  if (view.sort === 'insufficient') return visible.sort((a,b)=>Number(qualities[a.id]?.overall.score!=null)-Number(qualities[b.id]?.overall.score!=null));
  const key = view.sort;
  return visible.sort((a, b) => {
    const av = metricValue(qualities[a.id], key), bv = metricValue(qualities[b.id], key);
    if (av === null) return bv === null ? 0 : 1;
    if (bv === null) return -1;
    return (av - bv) * (view.direction === 'asc' ? 1 : -1);
  });
}
