export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").trim();

export function getApiUrl(path: string) {
  const normalizedBase = API_BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!normalizedBase) {
    throw new Error("VITE_API_BASE_URL is not configured. Please add it to your .env.local file.");
  }

  return `${normalizedBase}${normalizedPath}`;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}, token?: string) {
  const url = getApiUrl(path);
  const headers: Record<string, string> = {
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  const text = await response.text();

  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new ApiError("Invalid JSON response from API.", response.status, text);
  }

  if (!response.ok) {
    const message = data?.message || data?.detail || response.statusText || "API request failed";
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

