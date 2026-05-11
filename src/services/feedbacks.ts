import { apiFetch } from "./api";
import { loadStoredAuth } from "./auth";

export interface FeedbackItem {
  id: string;
  subject: string;
  email: string;
  message: string;
  attachment: string | null;
  created_at: string;
  updated_at: string;
  user: string | null;
}

export interface FeedbackListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FeedbackItem[];
}

export interface FeedbackListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

export const getFeedbacks = async (params: FeedbackListParams): Promise<FeedbackListResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());
  if (params.search) query.append("search", params.search);
  if (params.ordering) query.append("ordering", params.ordering);

  const { accessToken } = loadStoredAuth();
  return apiFetch<FeedbackListResponse>(`/api/supports/admin/feedbacks/?${query.toString()}`, {}, accessToken || undefined);
};