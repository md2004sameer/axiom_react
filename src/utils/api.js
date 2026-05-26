import { BASE } from "../constants/config";

async function apiFetch(method, path, body, token) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (path, token) => apiFetch("GET", path, undefined, token),
  post: (path, body, token) => apiFetch("POST", path, body, token),
  put: (path, body, token) => apiFetch("PUT", path, body, token),
  del: (path, token) => apiFetch("DELETE", path, undefined, token),
};
