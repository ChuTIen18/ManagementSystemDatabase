import { API_BASE_URL } from "@shared/constants";

export type ApiErrorShape = {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
};

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, options?: { code?: string; status?: number }) {
    super(message);
    this.code = options?.code;
    this.status = options?.status;
  }
}

function getBaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  return (envUrl || API_BASE_URL).replace(/\/+$/, "");
}

function joinUrl(baseUrl: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export async function apiPost<TResponse>(
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(joinUrl(getBaseUrl(), path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    body: JSON.stringify(body),
    ...init,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const code = payload?.error?.code;
    const message =
      payload?.error?.message || `Request failed (${response.status})`;
    throw new ApiError(message, { code, status: response.status });
  }

  return payload as TResponse;
}

