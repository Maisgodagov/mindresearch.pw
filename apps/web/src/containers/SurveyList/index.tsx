import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  ArchiveRestore,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";
import { api, getCurrentUser, useDemoFallbacks } from "../../api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { Button, SkeletonScreen } from "../../ui";
import { demoSurveys, demoUser } from "../../platform/demo";
import { PlatformLayout } from "../PlatformLayout";
import type { Survey } from "./types";
import { formatSurveyDate } from "./const";
import {
  Head,
  Grid,
  SectionTitle,
  SurveyCard,
  TrashBar,
  TrashPanel,
} from "./styles";
import { SurveyConfirmModal } from "../../components/SurveyConfirmModal";

export function PlatformHome() {
  const [surveys, setSurveys] = useState<Survey[]>([]),
    [trash, setTrash] = useState<Survey[]>([]),
    [loading, setLoading] = useState(true),
    [trashOpen, setTrashOpen] = useState(false),
    [deleteTarget, setDeleteTarget] = useState<Survey | null>(null),
    [archiveTarget, setArchiveTarget] = useState<Survey | null>(null),
    [name, setName] = useState(""),
    [copied, setCopied] = useState(""),
    [publishing, setPublishing] = useState(""),
    [working, setWorking] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    Promise.all([
      api.get("/admin/surveys"),
      api.get("/account/surveys/trash"),
      getCurrentUser(),
    ])
      .then(([s, t, u]) => {
        setSurveys(s.data);
        setTrash(t.data);
        setName(u.name);
      })
      .catch(() => {
        if (useDemoFallbacks) {
          setSurveys(demoSurveys);
          setName(demoUser.name);
        } else {
          setError("Не удалось загрузить опросы с сервера.");
        }
      })
      .finally(() => setLoading(false));
  }, []);
  const copy = async (s: Survey) => {
    await navigator.clipboard.writeText(`${location.origin}/s/${s.slug}`);
    setCopied(s.id);
    setTimeout(() => setCopied(""), 1800);
  };
  const publish = async (s: Survey) => {
    setPublishing(s.id);
    setError("");
    try {
      await api.post(`/account/surveys/${s.id}/publish`);
      setSurveys((current) =>
        current.map((item) =>
          item.id === s.id ? { ...item, status: "active" } : item,
        ),
      );
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Не удалось опубликовать опрос"));
    } finally {
      setPublishing("");
    }
  };
  const moveToTrash = async () => {
    if (!deleteTarget) return;
    setWorking(deleteTarget.id);
    setError("");
    try {
      await api.post(`/account/surveys/${deleteTarget.id}/trash`);
      setSurveys((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      setTrash((current) => [
        { ...deleteTarget, deletedAt: new Date().toISOString() },
        ...current,
      ]);
      setDeleteTarget(null);
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(err, "Не удалось переместить опрос в корзину"),
      );
    } finally {
      setWorking("");
    }
  };
  const restore = async (survey: Survey) => {
    setWorking(survey.id);
    setError("");
    try {
      await api.post(`/account/surveys/${survey.id}/restore`);
      setTrash((current) => current.filter((item) => item.id !== survey.id));
      setSurveys((current) => [
        { ...survey, deletedAt: undefined },
        ...current,
      ]);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Не удалось восстановить опрос"));
    } finally {
      setWorking("");
    }
  };
  const archive = async () => {
    if (!archiveTarget) return;
    setWorking(archiveTarget.id);
    setError("");
    try {
      await api.post(`/account/surveys/${archiveTarget.id}/archive`);
      setSurveys((current) =>
        current.map((item) =>
          item.id === archiveTarget.id ? { ...item, status: "archived" } : item,
        ),
      );
      setArchiveTarget(null);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Не удалось завершить исследование"));
    } finally {
      setWorking("");
    }
  };
  const unarchive = async (survey: Survey) => {
    setWorking(survey.id);
    setError("");
    try {
      await api.post(`/account/surveys/${survey.id}/unarchive`);
      setSurveys((current) =>
        current.map((item) =>
          item.id === survey.id ? { ...item, status: "active" } : item,
        ),
      );
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(err, "Не удалось вернуть исследование из архива"),
      );
    } finally {
      setWorking("");
    }
  };
  if (loading)
    return (
      <PlatformLayout>
        <SkeletonScreen variant="cards" />
      </PlatformLayout>
    );
  const publishedSurveys = surveys.filter(
    (survey) => survey.status !== "draft",
  );
  const draftSurveys = surveys.filter((survey) => survey.status === "draft");
  const orderedSurveys = [...publishedSurveys, ...draftSurveys];
  return (
    <PlatformLayout>
      <Head>
        <div>
          <span className="hello">Здравствуйте{name ? `, ${name}` : ""}</span>
          <h1>Ваши опросы</h1>
        </div>
        <Link to="/app/surveys/new">
          <Button type="primary" size="large">
            <Plus size={17} /> Новый опрос
          </Button>
        </Link>
      </Head>
      {error && <p style={{ color: "#a25c55" }}>{error}</p>}
      <Grid>
        {orderedSurveys.map((s, index) => (
          <Fragment key={s.id}>
            {index === 0 && publishedSurveys.length > 0 && (
              <SectionTitle>
                <h2>Опубликованные опросы</h2>
                <span>{publishedSurveys.length}</span>
              </SectionTitle>
            )}
            {index === publishedSurveys.length && draftSurveys.length > 0 && (
              <SectionTitle className="drafts">
                <h2>Черновики</h2>
                <span>{draftSurveys.length}</span>
              </SectionTitle>
            )}
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
                <div className="card-tools">
                  <Link
                    className="tool-button edit"
                    to={`/app/surveys/${s.id}/edit`}
                    aria-label={`${s.hasBuilderState ? "Продолжить создание" : "Редактировать опрос"} ${s.title}`}
                    title={
                      s.hasBuilderState
                        ? "Продолжить создание"
                        : "Редактировать"
                    }
                  >
                    <Pencil size={15} />
                  </Link>
                  <Button
                    className="delete"
                    aria-label={`Удалить опрос ${s.title}`}
                    title="Переместить в корзину"
                    onClick={() => setDeleteTarget(s)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
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
              <div className="actions">
                <div className="links">
                  {s.status === "active" ? (
                    <>
                      <Button className="copy" onClick={() => copy(s)}>
                        <Copy size={14} />
                        {copied === s.id ? "Скопировано" : "Скопировать ссылку"}
                      </Button>
                      <a
                        className="open-survey-link"
                        href={`/s/${s.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Открыть опрос"
                      >
                        <ExternalLink size={14} /> Открыть
                      </a>
                      <Button
                        className="archive-action"
                        onClick={() => setArchiveTarget(s)}
                      >
                        <Archive size={14} /> Завершить
                      </Button>
                    </>
                  ) : s.status === "archived" ? (
                    <Button
                      className="archive-action"
                      disabled={working === s.id}
                      onClick={() => unarchive(s)}
                    >
                      <ArchiveRestore size={14} />
                      {working === s.id ? "Возвращаем…" : "Вернуть из архива"}
                    </Button>
                  ) : s.hasBuilderState ? (
                    <Link className="continue" to={`/app/surveys/${s.id}/edit`}>
                      <Pencil size={14} /> Продолжить
                    </Link>
                  ) : (
                    <Button
                      className="publish"
                      disabled={publishing === s.id}
                      onClick={() => publish(s)}
                    >
                      <Send size={14} />
                      {publishing === s.id ? "Публикуем…" : "Опубликовать"}
                    </Button>
                  )}
                </div>
                <Link to={`/app/surveys/${s.id}/results`}>
                  Статистика <ArrowRight size={14} />
                </Link>
              </div>
            </SurveyCard>
          </Fragment>
        ))}
      </Grid>
      <TrashBar>
        <Button
          className="open-trash"
          onClick={() => setTrashOpen((value) => !value)}
        >
          <Trash2 size={14} /> Корзина{trash.length ? ` (${trash.length})` : ""}{" "}
          <ArrowRight
            size={13}
            style={{ transform: trashOpen ? "rotate(90deg)" : "none" }}
          />
        </Button>
      </TrashBar>
      {trashOpen && (
        <TrashPanel>
          <h2>Удалённые опросы</h2>
          <p className="hint">
            Опросы и все собранные ответы сохранены. Их можно восстановить в
            любой момент.
          </p>
          <div className="items">
            {trash.map((s) => (
              <div className="item" key={s.id}>
                <div>
                  <b>{s.title}</b>
                  <span>
                    {s.responses} прохождений · {s.completed} завершено
                  </span>
                </div>
                <Button
                  className="restore"
                  disabled={working === s.id}
                  onClick={() => restore(s)}
                >
                  <RotateCcw size={14} />
                  {working === s.id ? "Восстанавливаем…" : "Восстановить"}
                </Button>
              </div>
            ))}
            {!trash.length && <div className="empty">Корзина пуста</div>}
          </div>
        </TrashPanel>
      )}
      <SurveyConfirmModal
        open={Boolean(archiveTarget)}
        title="Завершить исследование?"
        description={
          archiveTarget
            ? "Сбор ответов для опроса «" +
              archiveTarget.title +
              "» будет остановлен."
            : ""
        }
        warning="Респонденты увидят сообщение о завершении исследования. Опрос, ответы и статистика сохранятся, а исследование можно будет вернуть из архива."
        confirmLabel="Завершить исследование"
        loading={Boolean(archiveTarget && working === archiveTarget.id)}
        onCancel={() => setArchiveTarget(null)}
        onConfirm={archive}
      />
      <SurveyConfirmModal
        open={Boolean(deleteTarget)}
        title="Переместить опрос в корзину?"
        description={
          deleteTarget
            ? "Опрос «" +
              deleteTarget.title +
              "» исчезнет из кабинета, а его публичная ссылка перестанет работать."
            : ""
        }
        warning="Все вопросы, результаты и ответы респондентов сохранятся. Опрос можно восстановить из корзины."
        confirmLabel="В корзину"
        loading={Boolean(deleteTarget && working === deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={moveToTrash}
      />
    </PlatformLayout>
  );
}
