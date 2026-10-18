import { QUALITY_VERSION, type Quality } from "../containers/SurveyDashboard/quality";
import { createResultsWorkbook, type ResultsRespondent, type ExportSection } from "./resultsWorkbook";

export type ExportRespondent = ResultsRespondent & {
  source?: "community" | "direct";
  qualityMetrics?: Quality;
  cohort?: string;
  eligibility?: string;
};

export async function exportRespondents(
  respondents: ExportRespondent[],
  sections: ExportSection[],
  options: Parameters<typeof createResultsWorkbook>[2] = {},
) {
  const workbook = await createResultsWorkbook(respondents, sections, options);
  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `mindresearch-results-${new Date().toISOString().slice(0, 10)}.xlsx`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const QUALITY_FIELDS = ['session_id','alias','cohort','eligibility','confirmed_duplicate','required_answers_complete',
'quality_version','overall_quality_score','overall_quality_status','overall_quality_confidence',
'behavior_quality_score','behavior_quality_status','behavior_quality_confidence',
'response_quality_score','response_quality_status','response_quality_confidence',
'behavior_fast_fraction','behavior_extreme_fast_fraction','behavior_median_time_ratio','behavior_longest_fast_run','behavior_acceleration_ratio','behavior_active_duration_ratio','behavior_telemetry_coverage',
'response_rpr','response_rpr_percentile','response_pair_consistency','response_pair_consistency_percentile','response_patterning_score','attention_checks_failed',
'quality_strong_flag_count','quality_warning_flag_count','independent_concerning_domains','quality_flags','baseline_version','config_hash','calculated_at','overall_partial','telemetry_version'];
export function qualityExportRow(p:ExportRespondent):Record<string,unknown> {
 const q=p.qualityMetrics,b=q?.behavioral.metrics,r=q?.response.components;
 return {session_id:p.id,alias:p.alias,cohort:p.cohort??q?.cohort??'unassigned',eligibility:p.eligibility??q?.hard_checks.eligibility??'unknown',confirmed_duplicate:q?.hard_checks.duplicate,required_answers_complete:q?.hard_checks.completeness.complete,
 quality_version:q?.algorithm_version??QUALITY_VERSION,overall_quality_score:q?.overall.score,overall_quality_status:q?.overall.status??'insufficient_data',overall_quality_confidence:q?.overall.confidence,
 behavior_quality_score:q?.behavioral.score,behavior_quality_status:q?.behavioral.status??'insufficient_data',behavior_quality_confidence:q?.behavioral.confidence,
 response_quality_score:q?.response.score,response_quality_status:q?.response.status??'insufficient_data',response_quality_confidence:q?.response.confidence,
 behavior_fast_fraction:b?.fast_fraction,behavior_extreme_fast_fraction:b?.extreme_fast_fraction,behavior_median_time_ratio:b?.median_ratio,behavior_longest_fast_run:b?.longest_fast_run,behavior_acceleration_ratio:b?.acceleration_ratio,behavior_active_duration_ratio:b?.duration_ratio,behavior_telemetry_coverage:b?.telemetry_coverage,
 response_rpr:r?.rpr?.metrics.rpr,response_rpr_percentile:r?.rpr?.metrics.reference_percentile,response_pair_consistency:r?.pairs?.metrics.pair_consistency,response_pair_consistency_percentile:r?.pairs?.metrics.reference_percentile,response_patterning_score:r?.patterning?.score,attention_checks_failed:q?.response.metrics.attention_checks_failed,
 quality_strong_flag_count:q?.strong_flag_count,quality_warning_flag_count:q?.warning_flag_count,independent_concerning_domains:q?.independent_concerning_domains,quality_flags:q?JSON.stringify(q.overall.flags):'',baseline_version:q?.baseline_version,config_hash:q?.config_hash,calculated_at:q?.calculated_at,overall_partial:q?.overall.partial,telemetry_version:q?.telemetry_version};
}
export function exportQualityCsv(people:ExportRespondent[]) {
 const safe=(value:unknown)=>{let text=value==null?'':String(value);if(/^[=+@\t\r]/.test(text)||(text.startsWith('-')&&!Number.isFinite(Number(text))))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
 const csv=[QUALITY_FIELDS.map(safe).join(','),...people.map(p=>{const row=qualityExportRow(p);return QUALITY_FIELDS.map(k=>safe(row[k])).join(',');})].join('\r\n');
 const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='quality-v2.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
