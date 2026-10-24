import { gsesInstrument } from "../../../../api/src/data/gses";
import { rsesInstrument } from "../../../../api/src/data/rses";
import survey from "../../../../api/src/data/survey.json";
import { scoreGses } from "../../../../api/src/scoring/gses";
import { scoreRses } from "../../../../api/src/scoring/rses";
import { scoreMspss } from "../../../../api/src/scoring/mspss";
import type { Respondent, AnswerGroup } from "../SurveyDashboard/types";
import { demoMethodologies } from "./demoData";
const instruments = [
  survey.find((s) => s.code === "test_1")!,
  gsesInstrument,
  rsesInstrument,
];
const names = [
  "Гарри Поттер",
  "Гермиона Грейнджер",
  "Фродо Бэггинс",
  "Луна Лавгуд",
  "Шерлок Холмс",
  "Волан-де-Морт",
];
const support = [
  [6, 6, 5, 6, 7, 6, 5, 6, 6, 7, 5, 6],
  [7, 6, 6, 6, 6, 7, 6, 5, 6, 7, 6, 7],
  [6, 5, 4, 4, 6, 7, 7, 5, 6, 6, 4, 7],
  [5, 6, 4, 5, 6, 5, 6, 4, 5, 7, 5, 6],
  [4, 3, 3, 4, 4, 5, 5, 3, 6, 4, 3, 5],
  [2, 2, 1, 2, 2, 3, 2, 1, 2, 2, 1, 3],
];
export const resultDemoPeople: Respondent[] = names.map((alias, i) => {
  const groups: AnswerGroup[] = instruments.map((instrument, position) => {
    const values = instrument.questions.map((_, j) =>
      instrument.code === "test_1"
        ? support[i][j]
        : instrument.code === "test_19"
          ? 1 + ((i + j * 3) % 4)
          : (i + j) % 4,
    );
    const answers = new Map(values.map((v, j) => [j + 1, v]));
    const result =
      instrument.code === "test_1"
        ? scoreMspss(answers)
        : instrument.code === "test_19"
          ? scoreGses(answers)
          : scoreRses(answers);
    return {
      id: `fictional-${i}-${instrument.code}`,
      code: instrument.code,
      title: instrument.title,
      position,
      result: {
        formulaVersion: demoMethodologies[instrument.code].version,
        values: { ...result },
        interpretation: null,
      },
      answers: instrument.questions.map((q, j) => ({
        code: q.code,
        question: q.text,
        type: q.type,
        position: j,
        value: String(values[j]),
        displayValue:
          q.options?.find((o) => o.value === String(values[j]))?.label ??
          String(values[j]),
      })),
    };
  });
  return {
    id: `fictional-respondent-${i}`,
    alias,
    age: [22, 23, 33, 21, 38, 45][i],
    gender: null,
    status: "completed",
    startedAt: `2026-10-01T09:${String(i * 5).padStart(2, "0")}:00Z`,
    lastActivityAt: `2026-10-01T09:${String(i * 5 + 8).padStart(2, "0")}:00Z`,
    completedAt: `2026-10-01T09:${String(i * 5 + 8).padStart(2, "0")}:00Z`,
    answered: 32,
    groups,
  };
});


// Display-only synthetic quality indices, never derived from these fictional answers.
export const resultDemoQualities: Record<string, import("../SurveyDashboard/quality").Quality> = Object.fromEntries(resultDemoPeople.map((person,i)=>{
 const scores=[96,99,88,92,78,54];
 const index=(score:number):import("../SurveyDashboard/quality").Index=>({score,confidence:1,status:score>=85?"high":score>=65?"acceptable":"review",partial:false,flags:[],components:{},metrics:{},version:"2.0.0",calculated_at:"2026-10-01T10:00:00Z",baseline_version:"synthetic-demo"});
 return [person.id,{version:2,algorithm_version:"2.0.0",config_hash:"synthetic-demo",baseline_version:"synthetic-demo",calculated_at:"2026-10-01T10:00:00Z",overall:index(scores[i]),behavioral:index(scores[i]),response:index(scores[i]),strong_flag_count:0,warning_flag_count:0,independent_concerning_domains:0,hard_checks:{eligibility:"unknown",eligibility_reason:null,duplicate:false,completeness:{required:32,answered:32,complete:true}},cohort:"admin_test",telemetry_version:"demo",input_hash:person.id}];
}));
