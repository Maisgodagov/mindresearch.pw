import axios from "axios";

export type ApiErrorPayload = {
  message?: unknown;
  errors?: unknown;
  checks?: unknown;
};

export function getApiErrorPayload(
  error: unknown,
): ApiErrorPayload | undefined {
  return axios.isAxiosError<ApiErrorPayload>(error)
    ? error.response?.data
    : undefined;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const message = getApiErrorPayload(error)?.message;
  return typeof message === "string" ? message : fallback;
}

export function getApiErrorList(error: unknown): string[] {
  const errors = getApiErrorPayload(error)?.errors;
  return Array.isArray(errors)
    ? errors.filter((item): item is string => typeof item === "string")
    : [];
}
