import styled from "styled-components";
import { Button } from "../../../../ui";
import { formatQuestionTime } from "../QuestionTiming";
import { DEFAULT_QUALITY_VIEW, METRICS, QUALITY_VERSION, type Quality, type QualityView, type MetricKey } from "../../quality";
import type { Respondent } from "../../types";

const Surface = styled.section`
  min-width: 0;
  padding: 16px 0;
  color: #26392d;
  h2 { margin: 0 0 10px; font-size: 18px; }
  h3 { margin: 0 0 10px; font-size: 14px; }
  p, summary { font-size: 12px; line-height: 1.6; }
  p { margin: 8px 0; color: #526557; max-width: 85ch; }
  summary { cursor: pointer; font-weight: 650; }
  .overview { display: flex; flex-wrap: wrap; gap: 12px 28px; margin: 12px 0; }
  .overview span { font-size: 12px; }
  .overview b { font-variant-numeric: tabular-nums; }
  .controls, .rule { display: flex; flex-wrap: wrap; align-items: end; gap: 8px; margin: 10px 0; }
  label { display: grid; gap: 5px; font-size: 12px; font-weight: 600; }
  select, input { box-sizing: border-box; max-width: 100%; min-height: 36px; border: 1px solid #cbd9cc; border-radius: 8px; background: #fff; color: #26392d; padding: 7px 10px; font: inherit; }
  select:focus-visible, input:focus-visible { outline: 2px solid #52764b; outline-offset: 2px; }
  .rule input { width: 100px; }
  button { min-height: 36px; }
  .metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 20px; margin: 12px 0; }
  .metrics dt { font-size: 11px; color: #526557; margin-bottom: 4px; }
  .metrics dd { margin: 0; font-size: 13px; font-weight: 650; font-variant-numeric: tabular-nums; }
  .flags { margin: 8px 0; padding-left: 18px; font-size: 12px; line-height: 1.7; }
  .score { font-size: 15px; font-weight: 700; }
  @media (max-width: 700px) { .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 560px) {
    .controls > label { flex: 1 1 140px; min-width: 0; }
    .rule > label:first-child { flex: 1 1 100%; }
    .rule > label { min-width: 0; }
  }
`;

export const percent = (value: number | null) => value === null ? "—" : `${Math.round(value)}%`;
export const fasterText = (value: number | null) => value === null ? "Недостаточно данных для сравнения" : Math.abs(value) < .5 ? "Примерно столько же времени" : value > 0 ? `На ${Math.round(value)}% быстрее` : `На ${Math.round(-value)}% медленнее`;

