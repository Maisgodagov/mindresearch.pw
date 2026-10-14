import { usePageTitle } from "../../pageTitle";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BarChart3, Eye } from "lucide-react";
import { api } from "../../api";
import { Button, SkeletonScreen } from "../../ui";
import { BuilderPreview } from "../../components/BuilderPreview";
import type { PreviewQuestion } from "../../components/BuilderPreview/types";
import type { AdminSurveyDetail } from "../../types/admin";
import { PlatformLayout } from "../PlatformLayout";
import { AdminWorkspace } from "./workspaceStyles";
import { Dashboard } from "../SurveyDashboard";
import { getApiErrorMessage } from "../../utils/apiErrors";

export function AdminSurveyPage() {
  const { userId, surveyId } = useParams();
  const [detail, setDetail] = useState<AdminSurveyDetail | null>(null),
    [error, setError] = useState(""),
    [preview, setPreview] = useState(false);
  useEffect(() => {
    let live = true;
    setDetail(null);
    setError("");
    api
      .get<AdminSurveyDetail>(`/admin/users/${userId}/surveys/${surveyId}`)
      .then((r) => {
        if (live) setDetail(r.data);
      })
      .catch((e) => {
        if (live) setError(getApiErrorMessage(e, "Не удалось открыть опрос"));
      });
    return () => {
      live = false;
    };
  }, [userId, surveyId]);
  usePageTitle(detail?`${detail.title} — просмотр опроса`:undefined);
  const questions: PreviewQuestion[] =
    detail?.sections.flatMap((s, i) =>
      s.questions.map((q, j) => ({
        ...q,
        id: `${i}-${j}`,
        type: q.type as PreviewQuestion["type"],
        options: q.options ?? [],
        sectionTitle: s.title,
      })),
    ) ?? [];
  return (
    <PlatformLayout>
      <AdminWorkspace>
        <Link className="back" to={`/app/admin/users/${userId}`}>
          <ArrowLeft size={16} /> К пользователю
        </Link>
        {error ? (
          <p role="alert" className="error">
            {error}
          </p>
        ) : !detail ? (
          <SkeletonScreen variant="form" />
        ) : (
          <>
            <div className="top">
              <div>
                <span className="muted">
                  Просмотр администратором ·{" "}
                  {detail.status === "draft"
                    ? "черновик"
                    : detail.status === "active"
                      ? "опубликован"
                      : "архив"}
                </span>
                <h1>{detail.title}</h1>
              </div>
              <div className="tabs">
                <Button
                  onClick={() => setPreview(true)}
                  disabled={!questions.length}
                >
                  <Eye size={16} /> Как видит респондент
                </Button>
                <Link
                  to={`/app/admin/users/${userId}/surveys/${surveyId}/results`}
                >
                  <Button>
                    <BarChart3 size={16} /> Статистика
                  </Button>
                </Link>
              </div>
            </div>
            <section className="panel">
              <h2>{detail.welcomeTitle || detail.title}</h2>
              <p className="survey-description">{detail.welcomeText}</p>
              {detail.description && (
                <p className="muted survey-description">{detail.description}</p>
              )}
            </section>
            <div className="panel survey-content">
              <h2>Содержание опроса · {questions.length} вопросов</h2>
              {detail.sections.map((s, i) => (
                <section key={i}>
                  <h3>{s.title}</h3>
                  {s.description && <p>{s.description}</p>}
                  <ol>
                    {s.questions.map((q, j) => (
                      <li key={j}>
                        <b>{q.text}</b>
                        {q.options?.length ? (
                          <ul>
                            {q.options.map((o, k) => (
                              <li key={k}>{o.label ?? o.value}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="muted">
                            {q.type === "number"
                              ? "Числовой ответ"
                              : "Свободный ответ"}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
            {preview && (
              <BuilderPreview
                closeLabel="Вернуться к просмотру"
                meta={{
                  welcomeTitle: detail.welcomeTitle || detail.title,
                  welcomeText: detail.welcomeText,
                  showAuthor: false,
                  resultPresentation: detail.resultPresentation ?? {
                    title: "Спасибо за участие",
                    text: "Это предпросмотр. Ответы не сохраняются.",
                    showScores: false,
                  },
                }}
                questions={questions}
                onClose={() => setPreview(false)}
              />
            )}
          </>
        )}
      </AdminWorkspace>
    </PlatformLayout>
  );
}
export function AdminSurveyStatistics() {
  const { userId } = useParams();
  return (
    <PlatformLayout>
      <AdminWorkspace>
        <Link className="back" to={`/app/admin/users/${userId}`}>
          <ArrowLeft size={16} /> К пользователю
        </Link>
        <p className="muted">
          Просмотр статистики администратором. Доступны фильтры, ответы и
          экспорт; данные пользователя не изменяются.
        </p>
      </AdminWorkspace>
      <Dashboard embedded inspectionOwnerId={userId} />
    </PlatformLayout>
  );
}
