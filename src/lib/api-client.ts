import { getCsrfToken } from "@/lib/csrf";

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers ?? {});

  if (MUTATION_METHODS.has(method) && !headers.has("X-CSRF-Token")) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
  }

  return fetch(input, {
    ...init,
    method,
    headers,
  });
}