export function QualityOverview({ people, qualities }: { people: Respondent[]; qualities: Record<string, Quality> }) {
  const completed = people.filter(person => person.status === "completed");
  const values = completed.map(person => qualities[person.id]);
  const times = completed.flatMap(person => person.groups.filter(group => group.code !== "respondent").flatMap(group => group.answers.flatMap(answer => answer.activeMs != null && Number.isFinite(answer.activeMs) ? [answer.activeMs] : [])));
  const measured = values.filter(value => value.timed > 0).length;
  const fast = times.filter(time => time < 1000).length;
  return <Surface>
    <h2>Качество прохождения</h2>
    <div className="overview">
      <span>Измерения: <b>{measured} из {completed.length}</b> завершённых</span>
      <span>Среднее на вопрос: <b>{times.length ? formatQuestionTime(times.reduce((a, b) => a + b, 0) / times.length) : "—"}</b></span>
      <span>Ответы &lt; 1 сек: <b>{times.length ? `${Math.round(fast / times.length * 100)}% (${fast} из ${times.length})` : "—"}</b></span>
      <span>Два и более признака: <b>{values.filter(value => value.flags.length >= 2).length}</b> прохождений</span>
    </div>
    {times.length > 0 && <p>Распределение времени: &lt; 1 сек — {fast}; 1–3 сек — {times.filter(time => time >= 1000 && time < 3000).length}; 3–10 сек — {times.filter(time => time >= 3000 && time < 10000).length}; от 10 сек — {times.filter(time => time >= 10000).length} ответов.</p>}
    <details><summary>Как читать показатели и индекс качества</summary>
      <p>Индекс качества {QUALITY_VERSION} — эвристическая оценка от 0 до 100%, а не вероятность достоверности ответов. Высокий индекс означает меньше отмеченных признаков. Даже 100% не гарантируют внимательное прохождение. Одинаковые ответы или высокая скорость сами по себе могут быть нормальными.</p>
      <p>Время на вопросе — суммарное время в видимой вкладке, включая повторные посещения. Сравнения используют минимум 5 других завершённых прохождений; фильтры не меняют эту выборку. Активное время всего опроса сравнивается только при полном покрытии измерениями и одинаковом наборе отвеченных вопросов. Общее время прохождения включает перерывы.</p>
      <p>«Быстрее на 29%» означает на 29% меньше времени. Сравнение по вопросам — медиана отношений собственного времени к медиане каждого вопроса. Ускорение — сокращение нормализованного времени последней трети относительно первой; учитывается минимум 80% вопросов каждой трети.</p>
      <p>Серии считаются по соседним вопросам внутри блока; пропуски разрывают серию. Одинаковые ответы анализируются только для одиночного выбора с одинаковыми вариантами. Служебный вопрос с псевдонимом исключён.</p>
      <p>Индекс начинается со 100. Вычитаются: до 30 баллов за долю быстрых ответов (5–50%), до 10 за быструю серию (3–10), до 10 за сокращение времени относительно вопросов (50–90%), до 10 относительно медианы активного времени опроса (50–90%), до 15 за ускорение (40–80%), до 25 за одинаковую серию (5–15). Между границами штраф растёт линейно.</p>
      <p>Индекс доступен для завершённых прохождений: минимум 10 измеренных ответов, покрытие от 80%, достаточная база сравнений и минимум 10 вопросов с вариантами выбора. Это стартовые правила для проверки данных; результаты автоматически не исключаются.</p>
    </details>
  </Surface>;
}

export function QualityControls({ view, onChange, visible, total }: { view: QualityView; onChange: (view: QualityView) => void; visible: number; total: number }) {
  return <Surface aria-label="Фильтры качества прохождения">
    <div className="controls">
      <label>Сортировка<select aria-label="Сортировка" value={view.sort} onChange={event => onChange({ ...view, sort: event.target.value as QualityView["sort"] })}>
        <option value="newest">Свежие сверху — исходный порядок</option><option value="oldest">Старые сверху</option>
        {METRICS.map(metric => <option key={metric.key} value={metric.key}>{metric.label}</option>)}
      </select></label>
      {view.sort !== "newest" && view.sort !== "oldest" && <label>Порядок<select aria-label="Порядок" value={view.direction} onChange={event => onChange({ ...view, direction: event.target.value as "asc" | "desc" })}><option value="asc">По возрастанию</option><option value="desc">По убыванию</option></select></label>}
      <label>Статус<select aria-label="Статус прохождения" value={view.status} onChange={event => onChange({ ...view, status: event.target.value as QualityView["status"] })}><option value="all">Все прохождения</option><option value="completed">Завершённые</option><option value="in_progress">Незавершённые</option></select></label>
      <Button onClick={() => onChange({ ...view, filters: [...view.filters, { metric: "quality", operator: "lte", value: "" }] })}>Добавить фильтр</Button>
      <Button onClick={() => onChange({ ...DEFAULT_QUALITY_VIEW, filters: [] })}>Сбросить всё</Button>
    </div>
    {view.filters.map((filter, index) => {
      const change = (patch: Partial<typeof filter>) => onChange({ ...view, filters: view.filters.map((current, i) => i === index ? { ...current, ...patch } : current) });
      return <div className="rule" key={index}>
        <label>Показатель<select value={filter.metric} onChange={event => change({ metric: event.target.value as MetricKey })}>{METRICS.map(metric => <option key={metric.key} value={metric.key}>{metric.label}</option>)}</select></label>
        <label>Условие<select value={filter.operator} onChange={event => change({ operator: event.target.value as typeof filter.operator })}><option value="lte">Не больше</option><option value="gte">Не меньше</option><option value="missing">Нет данных</option></select></label>
        {filter.operator !== "missing" && <label>Значение ({METRICS.find(metric => metric.key === filter.metric)?.unit})<input type="number" step="any" value={filter.value} onChange={event => change({ value: event.target.value })} /></label>}
        <Button aria-label={`Удалить фильтр ${index + 1}`} onClick={() => onChange({ ...view, filters: view.filters.filter((_, i) => i !== index) })}>Убрать</Button>
      </div>;
    })}
    <p aria-live="polite">Показано {visible} из {total}. Все условия применяются вместе. Значения без данных при сортировке находятся внизу.</p>
  </Surface>;
}

