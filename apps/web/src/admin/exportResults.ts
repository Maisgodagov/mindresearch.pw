import type { Worksheet } from "exceljs";
import { QUALITY_VERSION, type Quality } from "../containers/SurveyDashboard/quality";

type Answer = { code: string; question: string; displayValue: string; activeMs?: number | null; visits?: number | null };
type Group = {
  code: string;
  title: string;
  result: { values: Record<string, unknown> } | null;
  answers: Answer[];
};
type ScoreRow = {
  label?: string;
  score?: unknown;
  average?: unknown;
  maxScore?: unknown;
  max?: unknown;
  levelLabel?: string;
  interpretation?: string;
  referenceMean?: unknown;
  difference?: unknown;
};
type ExportScores = Record<string, unknown> & {
  overall?: ScoreRow;
  scales?: Record<string, ScoreRow>;
  reference?: { zScore?: unknown };
};
export type ExportRespondent = {
  qualityMetrics?: Quality;
  cohort?: string;
  eligibility?: string;
  id: string;
  alias: string;
  status: string;
  startedAt: string;
  lastActivityAt: string;
  completedAt: string | null;
  answered: number;
  groups: Group[];
};

const date = (input: string | null) =>
  input ? new Date(input).toLocaleString("ru-RU") : "";
const cellValue = (input: unknown) =>
  typeof input === "number" ? input : typeof input === "string" ? input : "";

function styleSheet(sheet: Worksheet, widths: number[]) {
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: sheet.columnCount },
  };
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF587462" },
    };
    cell.alignment = { vertical: "middle", wrapText: true };
  });
  sheet.getRow(1).height = 30;
  widths.forEach((width, index) => {
    sheet.getColumn(index + 1).width = width;
  });
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1)
      row.eachCell((cell) => {
        cell.alignment = { vertical: "top", wrapText: true };
      });
  });
}

export async function exportRespondents(respondents: ExportRespondent[]) {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "mindresearch";
  workbook.created = new Date();

  const summary = workbook.addWorksheet("Респонденты");
  summary.addRow([
    "Псевдоним",
    "Статус",
    "Ответов",
    "Начато",
    "Последняя активность",
    "Завершено",
  ]);
  respondents.forEach((person) =>
    summary.addRow([
      person.alias,
      person.status === "completed" ? "Завершена" : "В процессе",
      person.answered,
      date(person.startedAt),
      date(person.lastActivityAt),
      date(person.completedAt),
    ]),
  );
  styleSheet(summary, [24, 16, 12, 21, 21, 21]);

  const quality = workbook.addWorksheet("Качество V2");
  const rows = respondents.map(qualityExportRow);
  quality.addRow(QUALITY_FIELDS);
  rows.forEach(row=>quality.addRow(QUALITY_FIELDS.map(key=>row[key]??"")));
  styleSheet(quality, QUALITY_FIELDS.map(key=>key==='quality_flags'?70:25));

  const scores = workbook.addWorksheet("Результаты методик");
  scores.addRow([
    "Псевдоним",
    "Методика",
    "Показатель",
    "Значение",
    "Максимум",
    "Уровень / интерпретация",
    "Ориентир",
    "Отклонение",
  ]);
  respondents.forEach((person) =>
    person.groups
      .filter((group) => group.result)
      .forEach((group) => {
        const values = group.result!.values as ExportScores;
        if (values.overall)
          scores.addRow([
            person.alias,
            group.title,
            values.overall.label ?? "Общий показатель",
            cellValue(values.overall.score ?? values.overall.average),
            cellValue(values.overall.maxScore ?? values.overall.max),
            values.overall.levelLabel ?? values.overall.interpretation ?? "",
            cellValue(values.overall.referenceMean),
            cellValue(values.overall.difference),
          ]);
        if (values.scales)
          Object.values(values.scales).forEach((scale) =>
            scores.addRow([
              person.alias,
              group.title,
              scale.label,
              cellValue(scale.score ?? scale.average),
              cellValue(scale.maxScore ?? scale.max),
              scale.levelLabel ?? scale.interpretation ?? "",
              cellValue(scale.referenceMean),
              cellValue(scale.difference),
            ]),
          );
        if (group.code === "test_3") {
          scores.addRow([
            person.alias,
            group.title,
            "Средний балл",
            cellValue(values.average),
            cellValue(values.max),
            "",
            "",
            cellValue(values.reference?.zScore),
          ]);
          scores.addRow([
            person.alias,
            group.title,
            "Суммарный балл",
            cellValue(values.sum),
            60,
            "",
            "",
            "",
          ]);
        }
      }),
  );
  styleSheet(scores, [24, 30, 34, 14, 14, 28, 14, 14]);

  const answers = workbook.addWorksheet("Все ответы");
  answers.addRow([
    "Псевдоним",
    "Раздел / методика",
    "Код вопроса",
    "Вопрос",
    "Ответ",
    "Время на вопросе (сек)",
    "Посещений вопроса",
  ]);
  respondents.forEach((person) =>
    person.groups.forEach((group) =>
      group.answers.forEach((answer) =>
        answers.addRow([
          person.alias,
          group.title,
          answer.code,
          answer.question,
          answer.displayValue,
          answer.activeMs == null ? "" : answer.activeMs / 1000,
          answer.visits ?? "",
        ]),
      ),
    ),
  );
  styleSheet(answers, [24, 30, 18, 70, 35, 24, 22]);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mindresearch-results-${new Date().toISOString().slice(0, 10)}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
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
