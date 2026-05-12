import { apiFetch } from "./api";

export type ChatSender = "user" | "ai";

export interface ChatSessionListParams {
  page?: number;
  page_size?: number;
  search?: string;
  user_type?: "client" | "artisan";
  ordering?: string;
}

export interface ChatSessionListItem {
  id: string;
  user_name: string;
  user_email: string;
  user_picture: string | null;
  user_type: "client" | "artisan";
  conversation_id: string;
  message_count: number;
  last_message: {
    sender: ChatSender;
    content: string;
    timestamp: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatSessionListItem[];
}

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  content: string;
  timestamp: string;
}

export interface ChatSessionDetail {
  id: string;
  user_name: string;
  user_email: string;
  user_type: "client" | "artisan";
  conversation_id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  user_picture: string | null;
}

export async function getChatSessions(
  params: ChatSessionListParams,
  token?: string,
): Promise<ChatSessionListResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.page_size !== undefined) query.set("page_size", String(params.page_size));
  if (params.search) query.set("search", params.search);
  if (params.user_type) query.set("user_type", params.user_type);
  if (params.ordering) query.set("ordering", params.ordering);

  return apiFetch<ChatSessionListResponse>(`/api/chat/ai/admin/?${query.toString()}`, { method: "GET" }, token);
}

export async function getChatSessionDetail(
  id: string,
  token?: string,
): Promise<ChatSessionDetail> {
  return apiFetch<ChatSessionDetail>(`/api/chat/ai/admin/${id}/`, { method: "GET" }, token);
}
