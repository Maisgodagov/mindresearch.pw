import { useCallback, useEffect, useMemo, useState } from "react";
import { api, getCurrentUser } from "../../api";
import { AdminPage } from "../../components/AdminPage";
import { AdminRequestList } from "../../components/AdminRequestList";
import { AdminTabs } from "../../components/AdminTabs";
import { AdminUsersTable } from "../../components/AdminUsersTable";
import { Button, SkeletonScreen } from "../../ui";
import { PlatformLayout } from "../PlatformLayout";
import { MethodologyStudio } from "../MethodologyStudio";
import { initialAdminTab, toMethodQueueItem, toReportQueueItem } from "./const";
import type { AdminUser, BugReport, MethodSubmission, Tab } from "./types";

export function AdminCenter() {
  const [activeTab, setActiveTab] = useState<Tab>(initialAdminTab);
  const [methods, setMethods] = useState<MethodSubmission[]>([]);
  const [reports, setReports] = useState<BugReport[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const load = useCallback(async () => {
    const [methodResponse, reportResponse, userResponse, currentUser] = await Promise.all([
      api.get<MethodSubmission[]>("/admin/instrument-submissions"),
      api.get<BugReport[]>("/admin/bug-reports"),
      api.get<AdminUser[]>("/admin/users"),
      getCurrentUser(),
    ]);
    setMethods(methodResponse.data);
    setReports(reportResponse.data);
    setUsers(userResponse.data);
    setRole(String(currentUser.role ?? ""));
    setLoading(false);
  }, []);

  useEffect(() => { load().catch(() => setLoading(false)); }, [load]);

  const counts = useMemo(() => ({
    methods: methods.filter((item) => ["submitted", "reviewing"].includes(item.status)).length,
    reports: reports.filter((item) => ["new", "in_progress"].includes(item.status)).length,
    users: users.length,
  }), [methods, reports, users]);

  async function updateMethod(item: MethodSubmission, status: string) {
    await api.patch(`/admin/instrument-submissions/${item.id}`, { status, adminNote: item.adminNote ?? "" });
    await load();
  }

  async function updateReport(item: BugReport, status: string) {
    await api.patch(`/admin/bug-reports/${item.id}`, { status, adminNote: item.adminNote ?? "" });
    await load();
  }

  async function updateRole(user: AdminUser) {
    await api.patch(`/admin/users/${user.id}/role`, { role: user.role });
    await load();
  }

  if (loading) return <PlatformLayout><SkeletonScreen variant="dashboard" /></PlatformLayout>;

  return (
    <PlatformLayout>
      <AdminPage>
        <h1>Админ-центр</h1>
        <p className="lead">Заявки, сообщения пользователей и управление доступом.</p>
        <AdminTabs activeTab={activeTab} counts={counts} onChange={setActiveTab} />
        {activeTab === "studio" && <MethodologyStudio />}
        {activeTab === "methods" && (
          <AdminRequestList
            kind="method"
            items={methods.map(toMethodQueueItem)}
            emptyText="Заявок пока нет."
            onNoteChange={(id, adminNote) => setMethods((current) => current.map((item) => item.id === id ? { ...item, adminNote } : item))}
            onStatusChange={(item, status) => {
              const source = methods.find((method) => method.id === item.id);
              if (source) void updateMethod(source, status);
            }}
          />
        )}
        {activeTab === "reports" && (
          <AdminRequestList
            kind="report"
            items={reports.map(toReportQueueItem)}
            emptyText="Сообщений пока нет."
            onNoteChange={(id, adminNote) => setReports((current) => current.map((item) => item.id === id ? { ...item, adminNote } : item))}
            onStatusChange={(item, status) => {
              const source = reports.find((report) => report.id === item.id);
              if (source) void updateReport(source, status);
            }}
          />
        )}
        {activeTab === "users" && (
          <AdminUsersTable
            users={users}
            canChangeRoles={role === "owner"}
            onRoleChange={(id, nextRole) => setUsers((current) => current.map((user) => user.id === id ? { ...user, role: nextRole } : user))}
            onSaveRole={(user) => void updateRole(user)}
          />
        )}
      </AdminPage>
    </PlatformLayout>
  );
}
