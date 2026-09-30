import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bug } from "lucide-react";
import { api, getCachedCurrentUser, getCurrentUser, logout } from "../../api";
import { PlatformSidebar } from "../../components/PlatformSidebar";
import { ReportIssueModal } from "../../components/ReportIssueModal";
import { collapsedStorageKey, getSidebarLinks } from "./const";
import { FloatingReportButton, Frame, Main } from "./styles";
import type { PlatformLayoutProps } from "./types";

export function PlatformLayout({ children }: PlatformLayoutProps) {
  const navigate = useNavigate();
  const cachedUser = getCachedCurrentUser();
  const [role, setRole] = useState(cachedUser?.role ?? "");
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(collapsedStorageKey) === "1");
  const [reportOpen, setReportOpen] = useState(false);
  const [category, setCategory] = useState("bug");
  const [description, setDescription] = useState("");
  const [reportSending, setReportSending] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    if (!cachedUser) getCurrentUser().then(user => setRole(String(user.role ?? ""))).catch(() => {});
  }, [cachedUser?.role]);

  function toggleSidebar() {
    setCollapsed(current => {
      const next = !current;
      localStorage.setItem(collapsedStorageKey, next ? "1" : "0");
      return next;
    });
  }

  async function sendReport() {
    const trimmedDescription = description.trim();
    if (trimmedDescription.length < 10) return;
    setReportSending(true);
    setReportError("");
    try {
      await api.post("/account/bug-reports", {
        category,
        description: trimmedDescription,
        pageUrl: window.location.href,
      });
      setReportSent(true);
      setDescription("");
    } catch (requestError: unknown) {
      const message = (requestError as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setReportError(message ?? "Не удалось отправить сообщение");
    } finally {
      setReportSending(false);
    }
  }

  async function signOut() {
    await logout();
    navigate("/login");
  }

  return (
    <Frame $collapsed={collapsed}>
      <PlatformSidebar
        collapsed={collapsed}
        links={getSidebarLinks(role)}
        onToggle={toggleSidebar}
        onReport={() => { setReportOpen(true); setReportSent(false); }}
        onLogout={signOut}
      />
      <Main>{children}</Main>
      <FloatingReportButton type="button" aria-label="Сообщить об ошибке" title="Сообщить об ошибке" onClick={() => { setReportOpen(true); setReportSent(false); }}>
        <Bug size={20} />
      </FloatingReportButton>
      <ReportIssueModal
        open={reportOpen}
        sent={reportSent}
        category={category}
        description={description}
        sending={reportSending}
        error={reportError}
        onCategoryChange={setCategory}
        onDescriptionChange={setDescription}
        onClose={() => setReportOpen(false)}
        onSubmit={sendReport}
      />
    </Frame>
  );
}

export type { PlatformLayoutProps } from "./types";
