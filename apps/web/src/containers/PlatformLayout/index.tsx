import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bug } from "lucide-react";
import {
  api,
  getCachedCurrentUser,
  getCurrentUser,
  initializeAuth,
  logout,
} from "../../api";
import { PlatformSidebar } from "../../components/PlatformSidebar";
import { ReportIssueModal } from "../../components/ReportIssueModal";
import { collapsedStorageKey, getSidebarLinks } from "./const";
import { FloatingReportButton, Frame, Main } from "./styles";
import type { PlatformLayoutProps } from "./types";

const PlatformAccess = createContext(false);
export function AuthenticatedOnly({ children }: { children: React.ReactNode }) {
  return useContext(PlatformAccess) ? children : null;
}

export function PlatformLayout({
  children,
  publicAccess = false,
}: PlatformLayoutProps) {
  const navigate = useNavigate();
  const cachedUser = getCachedCurrentUser();
  const [authenticated, setAuthenticated] = useState(
    Boolean(cachedUser) || !publicAccess,
  );
  const [role, setRole] = useState(cachedUser?.role ?? "");
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(collapsedStorageKey) === "1";
    } catch {
      return false;
    }
  });
  const [reportOpen, setReportOpen] = useState(false);
  const [category, setCategory] = useState("bug");
  const [description, setDescription] = useState("");
  const [reportSending, setReportSending] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (publicAccess && !(await initializeAuth())) {
          if (active) {
            setAuthenticated(false);
            setRole("");
          }
          return;
        }
        const user = await getCurrentUser();
        if (active) {
          setRole(String(user.role ?? ""));
          setAuthenticated(true);
        }
      } catch {
        if (active && publicAccess) {
          setAuthenticated(false);
          setRole("");
        }
      }
    };
    void load();
    const ended = () => {
      setAuthenticated(false);
      setRole("");
    };
    window.addEventListener("mindresearch:session-ended", ended);
    return () => {
      active = false;
      window.removeEventListener("mindresearch:session-ended", ended);
    };
  }, [publicAccess]);

  useEffect(() => {
    if (!authenticated) return;
    const heartbeat = () => {
      if (document.visibilityState === "visible")
        void api.get("/account/me").catch(() => {});
    };
    heartbeat();
    const timer = window.setInterval(heartbeat, 120_000);
    document.addEventListener("visibilitychange", heartbeat);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", heartbeat);
    };
  }, [authenticated]);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(collapsedStorageKey, next ? "1" : "0");
      } catch {
        /* Keep the menu usable when storage is unavailable. */
      }
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
      const message = (
        requestError as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
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
    <PlatformAccess.Provider value={authenticated}>
      <Frame $collapsed={collapsed}>
        <PlatformSidebar
          collapsed={collapsed}
          links={getSidebarLinks(role, authenticated)}
          onToggle={toggleSidebar}
          onReport={
            authenticated
              ? () => {
                  setReportOpen(true);
                  setReportSent(false);
                }
              : undefined
          }
          onLogout={authenticated ? signOut : undefined}
        />
        <Main>{children}</Main>
        {authenticated && (
          <FloatingReportButton
            type="button"
            aria-label="Сообщить об ошибке"
            title="Сообщить об ошибке"
            onClick={() => {
              setReportOpen(true);
              setReportSent(false);
            }}
          >
            <Bug size={20} />
          </FloatingReportButton>
        )}
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
    </PlatformAccess.Provider>
  );
}

export type { PlatformLayoutProps } from "./types";
