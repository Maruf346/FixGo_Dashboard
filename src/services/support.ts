import { apiFetch } from "./api";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface RichContentResponse {
  content: string;
  updated_at?: string;
}

export async function getFaqs(token?: string) {
  return apiFetch<{ count: number; next: string | null; previous: string | null; results: FaqItem[] }>(
    "/api/supports/faq/manage/",
    { method: "GET" },
    token,
  );
}

export async function createFaq(token: string, question: string, answer: string) {
  return apiFetch<FaqItem>(
    "/api/supports/faq/manage/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    },
    token,
  );
}

export async function deleteFaq(token: string, id: string) {
  return apiFetch<null>(
    `/api/supports/faq/manage/${id}/`,
    { method: "DELETE" },
    token,
  );
}

export async function getAboutUs(token?: string) {
  return apiFetch<RichContentResponse>("/api/supports/about-us/", { method: "GET" }, token);
}

export async function patchAboutUs(token: string, content: string) {
  return apiFetch<RichContentResponse>(
    "/api/supports/admin/about-us/",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    },
    token,
  );
}

export async function getTerms(token?: string) {
  return apiFetch<RichContentResponse>("/api/supports/terms/", { method: "GET" }, token);
}

export async function patchTerms(token: string, content: string) {
  return apiFetch<RichContentResponse>(
    "/api/supports/admin/terms/",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    },
    token,
  );
}

export async function getPrivacy(token?: string) {
  return apiFetch<RichContentResponse>("/api/supports/privacy/", { method: "GET" }, token);
}

export async function patchPrivacy(token: string, content: string) {
  return apiFetch<RichContentResponse>(
    "/api/supports/admin/privacy/",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    },
    token,
  );
}
