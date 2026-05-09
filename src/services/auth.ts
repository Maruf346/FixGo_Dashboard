import { apiFetch, getApiUrl } from "./api";

const STORAGE_KEY = "fixgo_auth_state";

export interface AuthUser {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  profile_picture: string | null;
  birth_date: string | null;
  role: string;
  provider: string;
  artisan_profile: unknown;
  client_profile: unknown;
  created_at: string;
}

interface LoginResponse {
  message: string;
  tokens: {
    refresh: string;
    access: string;
  };
  user: AuthUser;
}

interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

function getStorage(rememberMe: boolean) {
  return rememberMe ? window.localStorage : window.sessionStorage;
}

export function saveAuthState(auth: StoredAuth, rememberMe = false) {
  const storage = getStorage(rememberMe);
  storage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function loadStoredAuth(): { accessToken: string | null; refreshToken: string | null; user: AuthUser | null } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { accessToken: null, refreshToken: null, user: null };
    }

    const parsed = JSON.parse(raw) as StoredAuth;
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      user: parsed.user,
    };
  } catch (error) {
    console.warn("Unable to load auth state", error);
    return { accessToken: null, refreshToken: null, user: null };
  }
}

export function clearStoredAuth() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export async function loginAdmin(email: string, password: string) {
  const data = await apiFetch<LoginResponse>("/api/user/admin/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return data;
}

export interface ProfileData {
  id: string;
  full_name: string | null;
  email: string;
  profile_picture: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAdminProfile(accessToken: string): Promise<ProfileData> {
  return apiFetch<ProfileData>("/api/user/admin/profile/", {
    method: "GET",
  }, accessToken);
}

export async function updateAdminProfile(accessToken: string, data: {
  full_name?: string;
  phone?: string;
  profile_picture?: File | null;
}): Promise<ProfileData> {
  const formData = new FormData();
  if (data.full_name !== undefined) formData.append("full_name", data.full_name);
  if (data.phone !== undefined) formData.append("phone", data.phone);
  if (data.profile_picture) formData.append("profile_picture", data.profile_picture);

  return apiFetch<ProfileData>("/api/user/admin/profile/", {
    method: "PATCH",
    body: formData,
  }, accessToken);
}

export async function logoutAdmin(accessToken: string) {
  return apiFetch("/api/user/admin/logout/", {
    method: "POST",
  }, accessToken);
}
