import { CheckCircle2 } from "lucide-react";
import { Workspace } from "../SurveyDashboard/components/StatisticsWorkspace/styles";
import { StatisticsResult } from "../SurveyDashboard/components/StatisticsWorkspace/StatisticsResult";
import type { Output } from "../SurveyDashboard/components/StatisticsWorkspace/types";
import fixture from "./pearsonReport.json";
const result: Output = fixture.result;
const number = (n: number) =>
  n.toLocaleString("ru-RU", { maximumFractionDigits: 5 });
export function StatisticsReportDemo() {
  return (
    <Workspace className="landing-statistics-report">
      <div className="body">
        <div className="report-heading">
          <div>
            <span className="badge">
              <CheckCircle2 size={14} />
              Готово · пример отчёта
            </span>
            <h3>
              Корреляция Пирсона: самоэффективность и социальная поддержка
            </h3>
            <p className="muted">
              12 вымышленных участников · двусторонняя гипотеза · α = 0,05
            </p>
          </div>
        </div>
        <StatisticsResult
          result={result}
          alpha={fixture.request.alpha}
          reportId="landing-pearson-example"
        />
        <details className="landing-report-audit">
          <summary>Формула и исходные данные примера</summary>
          <p className="formula">{result.formula}</p>
          <ol>
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>№</th>
                  {fixture.request.groups.map((g) => (
                    <th key={g.label}>{g.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fixture.request.groups[0].values.map((_, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    {fixture.request.groups.map((g) => (
                      <td key={g.label}>{number(g.values[i])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </Workspace>
  );
}
