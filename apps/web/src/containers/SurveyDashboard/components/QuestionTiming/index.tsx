import { useMemo } from "react";
import styled from "styled-components";
import type { Respondent } from "../../types";

export function formatQuestionTime(milliseconds: number) {
  if (milliseconds < 1000) return "< 1 сек";
  const seconds = Math.round(milliseconds / 1000);
  return seconds < 60 ? `${seconds} сек` : `${Math.floor(seconds / 60)} мин ${seconds % 60} сек`;
}

const Summary = styled.section`
  padding: 19px;
  border: 1px solid #dde6da;
  border-radius: 14px;
  background: #fff;
  h2 { margin: 0; font-size: 18px; color: #23372a; }
  p { color: #526557; font-size: 12px; line-height: 1.5; margin: 8px 0 14px; }
  .scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #e9eee7; }
  th { color: #526557; background: #f5f8f3; }
  .number { white-space: nowrap; font-variant-numeric: tabular-nums; }
  .section { display: block; margin-bottom: 4px; color: #526557; font-size: 11px; }
  @media (max-width: 560px) { padding: 12px; table { min-width: 510px; } }
`;

export function QuestionTiming({ respondents }: { respondents: Respondent[] }) {
  const rows = useMemo(() => {
    const collected = new Map<string, { section: string; question: string; times: number[] }>();
    for (const person of respondents) {
      if (person.status !== "completed") continue;
      for (const group of person.groups) for (const answer of group.answers) {
        if (answer.activeMs == null || !Number.isFinite(answer.activeMs)) continue;
        const key = `${group.id}:${answer.code}`;
        const row = collected.get(key) ?? { section: group.title, question: answer.question, times: [] };
        row.times.push(answer.activeMs); collected.set(key, row);
      }
    }
    return Array.from(collected, ([key, row]) => {
      const times = row.times.sort((a, b) => a - b), middle = Math.floor(times.length / 2);
      return { key, ...row, average: times.reduce((a, b) => a + b, 0) / times.length,
        median: times.length % 2 ? times[middle] : (times[middle - 1] + times[middle]) / 2 };
    });
  }, [respondents]);
  return <Summary>
    <h2>Время ответа на вопросы</h2>
    <p>Время в видимой вкладке, включая повторные посещения вопроса. В сводке учитываются только завершённые прохождения с измерениями. Для старых ответов данные не собирались.</p>
    {rows.length ? <div className="scroll"><table>
      <thead><tr><th>Вопрос</th><th>Среднее</th><th>Медиана</th><th>Респондентов</th></tr></thead>
      <tbody>{rows.map(row => <tr key={row.key}>
        <td><span className="section">{row.section}</span>{row.question}</td>
        <td className="number">{formatQuestionTime(row.average)}</td>
        <td className="number">{formatQuestionTime(row.median)}</td>
        <td className="number">{row.times.length}</td>
      </tr>)}</tbody>
    </table></div> : <p>Измерения появятся после новых завершённых прохождений опроса.</p>}
  </Summary>;
}
