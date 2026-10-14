import type { ReactNode } from "react";
import {
  Archive,
  CalendarDays,
  CheckCircle2,
  Clock3,
  BarChart3,
} from "lucide-react";
import { SurveyCard } from "../../containers/SurveyList/styles";
import { formatSurveyDate } from "../../containers/SurveyList/const";
import type { Survey } from "../../containers/SurveyList/types";
export function SurveyTile({
  survey: s,
  tools,
  children,
}: {
  survey: Survey;
  tools?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SurveyCard>
      <div className="card-head">
        <span
          className={`status ${s.status === "draft" ? "draft" : s.status === "archived" ? "archived" : ""}`}
        >
          {s.status === "active" ? (
            <CheckCircle2 size={12} />
          ) : s.status === "archived" ? (
            <Archive size={12} />
          ) : (
            <Clock3 size={12} />
          )}{" "}
          {s.status === "active"
            ? "Опубликован"
            : s.status === "archived"
              ? "В архиве"
              : "Черновик"}
        </span>
        <div className="card-tools">{tools}</div>
      </div>
      <div className="card-info">
        <h2>{s.title}</h2>
        <div className="description">
          {s.description || "Описание пока не добавлено"}
        </div>
        {(s.status === "draft" ? s.updatedAt : s.createdAt) && (
          <div className="survey-date">
            <CalendarDays size={13} />
            {s.status === "draft"
              ? `Изменён ${formatSurveyDate(s.updatedAt, true)}`
              : `Создан ${formatSurveyDate(s.createdAt)}`}
          </div>
        )}
      </div>
      <div className="metrics">
        <span>
          <BarChart3 size={14} />
          <b>{s.responses}</b>
          <small>Прохождений</small>
        </span>
        <span>
          <CheckCircle2 size={14} />
          <b>{s.completed}</b>
          <small>Завершено</small>
        </span>
      </div>

      <div className="actions">{children}</div>
    </SurveyCard>
  );
}
