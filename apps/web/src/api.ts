import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { CurrentUser } from "./types/user";
const baseURL = import.meta.env.VITE_API_URL ?? "/api";
export const useDemoFallbacks =
  import.meta.env.DEV && import.meta.env.VITE_USE_DEMO_FALLBACKS === "true";
let accessToken: string | null = null,
  refreshPromise: Promise<string | null> | null = null,
  currentUser: CurrentUser | null = null,
  currentUserPromise: Promise<CurrentUser> | null = null;

function removeLegacyToken() {
  try {
    localStorage.removeItem("admin_token");
  } catch {
    // Authentication now uses the HttpOnly refresh cookie; storage may be
    // unavailable in some private or embedded browser modes.
  }
}

let legacyToken: string | null = null;
try {
  legacyToken = localStorage.getItem("admin_token");
} catch {
  // Continue with the HttpOnly refresh cookie when Web Storage is disabled.
}
if (legacyToken) {
  accessToken = legacyToken;
  removeLegacyToken();
}
export const api = axios.create({ baseURL, withCredentials: true });
const authApi = axios.create({ baseURL, withCredentials: true });
const refreshLockName = "mindresearch-auth-refresh";

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function postRefreshWithRetry() {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await authApi.post<{ token: string }>("/auth/refresh");
    } catch (error) {
      lastError = error;
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const retryable = status === 401 || status === undefined || status >= 500;
      if (attempt === 0 && retryable) {
        await wait(status === 401 ? 180 : 450);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

async function requestRefresh(): Promise<Awaited<ReturnType<typeof postRefreshWithRetry>>> {
  if (typeof navigator !== "undefined" && navigator.locks) {
    return await navigator.locks.request(
      refreshLockName,
      { mode: "exclusive" },
      async () => await postRefreshWithRetry(),
    ) as Awaited<ReturnType<typeof postRefreshWithRetry>>;
  }
  return await postRefreshWithRetry();
}
export function setAccessToken(token: string | null) {
  accessToken = token;
  currentUser = null;
  currentUserPromise = null;
  removeLegacyToken();
  if (token) window.dispatchEvent(new Event("mindresearch:authenticated"));
}
export function hasAccessToken() {
  return Boolean(accessToken);
}
export function getCachedCurrentUser(): CurrentUser | null {
  return currentUser;
}
export function invalidateCurrentUser() {
  currentUser = null;
  currentUserPromise = null;
}
export function getCurrentUser(): Promise<CurrentUser> {
  if (currentUser) return Promise.resolve(currentUser);
  if (!currentUserPromise)
    currentUserPromise = api
      .get<CurrentUser>("/account/me")
      .then((r) => (currentUser = r.data))
      .catch((error) => {
        currentUserPromise = null;
        throw error;
      });
  return currentUserPromise;
}
async function refreshAccessToken() {
  if (!refreshPromise)
    refreshPromise = requestRefresh()
      .then((r) => {
        accessToken = r.data.token;
        return accessToken;
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          accessToken = null;
          return null;
        }
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  return refreshPromise;
}
export async function initializeAuth() {
  return accessToken ?? refreshAccessToken();
}
export async function logout() {
  try {
    await authApi.post("/auth/logout");
  } finally {
    setAccessToken(null);
  }
}
export async function logoutAll() {
  try {
    await api.post("/auth/logout-all");
  } finally {
    setAccessToken(null);
  }
}
api.interceptors.request.use((c) => {
  if (accessToken) c.headers.Authorization = `Bearer ${accessToken}`;
  return c;
});
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const config = error.config as
        (InternalAxiosRequestConfig & { _authRetry?: boolean }) | undefined,
      isAuthEndpoint = Boolean(config?.url?.startsWith("/auth/"));
    if (
      error.response?.status !== 401 ||
      !config ||
      config._authRetry ||
      isAuthEndpoint
    )
      return Promise.reject(error);
    config._authRetry = true;
    // A 401 confirms this access token has expired. Clear only the in-memory
    // copy; temporary refresh/network failures must not be treated as logout.
    accessToken = null;
    let token: string | null;
    try {
      token = await refreshAccessToken();
    } catch {
      return Promise.reject(error);
    }
    if (!token) {
      window.dispatchEvent(new Event("mindresearch:session-ended"));
      return Promise.reject(error);
    }
    config.headers.Authorization = `Bearer ${token}`;
    return api(config);
  },
);
