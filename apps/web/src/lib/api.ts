export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
};

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

function readCookie(name: string): string | null {
  const row = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
  return row ? decodeURIComponent(row.slice(name.length + 1)) : null;
}

async function refreshCsrfCookie() {
  await fetch("/sanctum/csrf-cookie", { credentials: "include" });
}

type Options = { method?: string; body?: unknown };

export async function api<T = unknown>(path: string, options: Options = {}, retried = false): Promise<T> {
  const method = options.method ?? "GET";
  const isWrite = method !== "GET";

  if (isWrite && !readCookie("XSRF-TOKEN")) {
    await refreshCsrfCookie();
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (isWrite) headers["X-XSRF-TOKEN"] = readCookie("XSRF-TOKEN") ?? "";

  const res = await fetch(path, {
    method,
    credentials: "include",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 419 && !retried) {
    await refreshCsrfCookie();
    return api<T>(path, options, true);
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, data.message ?? "Request failed", data.errors ?? {});
  }
  return data as T;
}
