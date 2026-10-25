import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ResultsAction as Button } from "../ResultsAction";
import type { Output } from "./types";
const number = (value: number | null | undefined) =>
  value == null
    ? "—"
    : value.toLocaleString("ru-RU", { maximumFractionDigits: 5 });
const probability = (p: number | null | undefined) =>
  p == null ? "—" : p < 0.000001 ? "< 0,000001" : number(p);
export function StatisticsResult({
  result,
  alpha,
  reportId,
}: {
  result: Output;
  alpha: number;
  reportId: string;
}) {
  return (
    <>
      <div className="metrics">
        {result.statistic !== null && (
          <div>
            <span>{result.statisticLabel}</span>
            <strong>{number(result.statistic)}</strong>
          </div>
        )}
        {result.p !== null && (
          <div>
            <span>
              {result.alternative === "increasing"
                ? "p · возрастание"
                : result.alternative === "first-greater"
                  ? "p · первая группа выше"
                  : "p"}
            </span>
            <strong>{probability(result.p)}</strong>
          </div>
        )}
        <div>
          <span>Уровень значимости α</span>
          <strong>{number(alpha)}</strong>
        </div>
      </div>
      {result.p !== null && (
        <p>
          {result.p < alpha
            ? "Нулевая гипотеза отвергается при выбранном α."
            : "Оснований отвергнуть нулевую гипотезу при выбранном α недостаточно."}{" "}
          Интерпретируйте результат с учётом гипотезы метода и ограничений ниже.
        </p>
      )}
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>Группа / показатель</th>
              <th>N</th>
              <th>Среднее</th>
              <th>Медиана</th>
              <th>SD</th>
              <th>Мин.</th>
              <th>Макс.</th>
            </tr>
          </thead>
          <tbody>
            {result.summary.map((s, i) => (
              <tr key={i}>
                <td>{s.label}</td>
                <td>{s.n}</td>
                <td>{number(s.mean)}</td>
                <td>{number(s.median)}</td>
                <td>{number(s.sd)}</td>
                <td>{number(s.min)}</td>
                <td>{number(s.max)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.effect !== null && (
        <p>
          <strong>{result.effectLabel}:</strong> {number(result.effect)}
        </p>
      )}
      {result.ci && (
        <p>
          <strong>{result.ciLabel}:</strong> {result.ci.map(number).join(" … ")}
        </p>
      )}
      {result.tables?.map((table, index) => (
        <ResultTable key={reportId + ":" + index} table={table} />
      ))}
      <details>
        <summary>Дисперсия и квартили</summary>
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Группа / показатель</th>
                <th>Дисперсия</th>
                <th>Q₁</th>
                <th>Q₃</th>
                <th>IQR</th>
              </tr>
            </thead>
            <tbody>
              {result.summary.map((s, i) => (
                <tr key={i}>
                  <td>{s.label}</td>
                  <td>{number(s.variance)}</td>
                  <td>{number(s.q1)}</td>
                  <td>{number(s.q3)}</td>
                  <td>{number(s.q3 - s.q1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      {result.modes && (
        <p>
          Мода:{" "}
          {result.modes.length
            ? `${result.modes.map(number).join(", ")} · частота ${result.modeFrequency}`
            : "все значения различны; модальная группа не выделяется"}
        </p>
      )}
      {result.skewness !== undefined && (
        <p>Асимметрия: {number(result.skewness)}</p>
      )}
      {result.excess !== undefined && (
        <p>Исправленный эксцесс (относительно 0): {number(result.excess)}</p>
      )}
      {result.warnings.map((warning, i) => (
        <p className="notice" key={i}>
          {warning}
        </p>
      ))}
      <p className="muted">
        Результат относится к зафиксированным данным и выбранному анализу.
        Попарные проверки относятся к указанному в таблице семейству. p не
        является вероятностью истинности гипотезы.
      </p>
    </>
  );
}
function ResultTable({
  table,
}: {
  table: NonNullable<Output["tables"]>[number];
}) {
  const [page, setPage] = useState(0);
  const size = 50;
  return (
    <section className="result-table">
      <h3>{table.title}</h3>
      <div className="scroll">
        <table>
          <thead>
            <tr>
              {table.columns.map((column, i) => (
                <th key={i}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.slice(page * size, (page + 1) * size).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>
                    {typeof cell === "number" ? number(cell) : (cell ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.rows.length > size && (
        <div className="actions">
          <span className="muted">
            {page * size + 1}–{Math.min((page + 1) * size, table.rows.length)}{" "}
            из {table.rows.length} · Excel содержит все строки
          </span>
          <Button
            disabled={page === 0}
            onClick={() => setPage((current) => current - 1)}
            aria-label="Предыдущие строки"
          >
            <ArrowLeft size={16} />
          </Button>
          <Button
            disabled={(page + 1) * size >= table.rows.length}
            onClick={() => setPage((current) => current + 1)}
            aria-label="Следующие строки"
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </section>
  );
}
