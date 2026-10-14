import { useState } from "react";
import { ChevronDown, ChevronRight, ShieldCheck } from "lucide-react";
import { api } from "../../api";
import { Button } from "../../ui";
import { SelectField } from "../SelectField";
import { roleOptions, userTableHeadings } from "./const";
import { TableCard, UsersCard } from "./styles";
import type { AdminSurvey, AdminSurveyDetail } from "../../types/admin";
import type { AdminUsersTableProps } from "./types";

const dateTime = (value: string) => new Date(value).toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" });
const statusLabel: Record<string, string> = { draft: "Черновик", active: "Активен", archived: "Архив" };

export function AdminUsersTable({ users, canChangeRoles, onRoleChange, onSaveRole }: AdminUsersTableProps) {
  const [openedUser, setOpenedUser] = useState<string | null>(null);
  const [surveys, setSurveys] = useState<Record<string, AdminSurvey[]>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminSurveyDetail | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggleUser(id: string) {
    if (openedUser === id) { setOpenedUser(null); setSelected(null); return; }
    setOpenedUser(id); setSelected(null); setDetail(null); setError("");
    if (surveys[id]) return;
    setBusy(true);
    try { const response = await api.get<AdminSurvey[]>(`/admin/users/${id}/surveys`); setSurveys(current => ({ ...current, [id]: response.data })); }
    catch { setError("Не удалось загрузить опросы. Попробуйте ещё раз."); }
    finally { setBusy(false); }
  }

  async function openSurvey(userId: string, surveyId: string) {
    if (selected === surveyId) { setSelected(null); return; }
    setSelected(surveyId); setDetail(null); setError(""); setBusy(true);
    try { const response = await api.get<AdminSurveyDetail>(`/admin/users/${userId}/surveys/${surveyId}`); setDetail(response.data); }
    catch { setError("Не удалось открыть опрос. Попробуйте ещё раз."); }
    finally { setBusy(false); }
  }

  return <UsersCard><TableCard>
    <div className="user-grid meta">{userTableHeadings.map(heading => <span key={heading}>{heading}</span>)}</div>
    {users.map(user => <div className="user-entry" key={user.id}>
      <div className="user-grid">
        <div className="user-name"><b>{user.name}</b><span>{user.email} · с {new Date(user.createdAt).toLocaleDateString("ru-RU")}</span><span className="last-seen">{user.lastSeenAt ? Date.now() - new Date(user.lastSeenAt).getTime() < 5 * 60_000 ? "Онлайн сейчас" : `Был(а) онлайн: ${dateTime(user.lastSeenAt)}` : "Активность пока не зафиксирована"}</span><button className="survey-toggle" type="button" aria-expanded={openedUser === user.id} onClick={() => void toggleUser(user.id)}>{openedUser === user.id ? <ChevronDown size={15} /> : <ChevronRight size={15} />} Опросы пользователя</button></div>
        <Metric value={user.surveyCount} label="опросов" /><Metric value={user.activeSurveyCount} label="активных" /><Metric value={user.responseCount} label="начатых" /><Metric value={user.completedCount} label="завершено" />
        <div className="role">{user.role === "owner" ? <span className="badge"><ShieldCheck size={11} /> Владелец</span> : <><SelectField className="role-select" disabled={!canChangeRoles} size="middle" options={roleOptions} value={user.role} onChange={value => onRoleChange(user.id, String(value ?? "researcher"))} getPopupContainer={trigger => trigger.parentElement ?? document.body} />{canChangeRoles && <Button onClick={() => onSaveRole(user)}>Сохранить</Button>}</>}</div>
      </div>
      {openedUser === user.id && <div className="survey-panel">
        {busy && !surveys[user.id] && <p>Загружаем опросы…</p>}
        {error && <p className="error" role="alert">{error}</p>}
        {surveys[user.id]?.length === 0 && <p>У пользователя пока нет опросов.</p>}
        {surveys[user.id]?.map(survey => <div className="survey-item" key={survey.id}>
          <div><strong>{survey.title}</strong><span>{statusLabel[survey.status]} · создан {dateTime(survey.createdAt)} · прошли: {survey.completedCount}</span></div>
          <button type="button" onClick={() => void openSurvey(user.id, survey.id)} aria-expanded={selected === survey.id}>{selected === survey.id ? "Скрыть" : "Посмотреть опрос"}</button>
          {selected === survey.id && <div className="survey-detail">{busy && !detail ? <p>Загружаем содержание…</p> : detail && <><h3>{detail.welcomeTitle || detail.title}</h3>{detail.welcomeText && <p>{detail.welcomeText}</p>}{detail.description && <p>{detail.description}</p>}{detail.sections.map((section, index) => <section key={index}><h4>{section.title}</h4>{section.description && <p>{section.description}</p>}{section.questions.length ? <ol>{section.questions.map((question, qIndex) => <li key={qIndex}>{question.text}{question.options?.length ? <ul>{question.options.map((option, oIndex) => <li key={oIndex}>{option.label ?? option.value}</li>)}</ul> : null}</li>)}</ol> : <p>Вопросов пока нет.</p>}</section>)}</>}</div>}
        </div>)}
      </div>}
    </div>)}
  </TableCard></UsersCard>;
}

function Metric({ value, label }: { value: number; label: string }) { return <div className="metric"><b>{value}</b><span>{label}</span></div>; }
export type { AdminUsersTableProps } from "./types";
