export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").trim();

export function getApiUrl(path: string) {
  const normalizedBase = API_BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!normalizedBase) {
    throw new Error("VITE_API_BASE_URL is not configured. Please add it to your .env.local file.");
  }

  return `${normalizedBase}${normalizedPath}`;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const url = getApiUrl(path);
  const response = await fetch(url, options);
  const text = await response.text();

  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error("Invalid JSON response from API.");
  }

  if (!response.ok) {
    const message = data?.message || data?.detail || response.statusText || "API request failed";
    throw new Error(message);
  }

  return data as T;
}
