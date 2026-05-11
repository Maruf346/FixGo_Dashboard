import { apiFetch } from "./api";
import { loadStoredAuth } from "./auth";

export interface CategoryStats {
  categories: number;
  services: number;
  active_services: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CategoryItem[];
}

export interface CategoryListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  is_active?: boolean;
}

export const getCategoryStats = async (): Promise<CategoryStats> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch<CategoryStats>("/api/services/admin/categories/service-stats/", {}, accessToken || undefined);
};

export const getCategories = async (params: CategoryListParams): Promise<CategoryListResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());
  if (params.search) query.append("search", params.search);
  if (params.ordering) query.append("ordering", params.ordering);
  if (params.is_active !== undefined) query.append("is_active", String(params.is_active));

  const { accessToken } = loadStoredAuth();
  return apiFetch<CategoryListResponse>(`/api/services/admin/categories/?${query.toString()}`, {}, accessToken || undefined);
};

const buildCategoryFormData = (data: {
  name?: string;
  description?: string;
  icon?: File | null;
  order?: number;
  is_active?: boolean;
}) => {
  const formData = new FormData();

  if (data.name !== undefined) formData.append("name", data.name);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.icon instanceof File) formData.append("icon", data.icon);
  if (data.order !== undefined) formData.append("order", String(data.order));
  if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "true" : "false");

  return formData;
};

export const createCategory = async (data: {
  name: string;
  description: string;
  icon: File | null;
  order: number;
  is_active: boolean;
}): Promise<CategoryItem> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch<CategoryItem>("/api/services/admin/categories/", {
    method: "POST",
    body: buildCategoryFormData(data),
  }, accessToken || undefined);
};

export const updateCategory = async (id: string, data: Partial<{
  name: string;
  description: string;
  icon: File | null;
  order: number;
  is_active: boolean;
}>): Promise<CategoryItem> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch<CategoryItem>(`/api/services/admin/categories/${id}/`, {
    method: "PATCH",
    body: buildCategoryFormData(data),
  }, accessToken || undefined);
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { accessToken } = loadStoredAuth();
  await apiFetch<void>(`/api/services/admin/categories/${id}/`, {
    method: "DELETE",
  }, accessToken || undefined);
};