import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "../../ui";
import { SelectField } from "../SelectField";
import { roleOptions, userTableHeadings } from "./const";
import { TableCard, UsersCard } from "./styles";
import type { AdminUsersTableProps } from "./types";
const online = (date: string | null) =>
  !!date && Date.now() - new Date(date).getTime() < 5 * 60_000;
const timestamp = (date: string | null) =>
  date ? new Date(date).getTime() : 0;
export function AdminUsersTable({
  users,
  canChangeRoles,
  onRoleChange,
  onSaveRole,
}: AdminUsersTableProps) {
  const [search, setSearch] = useState(""),
    [role, setRole] = useState("all"),
    [activity, setActivity] = useState("all"),
    [sort, setSort] = useState("newest");
  const visible = useMemo(
    () =>
      users
        .filter(
          (u) =>
            (role === "all" || u.role === role) &&
            [u.name, u.email].some((v) =>
              v.toLowerCase().includes(search.toLowerCase()),
            ) &&
            (activity === "all" ||
              (activity === "online"
                ? online(u.lastSeenAt)
                : activity === "no-surveys"
                  ? Number(u.surveyCount) === 0
                  : Date.now() - timestamp(u.lastSeenAt ?? u.createdAt) >
                    30 * 86_400_000)),
        )
        .sort((a, b) =>
          sort === "active"
            ? timestamp(b.lastSeenAt) - timestamp(a.lastSeenAt)
            : sort === "inactive"
              ? timestamp(a.lastSeenAt) - timestamp(b.lastSeenAt)
              : sort === "surveys"
                ? Number(b.surveyCount) - Number(a.surveyCount)
                : timestamp(b.createdAt) - timestamp(a.createdAt),
        ),
    [users, role, search, activity, sort],
  );
  return (
    <UsersCard>
      <div className="user-filters">
        <label>
          Имя или почта
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Найти пользователя"
          />
        </label>
        <label>
          Роль
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="all">Все роли</option>
            <option value="researcher">Исследователи</option>
            <option value="admin">Администраторы</option>
            <option value="owner">Владельцы</option>
          </select>
        </label>
        <label>
          Активность
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="all">Все пользователи</option>
            <option value="online">Онлайн за 5 минут</option>
            <option value="inactive">Нет активности 30 дней</option>
            <option value="no-surveys">Без опросов</option>
          </select>
        </label>
        <label>
          Сортировка
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Сначала новые</option>
            <option value="active">Недавно активные</option>
            <option value="inactive">Давно не заходили</option>
            <option value="surveys">Больше опросов</option>
          </select>
        </label>
      </div>
      <p className="results-count">
        Найдено {visible.length} из {users.length}
      </p>
      <TableCard>
        <div className="user-grid meta">
          {userTableHeadings.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        {visible.map((user) => (
          <div className="user-entry" key={user.id}>
            <div className="user-grid">
              <div className="user-name">
                <Link to={`/app/admin/users/${user.id}`}>
                  <b>{user.name}</b>
                </Link>
                <span>
                  {user.email} · с{" "}
                  {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                </span>
                <span className="last-seen">
                  {online(user.lastSeenAt)
                    ? "Онлайн за последние 5 минут"
                    : user.lastSeenAt
                      ? `Последняя активность: ${new Date(user.lastSeenAt).toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" })}`
                      : "Активность пока не зафиксирована"}
                </span>
                <Link
                  className="survey-toggle"
                  to={`/app/admin/users/${user.id}`}
                >
                  Профиль, опросы и активность →
                </Link>
              </div>
              <Metric value={user.surveyCount} label="опросов" />
              <Metric value={user.activeSurveyCount} label="активных" />
              <Metric value={user.responseCount} label="начатых" />
              <Metric value={user.completedCount} label="завершено" />
              <div className="role">
                {user.role === "owner" ? (
                  <span className="badge">
                    <ShieldCheck size={11} /> Владелец
                  </span>
                ) : (
                  <>
                    <SelectField
                      className="role-select"
                      disabled={!canChangeRoles}
                      size="middle"
                      options={roleOptions}
                      value={user.role}
                      onChange={(value) =>
                        onRoleChange(user.id, String(value ?? "researcher"))
                      }
                      getPopupContainer={(trigger) =>
                        trigger.parentElement ?? document.body
                      }
                    />
                    {canChangeRoles && (
                      <Button onClick={() => onSaveRole(user)}>
                        Сохранить
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {!visible.length && (
          <p role="status">
            Пользователи не найдены. Измените поиск или фильтры.
          </p>
        )}
      </TableCard>
    </UsersCard>
  );
}
function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="metric">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
export type { AdminUsersTableProps } from "./types";
