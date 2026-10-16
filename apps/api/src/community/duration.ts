export type SurveyDuration = { mode: "auto" | "custom"; text: string };
export const defaultSurveyDuration: SurveyDuration = { mode: "auto", text: "" };

export function surveyDurationLabel(questionCount: number, setting?: unknown): string {
  const duration = setting as Partial<SurveyDuration> | undefined;
  if (duration?.mode === "custom" && typeof duration.text === "string" && duration.text.trim()) return duration.text.trim();
  const count = Math.max(0, questionCount);
  const lower = Math.max(5, Math.floor(count * 2 / 60 / 5) * 5);
  const upper = Math.max(lower + 5, Math.ceil(count * 5 / 60 / 5) * 5);
  return count * 5 / 60 <= 5 ? "до 5 минут" : `${lower}–${upper} минут`;
}

export function surveyDurationMinutes(questionCount: number, setting?: unknown): number {
  const label = surveyDurationLabel(questionCount, setting).toLocaleLowerCase("ru");
  const numbers = [...label.matchAll(/\d+(?:[.,]\d+)?/g)].map(m => Number(m[0].replace(",", ".")));
  if (numbers.length && /мин|час|hour|min/.test(label)) {
    return Math.max(1, Math.ceil(Math.max(...numbers) * (/час|hour/.test(label) ? 60 : 1)));
  }
  return Math.max(5, Math.ceil(Math.max(0, questionCount) * 5 / 60 / 5) * 5);
}