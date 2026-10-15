import { QUALITY_V2_CONFIG } from './config.js';
import type { Baseline, Participant } from './types.js';

export function eligibleReferenceCount(people: Pick<Participant, "status" | "duplicate" | "eligibility" | "cohort">[]): number {
  return people.filter(p => p.status === 'completed' && !p.duplicate && p.eligibility !== 'fail' && p.cohort !== 'admin_test').length;
}

// Bootstrap in bounded stages, then freeze. Fold members must have enough
// independent training observations; mature references never drift automatically.
export function shouldGrowBaseline(baseline: Baseline | null, eligible: number): boolean {
  if (!baseline || baseline.source !== 'completed' || baseline.config.version !== QUALITY_V2_CONFIG.version) return false;
  const ref = QUALITY_V2_CONFIG.reference;
  const first = Math.ceil(ref.minQuestionN * ref.folds / (ref.folds - 1));
  return [10, first, ref.minCalibrationN, ref.stableTailN].some(n => baseline.memberIds.length < n && eligible >= n);
}
