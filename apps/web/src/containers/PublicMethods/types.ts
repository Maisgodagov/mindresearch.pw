import { initializeAuth } from "../../api";
export type PublicMethod = {
  slug: string;
  code: string;
  title: string;
  name: string;
  abbreviation: string;
  topic: string;
  minutes: string;
  version: string;
  intro: string;
  audience: string;
  instruction: string;
  sections: { title: string; text: string }[];
  limitations: string;
  rights: string;
  sources: { title: string; url: string }[];
};
export type Scale = {
  label: string;
  value: number;
  min: number;
  max: number;
  explanation: string;
};
export type PublicResult = {
  method: PublicMethod;
  revision: string;
  completedAt: string;
  scales: Scale[];
  explanation: string;
};
export type Assessment = {
  id: string;
  definition: {
    method: PublicMethod;
    revision: string;
    questions: {
      code: string;
      text: string;
      options?: { value: string; label: string }[];
    }[];
  };
  answers: Record<string, number>;
  result: PublicResult | null;
  position: number;
  revision: number;
  expiresAt: string;
};
export async function publicRequest<T>(
  path: string,
  body?: unknown,
  method = "POST",
  signal?: AbortSignal,
): Promise<T> {
  const token = await initializeAuth();
  const response = await fetch(`/api/public/${path}`, {
    method: body === undefined && method === "POST" ? "GET" : method,
    credentials: "same-origin",
    headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  }).catch((error: Error) => {
    if (error.name === "AbortError") throw error;
    throw new Error(
      "Нет соединения с сервером. Проверьте интернет и повторите действие; ранее сохранённые ответы останутся доступны.",
    );
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || "Не удалось загрузить данные. Попробуйте ещё раз.",
    );
  }
  return response.status === 204 ? (undefined as T) : response.json();
}
export const savedKey = (slug: string) => `mr.public.assessment.${slug}`;
export function savedAssessment(slug: string) {
  try {
    return localStorage.getItem(savedKey(slug));
  } catch {
    return null;
  }
}
export function rememberAssessment(slug: string, id?: string) {
  try {
    if (id) localStorage.setItem(savedKey(slug), id);
    else localStorage.removeItem(savedKey(slug));
  } catch {
    /* Cookies still authorize the current session. */
  }
}
export const formatScore = (value: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(value);
