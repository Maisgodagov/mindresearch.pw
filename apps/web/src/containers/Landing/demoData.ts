import type { Respondent, AnswerGroup } from "../SurveyDashboard/types";
import type { Instrument, Section } from "../SurveyBuilder/types";
import type { Methodology } from "../../components/MethodologyModal";
import type { PreviewQuestion } from "../../components/BuilderPreview/types";
import catalog from "../../../../api/src/public-methods/catalog.json";
import survey from "../../../../api/src/data/survey.json";
import { gsesInstrument } from "../../../../api/src/data/gses";
import { rsesInstrument } from "../../../../api/src/data/rses";

export const demoInstruments: Instrument[] = catalog.map((m) => ({
  id: `demo-${m.code}`,
  code: m.code,
  title: `${m.name}, ${m.abbreviation}`,
  description: m.intro,
  questionCount: m.code === "test_1" ? 12 : 10,
  isVerified: true,
  categories: [{ id: m.topic, label: m.topic, group: "Темы", url: "" }],
}));
export const demoMethodologies: Record<string, Methodology> =
  Object.fromEntries(
    catalog.map((m) => [
      m.code,
      {
        code: m.code,
        title: m.name,
        version: m.version,
        summary: m.intro,
        steps: [
          m.sections.find((s) => /рассчитывается|Подсчёт/.test(s.title))
            ?.text ?? m.sections[0].text,
        ],
        notes: [m.limitations],
        sources: m.sources,
      },
    ]),
  );
export function demoSection(instrument: Instrument): Section {
  return {
    id: instrument.id,
    kind: "library",
    instrumentId: instrument.id,
    title: instrument.title,
    questionCount: instrument.questionCount,
    isVerified: true,
  };
}
export const initialSections = demoInstruments
  .filter((m) => m.code === "test_19" || m.code === "test_1")
  .map(demoSection);
export const gsesScores = [28, 31, 24, 35, 30, 26, 33, 27, 34, 29, 32, 25];
export const supportScores = [
  4.25, 5.5, 3.75, 5.75, 4.5, 4, 5.25, 4.75, 6, 3.5, 5, 4.25,
];
const selfScores = [18, 22, 16, 25, 20, 19, 23, 17, 24, 18, 21, 16];
const ages = [22, 24, 26, 29, 31, 21, 34, 28, 23, 38, 25, 30];
export const demoPeople: Respondent[] = gsesScores.map((score, i) => {
  const support = supportScores[i];
  const group = (
    code: string,
    values: Record<string, unknown>,
  ): AnswerGroup => ({
    id: `demo-group-${code}-${i}`,
    code,
    title: demoInstruments.find((m) => m.code === code)!.title,
    position: code === "test_19" ? 1 : code === "test_1" ? 2 : 3,
    result: {
      formulaVersion: demoMethodologies[code].version,
      values,
      interpretation: null,
    },
    answers: [],
  });
  return {
    id: `synthetic-${i + 1}`,
    alias: `Участник ${String(i + 1).padStart(2, "0")}`,
    age: ages[i],
    gender: null,
    status: "completed",
    startedAt: "2026-10-01T09:00:00Z",
    lastActivityAt: "2026-10-01T09:08:00Z",
    completedAt: "2026-10-01T09:08:00Z",
    answered: 22,
    groups: [
      group("test_19", {
        instrument: "GSES",
        complete: true,
        answered: 10,
        score,
        average: score / 10,
        min: 1,
        max: 4,
      }),
      group("test_1", {
        instrument: "MSPSS",
        complete: true,
        answered: 12,
        overall: {
          label: "Общая воспринимаемая поддержка",
          score: support,
          min: 1,
          max: 7,
        },
        scales: Object.fromEntries(
          [
            ["family", "Поддержка семьи", support + 0.25],
            ["friends", "Поддержка друзей", support],
            ["significantOther", "Поддержка значимого другого", support - 0.25],
          ].map(([code, label, value]) => [
            code,
            { label, score: value, min: 1, max: 7 },
          ]),
        ),
      }),
      group("test_17", {
        instrument: "RSES",
        complete: true,
        answered: 10,
        score: selfScores[i],
        min: 0,
        max: 30,
      }),
    ],
  };
});
export const demoVariables = [
  { id: "test_19", label: "Самоэффективность · общий балл", max: 40 },
  { id: "test_1", label: "Социальная поддержка · средний балл", max: 7 },
  { id: "test_17", label: "Самооценка · общий балл", max: 30 },
];
export function personValue(person: Respondent, variable: string): number {
  const values = person.groups.find((g) => g.code === variable)?.result?.values;
  return Number(
    variable === "test_1"
      ? (values?.overall as { score: number })?.score
      : values?.score,
  );
}
export function descriptive(values: number[]) {
  const n = values.length;
  if (!n) return null;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sorted = [...values].sort((a, b) => a - b);
  const median =
    n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  return {
    n,
    mean,
    median,
    min: sorted[0],
    max: sorted[n - 1],
    sd:
      n > 1
        ? Math.sqrt(
            values.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (n - 1),
          )
        : null,
  };
}
export function correlation(x: number[], y: number[]) {
  if (x.length !== y.length || x.length < 3) return null;
  const a = descriptive(x)!,
    b = descriptive(y)!;
  const numerator = x.reduce(
    (sum, value, i) => sum + (value - a.mean) * (y[i] - b.mean),
    0,
  );
  const denominator = Math.sqrt(
    x.reduce((sum, v) => sum + (v - a.mean) ** 2, 0) *
      y.reduce((sum, v) => sum + (v - b.mean) ** 2, 0),
  );
  return denominator ? numerator / denominator : null;
}
export function previewQuestions(
  sections: Section[],
  ownQuestion: string,
): PreviewQuestion[] {
  return sections.flatMap<PreviewQuestion>((section) => {
    if (section.kind === "custom")
      return [
        {
          id: "demo-custom-question",
          text: ownQuestion || "Что помогает вам справляться с трудностями?",
          type: "text" as const,
          required: true,
          options: [],
          sectionTitle: section.title,
        },
      ];
    const instrument = demoInstruments.find(
      (i) => i.id === section.instrumentId,
    );
    const questions =
      instrument?.code === "test_19"
        ? gsesInstrument.questions
        : instrument?.code === "test_17"
          ? rsesInstrument.questions
          : survey.find((s) => s.code === "test_1")!.questions;
    return questions.slice(0, 1).map((q) => ({
      id: q.code,
      text: q.text,
      type: "single" as const,
      required: true,
      options: q.options ?? [],
      sectionTitle: section.title,
    }));
  });
}
