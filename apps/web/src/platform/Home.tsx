import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  Archive,
  ArchiveRestore,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { api, getCurrentUser } from "../api";
import { Button, Card, SkeletonScreen } from "../ui";
import { demoSurveys, demoUser } from "./demo";
import { PlatformLayout } from "./Layout";

type Survey = {
  id: string;
  slug: string;
  title: string;
  status: string;
  responses: number;
  completed: number;
  description?: string;
  deletedAt?: string;
  hasBuilderState?: boolean | number;
};
const Head = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 28px;
  h1 {
    font:
      500 clamp(32px, 5vw, 46px) var(--font-heading),
      serif;
    margin: 7px 0;
    color: #304a38;
  }
  .hello {
    color: #758178;
  }
  a {
    text-decoration: none;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;
const SectionTitle = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-top: 8px;
  padding: 0 3px;
  h2 {
    margin: 0;
    color: #3a5441;
    font: 600 24px var(--font-heading), serif;
  }
  span {
    color: #839087;
    font-size: 12px;
  }
  &.drafts {
    margin-top: 20px;
    padding-top: 24px;
    border-top: 1px solid #dce5da;
  }
`;
const SurveyCard = styled(Card)`
  padding: 23px;
  border-radius: 20px;
  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .card-tools {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .card-tools a,
  .delete {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: #74837a;
  }
  .card-tools a:hover {
    background: #edf3eb;
    color: #45624e;
  }
  .delete:hover {
    background: #fbefed;
    color: #9c554f;
  }
  h2 {
    font:
      600 21px var(--font-heading),
      serif;
    margin: 8px 0;
    color: #344e3c;
  }
  .status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #52705a;
    background: #e4eee1;
    padding: 5px 8px;
    border-radius: 20px;
  }
  .draft {
    background: #f0eee5;
    color: #7d7255;
  }
  .archived {
    background: #e9ece9;
    color: #69746d;
  }
  .description {
    color: #78847b;
    min-height: 42px;
    font-size: 13px;
    line-height: 1.5;
  }
  .metrics {
    display: flex;
    gap: 18px;
    margin: 20px 0;
    color: #68776d;
    font-size: 12px;
  }
  .metrics span {
    display: flex;
    gap: 5px;
    align-items: center;
  }
  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e7ece5;
    padding-top: 15px;
    gap: 10px;
  }
  .links {
    display: flex;
    gap: 7px;
    align-items: center;
    min-width: 0;
  }
  .actions > a {
    flex: none;
  }
  a,
  .copy,
  .publish,
  .continue,
  .archive-action {
    color: #45624e;
    text-decoration: none;
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .copy,
  .publish,
  .continue,
  .archive-action {
    border: 0;
    background: #edf3eb;
    padding: 8px 10px;
    border-radius: 9px;
    cursor: pointer;
  }
  .publish {
    background: #557660;
    color: #fff;
  }
  .continue {
    background: #557660;
    color: #fff;
    padding: 8px 10px;
    border-radius: 9px;
  }
  .publish:hover {
    background: #45644f;
  }
  .publish:disabled,
  .archive-action:disabled {
    opacity: 0.55;
    cursor: wait;
  }
  .archive-action {
    background: #f0f2ed;
    color: #607066;
  }
  @media (max-width: 520px) {
    .actions {
      align-items: flex-start;
      flex-direction: column;
    }
    .links {
      flex-wrap: wrap;
    }
    .actions > a {
      align-self: flex-end;
    }
  }
`;
const TrashBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
  .open-trash {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 0;
    background: transparent;
    color: #7a877f;
    font-size: 12px;
    padding: 9px;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .open-trash:hover {
    color: #4e6956;
  }
`;
const TrashPanel = styled(Card)`
  margin-top: 8px;
  padding: 20px;
  border-radius: 18px;
  h2 {
    font:
      600 20px var(--font-heading),
      serif;
    color: #3b5342;
    margin: 0 0 5px;
  }
  .hint {
    color: #7b887f;
    font-size: 12px;
    margin: 0 0 14px;
  }
  .items {
    display: grid;
    gap: 9px;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 13px 14px;
    border: 1px solid #e1e7df;
    border-radius: 13px;
    background: #fbfcfa;
  }
  .item b {
    display: block;
    color: #425848;
  }
  .item span {
    font-size: 11px;
    color: #829087;
  }
  .restore {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 0 0 auto;
    border: 1px solid #cbd8ca;
    border-radius: 10px;
    background: #fff;
    color: #4c6954;
    padding: 9px 11px;
    font-weight: 750;
    font-size: 12px;
  }
  .restore:disabled {
    opacity: 0.55;
  }
  .empty {
    padding: 14px;
    text-align: center;
    color: #829087;
    font-size: 12px;
  }
`;
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(28, 40, 31, 0.48);
  backdrop-filter: blur(4px);
`;
const Confirm = styled(Card)`
  width: min(100%, 470px);
  padding: 26px;
  border-radius: 22px;
  position: relative;
  .close {
    position: absolute;
    right: 16px;
    top: 16px;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 10px;
    background: #edf2eb;
    color: #53665a;
  }
  h2 {
    font:
      600 25px var(--font-heading),
      serif;
    color: #344d3b;
    margin: 0 42px 11px 0;
  }
  p {
    color: #69776e;
    line-height: 1.6;
    font-size: 14px;
  }
  .warning {
    padding: 12px 13px;
    border-radius: 12px;
    background: #f7f1e8;
    color: #716548;
    font-size: 12px;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 22px;
  }
  .cancel {
    border: 1px solid #cfdbce;
    background: #fff;
    color: #52675a;
    border-radius: 12px;
    padding: 11px 15px;
    font-weight: 700;
  }
  .confirm {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 0;
    background: #9a5752;
    color: #fff;
    border-radius: 12px;
    padding: 11px 15px;
    font-weight: 750;
  }
  .confirm:hover {
    background: #874844;
  }
  .confirm:disabled {
    opacity: 0.6;
  }
`;

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
        if (import.meta.env.DEV) {
          setSurveys(demoSurveys);
          setName(demoUser.name);
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
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Не удалось опубликовать опрос");
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
    } catch (err: any) {
      setError(
        err.response?.data?.message ?? "Не удалось переместить опрос в корзину",
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
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Не удалось восстановить опрос");
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
    } catch (err: any) {
      setError(
        err.response?.data?.message ?? "Не удалось завершить исследование",
      );
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
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Не удалось вернуть исследование из архива",
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
  const publishedSurveys = surveys.filter((survey) => survey.status !== "draft");
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
          <Button>
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
                  to={`/app/surveys/${s.id}/edit`}
                  aria-label={`${s.hasBuilderState ? "Продолжить создание" : "Редактировать опрос"} ${s.title}`}
                  title={s.hasBuilderState ? "Продолжить создание" : "Редактировать"}
                >
                  <Pencil size={15} />
                </Link>
                <button
                  className="delete"
                  aria-label={`Удалить опрос ${s.title}`}
                  title="Переместить в корзину"
                  onClick={() => setDeleteTarget(s)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <h2>{s.title}</h2>
            <div className="description">
              {s.description || "Описание пока не добавлено"}
            </div>
            <div className="metrics">
              <span>
                <BarChart3 size={14} />
                {s.responses} прохождений
              </span>
              <span>
                <CheckCircle2 size={14} />
                {s.completed} завершено
              </span>
            </div>
            <div className="actions">
              <div className="links">
                {s.status === "active" ? (
                  <>
                    <button className="copy" onClick={() => copy(s)}>
                      <Copy size={14} />
                      {copied === s.id ? "Скопировано" : "Скопировать ссылку"}
                    </button>
                    <a
                      href={`/s/${s.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Открыть опрос"
                    >
                      <ExternalLink size={15} />
                    </a>
                    <button
                      className="archive-action"
                      onClick={() => setArchiveTarget(s)}
                    >
                      <Archive size={14} /> Завершить
                    </button>
                  </>
                ) : s.status === "archived" ? (
                  <button
                    className="archive-action"
                    disabled={working === s.id}
                    onClick={() => unarchive(s)}
                  >
                    <ArchiveRestore size={14} />
                    {working === s.id ? "Возвращаем…" : "Вернуть из архива"}
                  </button>
                ) : s.hasBuilderState ? (
                  <Link className="continue" to={`/app/surveys/${s.id}/edit`}>
                    <Pencil size={14} /> Продолжить
                  </Link>
                ) : (
                  <button
                    className="publish"
                    disabled={publishing === s.id}
                    onClick={() => publish(s)}
                  >
                    <Send size={14} />
                    {publishing === s.id ? "Публикуем…" : "Опубликовать"}
                  </button>
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
        <button
          className="open-trash"
          onClick={() => setTrashOpen((value) => !value)}
        >
          <Trash2 size={14} /> Корзина{trash.length ? ` (${trash.length})` : ""}{" "}
          <ArrowRight
            size={13}
            style={{ transform: trashOpen ? "rotate(90deg)" : "none" }}
          />
        </button>
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
                <button
                  className="restore"
                  disabled={working === s.id}
                  onClick={() => restore(s)}
                >
                  <RotateCcw size={14} />
                  {working === s.id ? "Восстанавливаем…" : "Восстановить"}
                </button>
              </div>
            ))}
            {!trash.length && <div className="empty">Корзина пуста</div>}
          </div>
        </TrashPanel>
      )}
      {archiveTarget && (
        <Overlay
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setArchiveTarget(null);
          }}
        >
          <Confirm
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-survey-title"
          >
            <button
              className="close"
              aria-label="Закрыть"
              onClick={() => setArchiveTarget(null)}
            >
              <X size={17} />
            </button>
            <h2 id="archive-survey-title">Завершить исследование?</h2>
            <p>
              Сбор ответов для опроса «{archiveTarget.title}» будет остановлен.
            </p>
            <div className="warning">
              Респонденты увидят сообщение о завершении исследования. Опрос,
              ответы и статистика сохранятся, а исследование можно будет вернуть
              из архива.
            </div>
            <div className="buttons">
              <button className="cancel" onClick={() => setArchiveTarget(null)}>
                Отмена
              </button>
              <button
                className="confirm"
                disabled={working === archiveTarget.id}
                onClick={archive}
              >
                <Archive size={14} />{" "}
                {working === archiveTarget.id
                  ? "Завершаем…"
                  : "Завершить исследование"}
              </button>
            </div>
          </Confirm>
        </Overlay>
      )}
      {deleteTarget && (
        <Overlay
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDeleteTarget(null);
          }}
        >
          <Confirm
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-survey-title"
          >
            <button
              className="close"
              aria-label="Закрыть"
              onClick={() => setDeleteTarget(null)}
            >
              <X size={17} />
            </button>
            <h2 id="delete-survey-title">Переместить опрос в корзину?</h2>
            <p>
              Опрос «{deleteTarget.title}» исчезнет из кабинета, а его публичная
              ссылка перестанет работать.
            </p>
            <div className="warning">
              Все вопросы, результаты и ответы респондентов сохранятся. Опрос
              можно восстановить из корзины.
            </div>
            <div className="buttons">
              <button className="cancel" onClick={() => setDeleteTarget(null)}>
                Отмена
              </button>
              <button
                className="confirm"
                disabled={working === deleteTarget.id}
                onClick={moveToTrash}
              >
                <Trash2 size={14} />{" "}
                {working === deleteTarget.id ? "Перемещаем…" : "В корзину"}
              </button>
            </div>
          </Confirm>
        </Overlay>
      )}
    </PlatformLayout>
  );
}
