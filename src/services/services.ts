import { apiFetch } from "./api";
import { loadStoredAuth } from "./auth";

export interface ServiceItem {
  id: string;
  category: string;
  category_name: string;
  name: string;
  description: string;
  icon: string | null;
  image: string | null;
  price_range_min: string;
  price_range_max: string;
  priority: string;
  completion_time: number;
  avg_rating: string;
  review_count: number;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceItem[];
}

export interface ServiceListParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  is_active?: boolean;
  is_popular?: boolean;
  priority?: string;
  ordering?: string;
}

const buildServiceFormData = (data: {
  category?: string;
  name?: string;
  description?: string;
  icon?: File | null;
  image?: File | null;
  price_range_min?: string;
  price_range_max?: string;
  priority?: string;
  completion_time?: number;
  is_active?: boolean;
}) => {
  const formData = new FormData();

  if (data.category !== undefined) formData.append("category", data.category);
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.icon instanceof File) formData.append("icon", data.icon);
  if (data.image instanceof File) formData.append("image", data.image);
  if (data.price_range_min !== undefined) formData.append("price_range_min", data.price_range_min);
  if (data.price_range_max !== undefined) formData.append("price_range_max", data.price_range_max);
  if (data.priority !== undefined) formData.append("priority", data.priority);
  if (data.completion_time !== undefined) formData.append("completion_time", String(data.completion_time));
  if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "true" : "false");

  return formData;
};

export const getServices = async (params: ServiceListParams): Promise<ServiceListResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());
  if (params.search) query.append("search", params.search);
  if (params.category) query.append("category", params.category);
  if (params.is_active !== undefined) query.append("is_active", String(params.is_active));
  if (params.is_popular !== undefined) query.append("is_popular", String(params.is_popular));
  if (params.priority) query.append("priority", params.priority);
  if (params.ordering) query.append("ordering", params.ordering);

  const { accessToken } = loadStoredAuth();
  return apiFetch<ServiceListResponse>(`/api/services/admin/services/?${query.toString()}`, {}, accessToken || undefined);
};

export const getServiceDetail = async (id: string): Promise<ServiceItem> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch<ServiceItem>(`/api/services/admin/services/${id}/`, {}, accessToken || undefined);
};

export const createService = async (data: {
  category: string;
  name: string;
  description: string;
  icon: File | null;
  image: File | null;
  price_range_min: string;
  price_range_max: string;
  priority: string;
  completion_time: number;
  is_active: boolean;
}): Promise<ServiceItem> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch<ServiceItem>("/api/services/admin/services/", {
    method: "POST",
    body: buildServiceFormData(data),
  }, accessToken || undefined);
};

export const updateService = async (id: string, data: Partial<{
  category: string;
  name: string;
  description: string;
  icon: File | null;
  image: File | null;
  price_range_min: string;
  price_range_max: string;
  priority: string;
  completion_time: number;
  is_active: boolean;
}>): Promise<ServiceItem> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch<ServiceItem>(`/api/services/admin/services/${id}/`, {
    method: "PATCH",
    body: buildServiceFormData(data),
  }, accessToken || undefined);
};

export const deleteService = async (id: string): Promise<void> => {
  const { accessToken } = loadStoredAuth();
  await apiFetch<void>(`/api/services/admin/services/${id}/`, {
    method: "DELETE",
  }, accessToken || undefined);
};
