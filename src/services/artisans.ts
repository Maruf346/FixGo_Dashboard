import { apiFetch } from "./api";
import { loadStoredAuth } from "./auth";

export interface Artisan {
  id: string;
  full_name: string;
  profile_picture: string | null;
  email: string;
  phone: string;
  total_jobs_done: number;
  average_rating: string;
  verification_status: "unverified" | "pending" | "verified" | "rejected";
  location: {
    id: string;
    label: string;
    custom_label: string;
    address_line: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    latitude: string | null;
    longitude: string | null;
    is_default: boolean;
  };
  is_active: boolean;
}

export interface ArtisanDetail extends Artisan {
  birth_date: string | null;
  role: string;
  occupation: string;
  bio: string;
  years_of_experience: number;
  skills: string[];
  service_areas: string[];
  hourly_rate: string;
  is_online: boolean;
  is_available: boolean;
  joined_at: string;
  total_earnings: string;
  review_count: number;
  total_orders_count: number;
  completed_orders_count: number;
  cancelled_orders_count: number;
  booking_history: {
    id: string;
    booking_id: string;
    service_name: string;
    client_name: string;
    status: string;
    scheduled_date: string;
    scheduled_time: string;
    total_amount: string | null;
    artisan_payout: string | null;
    created_at: string;
  }[];
}

export interface ArtisansListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Artisan[];
}

export const getArtisans = async (params: {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  verification_status?: "unverified" | "pending" | "verified" | "rejected";
  is_online?: boolean;
  ordering?: string;
}): Promise<ArtisansListResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());
  if (params.search) query.append("search", params.search);
  if (params.is_active !== undefined) query.append("is_active", params.is_active.toString());
  if (params.is_online !== undefined) query.append("is_online", params.is_online.toString());
  if (params.verification_status) query.append("verification_status", params.verification_status);
  if (params.ordering) query.append("ordering", params.ordering);

  const { accessToken } = loadStoredAuth();
  return apiFetch(`/api/user/admin/artisans/?${query.toString()}`, {}, accessToken || undefined);
};

export const getArtisanDetail = async (id: string): Promise<ArtisanDetail> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch(`/api/user/admin/artisans/${id}/`, {}, accessToken || undefined);
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
