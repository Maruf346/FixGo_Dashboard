import { apiFetch } from "./api";
import { loadStoredAuth } from "./auth";

export interface Client {
  id: string;
  full_name: string;
  profile_picture: string | null;
  email: string;
  phone: string;
  total_orders_count: number;
  completed_orders_count: number;
  cancelled_orders_count: number;
  location: {
    id: string;
    label: string;
    custom_label: string;
    address_line: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    latitude: string;
    longitude: string;
    is_default: boolean;
  };
  is_active: boolean;
}

export interface ClientDetail extends Client {
  birth_date: string | null;
  created_at: string;
  average_rating: string;
  review_count: number;
  booking_history: {
    id: string;
    booking_id: string;
    service_name: string;
    status: string;
    scheduled_date: string;
    scheduled_time: string;
    total_amount: string | null;
    created_at: string;
  }[];
}

export interface ClientsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Client[];
}

export const getClients = async (params: {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  ordering?: string;
}): Promise<ClientsListResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());
  if (params.search) query.append("search", params.search);
  if (params.is_active !== undefined) query.append("is_active", params.is_active.toString());
  if (params.ordering) query.append("ordering", params.ordering);

  const { accessToken } = loadStoredAuth();
  return apiFetch(`/api/user/admin/clients/?${query.toString()}`, {}, accessToken || undefined);
};

export const getClientDetail = async (id: string): Promise<ClientDetail> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch(`/api/user/admin/clients/${id}/`, {}, accessToken || undefined);
};

export const toggleUserActive = async (id: string): Promise<void> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch(`/api/user/admin/users/${id}/toggle-active/`, {
    method: "POST",
  }, accessToken || undefined);
};

export const deleteUser = async (id: string): Promise<void> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch(`/api/user/admin/users/${id}/delete-user/`, {
    method: "DELETE",
  }, accessToken || undefined);
};