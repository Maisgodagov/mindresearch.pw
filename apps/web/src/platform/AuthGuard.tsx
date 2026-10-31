import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { initializeAuth, getCurrentUser } from "../api";
import { RouteSkeleton } from "../components/RouteSkeleton";
import { Button, Page, Shell } from "../ui";

type AuthState = "loading" | "allowed" | "denied" | "forbidden" | "unavailable";

export function AuthGuard({
  children,
  loginPath = "/login",
  adminOnly = false,
}: {
  children: ReactNode;
  loginPath?: string;
  adminOnly?: boolean;
}) {
  const [state, setState] = useState<AuthState>("loading");
  const [retry, setRetry] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      try {
        const token = await initializeAuth();
        const allowed = token && (!adminOnly || ["admin", "owner"].includes((await getCurrentUser()).role));
        if (active) setState(!token ? "denied" : allowed ? "allowed" : "forbidden");
      } catch {
        // A restart or a temporary network failure does not mean the session
        // has expired. Keep the route and let the user retry the check.
        if (active) setState("unavailable");
      }
    };
    const ended = () => setState("denied");
    window.addEventListener("mindresearch:session-ended", ended);
    void checkSession();
    return () => {
      active = false;
      window.removeEventListener("mindresearch:session-ended", ended);
    };
  }, [retry, adminOnly]);

  if (state === "forbidden") return <Navigate to="/app" replace />;

  if (state === "loading")
    return (
      <RouteSkeleton />
    );

  if (state === "unavailable")
    return (
      <Page>
        <Shell style={{ padding: "12vh 0" }}>
          <section
            role="alert"
            style={{
              maxWidth: 520,
              margin: "0 auto",
              padding: 28,
              border: "1px solid #dce6d9",
              borderRadius: 18,
              background: "#fff",
              color: "#405747",
            }}
          >
            <h1 style={{ margin: "0 0 10px", fontSize: 22 }}>
              Не удалось проверить сессию
            </h1>
            <p style={{ margin: "0 0 18px", lineHeight: 1.6, color: "#758178" }}>
              Сервер может быть временно недоступен. Проверьте подключение и повторите
              попытку — входить заново пока не нужно.
            </p>
            <Button type="primary" onClick={() => {
              setState("loading");
              setRetry((value) => value + 1);
            }}>
              Повторить
            </Button>
          </section>
        </Shell>
      </Page>
    );

  if (state === "denied")
    return (
      <Navigate
        to={loginPath}
        replace
        state={{ from: location.pathname }}
      />
    );

  return children;
}
