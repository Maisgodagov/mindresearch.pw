import { Profile } from '../../../../components/ConfiguredMethodologyResult/styles';
import type { AnswerGroup } from "../../types";
import { Summary } from "./styles";

type Metric = { label: string; value: number; note?: string; range?: string; min?: number; max?: number };
const numeric = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const format = (value: number) => value.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

// Display saved calculator output by its structure, including new catalog methods.
// Ranges are only shown when explicitly provided by the calculator.
function metrics(values: Record<string, unknown>): Metric[] {
  const rows: Metric[] = [];
  const add = (raw: unknown, label: string) => {
    if (!raw || typeof raw !== "object") return;
    const data = raw as Record<string, unknown>;
    const value = numeric(data.score) ? data.score : numeric(data.average) ? data.average : numeric(data.sum) ? data.sum : null;
    if (value === null) return;
    const note = [data.levelLabel, data.category, data.interpretation].filter((item): item is string => typeof item === "string" && Boolean(item)).join(". ");
    const minimum = numeric(data.minScore) ? data.minScore : data.min;
    const maximum = numeric(data.maxScore) ? data.maxScore : data.max;
    const range = numeric(minimum) && numeric(maximum) ? `${format(minimum)}–${format(maximum)}` : undefined;
    rows.push({ label: typeof data.label === "string" ? data.label : label, value, note, range, min:numeric(minimum)?minimum:undefined, max:numeric(maximum)?maximum:undefined });
  };
  add(values.overall, "Общий результат");
  for (const key of ["scales", "domains", "facets"]) {
    const collection = values[key];
    if (collection && typeof collection === "object") {
      for (const [label, value] of Object.entries(collection)) add(value, label);
    }
  }
  if (!rows.length) {
    add(values, numeric(values.score) || numeric(values.sum) ? "Суммарный балл" : "Средний балл");
    if (numeric(values.score) && numeric(values.average)) rows.push({ label: "Средний балл", value: values.average });
  }
  return rows;
}

export function SavedMethodResult({ group, compact = false }: { group: AnswerGroup; compact?: boolean }) {
  const values = group.result?.values;
  if (!values) return null;
  const rows = metrics(values);
  if (compact) return <Summary className="score">
    {rows.length ? rows.slice(0, 2).map((row, index) => <span style={{display:"block"}} key={`${row.label}-${index}`}>{row.label}: <b>{format(row.value)}</b></span>) : "Результат рассчитан"}
    {rows.length > 2 && <small>Всего показателей: {rows.length}. Подробнее — в ответах респондента.</small>}
  </Summary>;
  return <section>
    <b>{group.title}</b>
    <Profile aria-label={`Диаграмма результатов: ${group.title}`}>
      {rows.map((row,index)=>{
        const hasRange=row.min!==undefined&&row.max!==undefined&&row.max>row.min;
        const width=hasRange?Math.max(0,Math.min(100,(row.value-row.min!)/(row.max!-row.min!)*100)):0;
        return <div className="scale" key={`${row.label}-${index}`}>
          <span className="label">{row.label}{row.note&&<small>{row.note}</small>}</span>
          {hasRange?<div className="scale-plot"><div className="track" role="img" aria-label={`${row.label}: ${format(row.value)}, диапазон ${row.range}`}><div className="fill" style={{width:`${width}%`}}/></div><span className="range-limits"><span>{format(row.min!)}</span><span>{format(row.max!)}</span></span></div>:<span className="no-range">Диапазон не указан</span>}
          <span className="value">{format(row.value)}</span>
        </div>;
      })}
    </Profile>
    {typeof values.screeningNote === "string" && <p>{values.screeningNote}</p>}
    {!rows.length && <p>Результат рассчитан. Числовые показатели не предоставлены методикой.</p>}
  </section>;
}