export function QualityDetails({ value }: { value: Quality }) {
  return <Surface>
    <h3>Поведение при прохождении</h3>
    <div className="score">Индекс качества: {percent(value.quality)}</div>
    <p>{value.unavailable || "Эвристическая оценка; не является вероятностью валидности."} Измерено {value.timed} из {value.total} ответов ({Math.round(value.coverage)}%).</p>
    <dl className="metrics">
      <div><dt>Среднее / медиана на вопрос</dt><dd>{value.averageMs !== null ? formatQuestionTime(value.averageMs) : "—"} / {value.medianMs !== null ? formatQuestionTime(value.medianMs) : "—"}</dd></div>
      <div><dt>Ответы быстрее секунды</dt><dd>{percent(value.fastShare)} · {value.fastCount} из {value.timed}</dd></div>
      <div><dt>Самая длинная быстрая серия</dt><dd>{value.fastRun ?? "—"} вопросов</dd></div>
      <div><dt>Относительно медиан вопросов</dt><dd>{fasterText(value.questionFaster)}</dd></div>
      <div><dt>Активное время всего опроса</dt><dd>{value.activeMs !== null ? formatQuestionTime(value.activeMs) : "—"}</dd></div>
      <div><dt>Относительно среднего активного времени остальных</dt><dd>{fasterText(value.surveyFaster)}</dd></div>
      <div><dt>Относительно медианы активного времени остальных</dt><dd>{fasterText(value.surveyMedianFaster)}</dd></div>
      <div><dt>Общее время, включая перерывы, относительно среднего остальных</dt><dd>{fasterText(value.durationFaster)}</dd></div>
      <div><dt>Ускорение к концу с учётом сложности вопросов</dt><dd>{value.acceleration === null ? "—" : value.acceleration >= 0 ? `На ${Math.round(value.acceleration)}% меньше времени` : `На ${Math.round(-value.acceleration)}% больше времени`}</dd></div>
      <div><dt>Самая длинная одинаковая серия</dt><dd>{value.sameRun ?? "—"} вопросов</dd></div>
    </dl>
    {value.flags.length > 0 && <><h3>Признаки для проверки</h3><ul className="flags">{value.flags.map(flag => <li key={flag}>{flag}</li>)}</ul></>}
    {value.sameRuns.length > 0 && <><h3>Одинаковые ответы внутри блоков</h3><ul className="flags">{value.sameRuns.map((run, index) => <li key={index}>{run.title}: {run.length} подряд — «{run.label}»</li>)}</ul></>}
    {value.quality !== null && <details><summary>Из чего рассчитан индекс</summary><ul className="flags">{value.penalties.map(penalty => <li key={penalty.label}>{penalty.label}: −{penalty.points.toFixed(1)} балла</li>)}</ul></details>}
  </Surface>;
}
