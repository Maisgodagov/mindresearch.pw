import { ShieldCheck } from "lucide-react";
import { Button } from "../../ui";
import { SelectField } from "../SelectField";
import { roleOptions, userTableHeadings } from "./const";
import { TableCard, UsersCard } from "./styles";
import type { AdminUsersTableProps } from "./types";

export function AdminUsersTable({ users, canChangeRoles, onRoleChange, onSaveRole }: AdminUsersTableProps) {
  return <UsersCard><TableCard>
    <div className="user-grid meta">{userTableHeadings.map((heading) => <span key={heading}>{heading}</span>)}</div>
    {users.map((user) => <div className="user-grid" key={user.id}>
      <div className="user-name"><b>{user.name}</b><span>{user.email} · с {new Date(user.createdAt).toLocaleDateString("ru-RU")}</span></div>
      <Metric value={user.surveyCount} label="опросов" />
      <Metric value={user.activeSurveyCount} label="активных" />
      <Metric value={user.responseCount} label="ответов" />
      <Metric value={user.completedCount} label="завершено" />
      <div className="role">
        {user.role === "owner" ? <span className="badge"><ShieldCheck size={11} /> Владелец</span> : <>
          <SelectField className="role-select" disabled={!canChangeRoles} size="middle" options={roleOptions} value={user.role} onChange={(value) => onRoleChange(user.id, String(value ?? "researcher"))} getPopupContainer={(trigger) => trigger.parentElement ?? document.body} />
          {canChangeRoles && <Button onClick={() => onSaveRole(user)}>Сохранить</Button>}
        </>}
      </div>
    </div>)}
  </TableCard></UsersCard>;
}

function Metric({ value, label }: { value: number; label: string }) {
  return <div className="metric"><b>{value}</b><span>{label}</span></div>;
}

export type { AdminUsersTableProps } from "./types";
