import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "antd";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Eye,
  ExternalLink,
  Lock,
  Trash2,
} from "lucide-react";
import { api, getCurrentUser } from "../../api";
import { Button, SkeletonScreen } from "../../ui";
import { StockAvatar } from "../../components/StockAvatar";
import { SurveyTile } from "../../components/SurveyTile";
import { Grid } from "../SurveyList/styles";
import type { Survey } from "../SurveyList/types";
import type { CurrentUser } from "../../types/user";
import { PlatformLayout } from "../PlatformLayout";
import { AdminWorkspace } from "./workspaceStyles";
import { AnalyticsPanel, dateTime } from "./AnalyticsPanel";
import { getApiErrorMessage } from "../../utils/apiErrors";

type Profile = CurrentUser & {
  lastSeenAt: string | null;
  onboardingStatus: string;
};
type Deletion = {
  surveys: number;
  responses: number;
  answers: number;
  email: string;
  canDelete: boolean;
};
export function AdminUserPage() {
  const { userId } = useParams();
  const nav = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null),
    [surveys, setSurveys] = useState<Survey[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [tab, setTab] = useState("profile"),
    [canDelete, setCanDelete] = useState(false),
    [copied, setCopied] = useState("");
  const [deletion, setDeletion] = useState<Deletion | null>(null),
    [confirmation, setConfirmation] = useState(""),
    [deleting, setDeleting] = useState(false),
    [deleteError, setDeleteError] = useState("");
  useEffect(() => {
    let live = true;
    setLoading(true);
    setError("");
    setProfile(null);
    setTab("profile");
    Promise.all([
      api.get<Profile>(`/admin/users/${userId}`),
      api.get<Survey[]>("/admin/surveys", { params: { ownerId: userId } }),
      getCurrentUser(),
    ])
      .then(([p, s, me]) => {
        if (!live) return;
        setProfile(p.data);
        setSurveys(s.data);
        setCanDelete(
          p.data.id !== me.id &&
            p.data.role !== "owner" &&
            (p.data.role !== "admin" || me.role === "owner"),
        );
      })
      .catch((e) => {
        if (live)
          setError(getApiErrorMessage(e, "Не удалось открыть пользователя"));
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [userId]);
  const openDelete = async () => {
    setDeleteError("");
    setConfirmation("");
    try {
      const r = await api.get<Deletion>(
        `/admin/users/${userId}/deletion-preview`,
      );
      setDeletion(r.data);
    } catch (e) {
      setError(
        getApiErrorMessage(e, "Не удалось проверить данные пользователя"),
      );
    }
  };
  const remove = async () => {
    if (!deletion) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await api.delete(`/admin/users/${userId}`, {
        data: { confirmEmail: confirmation.trim() },
      });
      nav("/app/admin?tab=users", { replace: true });
    } catch (e) {
      setDeleteError(getApiErrorMessage(e, "Не удалось удалить пользователя"));
    } finally {
      setDeleting(false);
    }
  };
  const copy = async (s: Survey) => {
    try {
      await navigator.clipboard.writeText(`${location.origin}/s/${s.slug}`);
      setCopied(s.id);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      setError(
        "Не удалось скопировать ссылку. Её можно выделить ниже карточки.",
      );
    }
  };
  return (
    <PlatformLayout>
      <AdminWorkspace>
        <Link className="back" to="/app/admin?tab=users">
          <ArrowLeft size={16} /> Все пользователи
        </Link>
        {loading ? (
          <SkeletonScreen variant="cards" />
        ) : error && !profile ? (
          <p role="alert" className="error">
            {error}
          </p>
        ) : (
          profile && (
            <>
              <div className="top">
                <div>
                  <span className="muted">Пользователь платформы</span>
                  <h1>{profile.name}</h1>
                  <span>{profile.email}</span>
                </div>
                {canDelete && (
                  <Button danger onClick={() => void openDelete()}>
                    <Trash2 size={15} /> Удалить пользователя
                  </Button>
                )}
              </div>
              {error && (
                <p role="alert" className="error">
                  {error}
                </p>
              )}
              <div className="summary-metrics">
                {[
                  [surveys.length, "опросов"],
                  [
                    surveys.filter((s) => s.status === "active").length,
                    "опубликовано",
                  ],
                  [
                    surveys.reduce((n, s) => n + Number(s.responses), 0),
                    "прохождений",
                  ],
                  [
                    surveys.reduce((n, s) => n + Number(s.completed), 0),
                    "завершено",
                  ],
                ].map(([v, l]) => (
                  <div className="metric" key={l}>
                    <b>{v}</b>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
              <nav className="tabs" aria-label="Разделы пользователя">
                {[
                  ["profile", "Профиль"],
                  ["surveys", "Опросы"],
                  ["activity", "Активность и записи"],
                ].map(([key, label]) => (
                  <Button
                    key={key}
                    aria-pressed={tab === key}
                    onClick={() => setTab(key)}
                  >
                    {label}
                  </Button>
                ))}
              </nav>
              {tab === "profile" && (
                <div className="columns">
                  <section className="panel">
                    <div className="profile">
                      <div className="avatar">
                        <StockAvatar
                          seed={profile.avatarSeed || "willow"}
                          alt="Аватар пользователя"
                        />
                      </div>
                      <div>
                        <h2>{profile.name}</h2>
                        <p className="survey-description">
                          {profile.bio || "Описание профиля пока не добавлено"}
                        </p>
                        <span className="muted">
                          {profile.isProfilePublic ? (
                            "Публичный профиль"
                          ) : (
                            <>
                              <Lock size={13} /> Приватный профиль · доступен
                              администратору
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    {profile.publicSlug && profile.isProfilePublic && (
                      <div className="link-line">
                        <a
                          href={`/p/${profile.publicSlug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink size={14} /> Публичная страница
                        </a>
                      </div>
                    )}
                  </section>
                  <section className="panel">
                    <h2>Данные аккаунта</h2>
                    <dl className="facts">
                      <dt>Почта</dt>
                      <dd>{profile.email}</dd>
                      <dt>Роль</dt>
                      <dd>
                        {profile.role === "owner"
                          ? "Владелец"
                          : profile.role === "admin"
                            ? "Администратор"
                            : "Исследователь"}
                      </dd>
                      <dt>Зарегистрирован</dt>
                      <dd>{dateTime(profile.createdAt)}</dd>
                      <dt>Последняя активность</dt>
                      <dd>{dateTime(profile.lastSeenAt)}</dd>
                      <dt>Знакомство с платформой</dt>
                      <dd>
                        {profile.onboardingStatus === "completed"
                          ? "Пройдено"
                          : profile.onboardingStatus === "skipped"
                            ? "Пропущено"
                            : "Не завершено"}
                      </dd>
                      <dt>Адрес профиля</dt>
                      <dd>{profile.publicSlug || "Не задан"}</dd>
                    </dl>
                  </section>
                </div>
              )}
              {tab === "surveys" && (
                <>
                  <p className="muted">
                    Все опросы пользователя, включая черновики и архив. Просмотр
                    и статистика не меняют содержимое опроса.
                  </p>
                  <Grid>
                    {surveys.map((s) => (
                      <div key={s.id}>
                        <SurveyTile
                          survey={s}
                          tools={
                            <Link
                              className="tool-button"
                              title="Посмотреть содержание"
                              to={`/app/admin/users/${userId}/surveys/${s.id}`}
                            >
                              <Eye size={16} />
                            </Link>
                          }
                        >
                          <div className="links">
                            <Link
                              className="continue"
                              to={`/app/admin/users/${userId}/surveys/${s.id}`}
                            >
                              <Eye size={14} /> Посмотреть
                            </Link>
                            {s.status === "active" && (
                              <a
                                href={`/s/${s.slug}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ExternalLink size={14} /> Открыть
                              </a>
                            )}
                          </div>
                          <Link
                            to={`/app/admin/users/${userId}/surveys/${s.id}/results`}
                          >
                            Статистика <ArrowRight size={14} />
                          </Link>
                        </SurveyTile>
                        <div className="link-line">
                          <a
                            href={`/s/${s.slug}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {location.origin}/s/{s.slug}
                          </a>
                          <Button
                            aria-label={`Скопировать ссылку на ${s.title}`}
                            onClick={() => void copy(s)}
                          >
                            <Copy size={14} />
                            {copied === s.id ? "Скопировано" : "Скопировать"}
                          </Button>
                          {s.status !== "active" && (
                            <small className="muted">
                              Ссылка недоступна респондентам:{" "}
                              {s.status === "draft" ? "черновик" : "архив"}
                            </small>
                          )}
                        </div>
                      </div>
                    ))}
                  </Grid>
                  {!surveys.length && (
                    <div className="panel empty">
                      У пользователя пока нет опросов.
                    </div>
                  )}
                </>
              )}
              {tab === "activity" && <AnalyticsPanel userId={userId} />}
            </>
          )
        )}
        <Modal
          open={!!deletion}
          title="Удалить пользователя и его данные?"
          footer={null}
          onCancel={() => {
            if (!deleting) setDeletion(null);
          }}
          maskClosable={!deleting}
          closable={!deleting}
        >
          <AdminWorkspace>
            {deletion && (
              <>
                <p>
                  Будут удалены аккаунт <b>{deletion.email}</b>, все его опросы,
                  включая корзину, и собранные ответы.
                </p>
                <dl className="facts">
                  <dt>Опросы</dt>
                  <dd>{deletion.surveys}</dd>
                  <dt>Прохождения</dt>
                  <dd>{deletion.responses}</dd>
                  <dt>Ответы</dt>
                  <dd>{deletion.answers}</dd>
                </dl>
                <p>
                  Это действие нельзя отменить. Для подтверждения введите почту
                  пользователя.
                </p>
                <label htmlFor="delete-user-email">Почта пользователя</label>
                <input
                  id="delete-user-email"
                  autoComplete="off"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: 12,
                    margin: "10px 0 20px",
                    border: "1px solid #cbd9ca",
                    borderRadius: 10,
                  }}
                />
                {deleteError && (
                  <p className="error" role="alert">
                    {deleteError}
                  </p>
                )}
                <div className="tabs">
                  <Button disabled={deleting} onClick={() => setDeletion(null)}>
                    Отмена
                  </Button>
                  <Button
                    type="primary"
                    danger
                    loading={deleting}
                    disabled={
                      !deletion.canDelete ||
                      confirmation.trim().toLowerCase() !==
                        deletion.email.toLowerCase()
                    }
                    onClick={() => void remove()}
                  >
                    Удалить аккаунт и опросы
                  </Button>
                </div>
              </>
            )}
          </AdminWorkspace>
        </Modal>
      </AdminWorkspace>
    </PlatformLayout>
  );
}
