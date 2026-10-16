export type SurveyDuration = { mode: "auto" | "custom"; text: string };
export const defaultSurveyDuration: SurveyDuration = { mode: "auto", text: "" };
type Questions = number | readonly { type?: string }[];
function automaticRange(questions: Questions): [number, number] {
  const items = typeof questions === "number" ? null : questions;
  const count = typeof questions === "number" ? Math.max(0, questions) : questions.length;
  const open = items?.filter(q => q.type === "text").length ?? 0;
  const closed = count - open;
  const lower = Math.max(5, Math.floor((closed * 5 + open * 30) / 300) * 5);
  const upper = Math.max(lower + 5, Math.ceil((closed * 10 + open * 90) / 300) * 5);
  return (closed * 10 + open * 90) <= 300 ? [0, 5] : [lower, upper];
}
export function surveyDurationLabel(questions: Questions, setting?: unknown): string {
  const duration = setting as Partial<SurveyDuration> | undefined;
  if (duration?.mode === "custom" && typeof duration.text === "string" && duration.text.trim()) return duration.text.trim();
  const [lower, upper] = automaticRange(questions);
  return lower === 0 ? "до 5 минут" : `${lower}–${upper} минут`;
}
export function surveyDurationMinutes(questions: Questions, setting?: unknown): number {
  const duration = setting as Partial<SurveyDuration> | undefined;
  if (duration?.mode === "custom" && typeof duration.text === "string") {
    const label = duration.text.toLocaleLowerCase("ru");
    const numbers = [...label.matchAll(/\d+(?:[.,]\d+)?/g)].map(m => Number(m[0].replace(",", ".")));
    if (numbers.length && /мин|час|hour|min/.test(label)) return Math.max(1, Math.ceil(Math.max(...numbers) * (/час|hour/.test(label) ? 60 : 1)));
  }
  return automaticRange(questions)[1];
}
export const rewardFor = (minutes: number) => minutes <= 5 ? 1 : minutes <= 15 ? 2 : minutes <= 30 ? 4 : minutes <= 60 ? 6 : Math.ceil(minutes / 30) * 3;