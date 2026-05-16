import { apiFetch } from "./api";
import { loadStoredAuth } from "./auth";

export type BookingStatus =
  | "requested"
  | "confirmed"
  | "cancelled"
  | "on_way"
  | "arrived"
  | "working"
  | "completed";

export type AssignmentMode = "client_chosen" | "auto_assigned";
export type AdditionalCostStatus = "pending" | "approved" | "rejected";

export interface BookingPerson {
  id: string;
  full_name: string;
  email: string;
  profile_picture: string | null;
  phone: string | null;
}

export interface BookingListItem {
  id: string;
  booking_id: string;
  client_name: string;
  client_email: string;
  client_picture?: string | null;
  artisan_name: string;
  artisan_picture?: string | null;
  service_name: string;
  category_name: string;
  status: BookingStatus;
  assignment_mode: AssignmentMode;
  scheduled_date: string;
  scheduled_time: string;
  total_amount: string | null;
  created_at: string;
}

export interface BookingListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BookingListItem[];
}

export interface BookingStatusHistoryItem {
  id: string;
  status: BookingStatus;
  changed_by: BookingPerson;
  note: string | null;
  timestamp: string;
}

export interface BookingChecklistItem {
  id: string;
  label: string;
  is_done: boolean;
  order: number;
  done_at: string | null;
  created_at: string;
}

export interface BookingAdditionalCost {
  id: string;
  reason: string;
  amount: string;
  status: AdditionalCostStatus;
  responded_at: string | null;
  created_at: string;
}

export interface BookingIssueReport {
  id: string;
  issue_type: string;
  urgency: string;
  description: string | null;
  attachment: string | null;
  is_resolved: boolean;
  resolved_at: string | null;
  reported_by: BookingPerson;
  created_at: string;
}

export interface BookingDetail {
  id: string;
  booking_id: string;
  client: BookingPerson;
  artisan: BookingPerson;
  service_name: string;
  assignment_mode: AssignmentMode;
  status: BookingStatus;
  scheduled_date: string;
  scheduled_time: string;
  full_address: string | null;
  address_lat: string | null;
  address_lng: string | null;
  additional_notes: string | null;
  image: {
    id: string;
    image: string;
    uploaded_at: string;
  } | null;
  base_price: string | null;
  total_amount: string | null;
  platform_fee: string | null;
  artisan_payout: string | null;
  completion_signature: string | null;
  requested_at: string | null;
  confirmed_at: string | null;
  on_way_at: string | null;
  arrived_at: string | null;
  working_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  status_history: BookingStatusHistoryItem[];
  checklist_items: BookingChecklistItem[];
  additional_costs: BookingAdditionalCost[];
  issue_reports: BookingIssueReport[];
  created_at: string;
  updated_at: string;
}

export interface BookingListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  date?: string;
  ordering?: string;
}

export const getBookings = async (params: BookingListParams): Promise<BookingListResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());
  if (params.search) query.append("search", params.search);
  if (params.status) query.append("status", params.status);
  if (params.date) query.append("date", params.date);
  if (params.ordering) query.append("ordering", params.ordering);

  const { accessToken } = loadStoredAuth();
  return apiFetch<BookingListResponse>(`/api/bookings/admin/?${query.toString()}`, {}, accessToken || undefined);
};

export const getBookingDetail = async (id: string): Promise<BookingDetail> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch<BookingDetail>(`/api/bookings/admin/${id}/`, {}, accessToken || undefined);
};

export interface IssueReportListItem {
  id: string;
  reported_by_name: string;
  reported_by_picture: string | null;
  reported_by_rating: string;
  service_name: string;
  booking_uuid: string;
  issue_type: string;
  urgency: string;
  description: string | null;
  attachment: string | null;
  is_resolved: boolean;
  created_at: string;
  resolved_at: string | null;
}

export interface IssueReportDetail {
  id: string;
  booking_uuid: string;
  booking_id: string;
  service_name: string;
  booking_date: string | null;
  booking_time: string | null;
  booking_address: {
    address_line: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    country: string | null;
    latitude: string | null;
    longitude: string | null;
  };
  client_name: string | null;
  client_picture: string | null;
  artisan: {
    id: string;
    name: string;
    profile_picture: string | null;
    is_active: boolean;
    avg_rating: string;
    completed_jobs: number;
  };
  issue_type: string;
  urgency: string;
  description: string | null;
  attachment: string | null;
  is_resolved: boolean;
  created_at: string;
  resolved_at: string | null;
}

export interface IssueReportListParams {
  page?: number;
  page_size?: number;
  search?: string;
  urgency?: string;
  is_resolved?: boolean;
  ordering?: string;
}

export interface IssueReportListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IssueReportListItem[];
}

export const getIssueReports = async (
  params: IssueReportListParams
): Promise<IssueReportListResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.page_size) query.append("page_size", params.page_size.toString());
  if (params.search) query.append("search", params.search);
  if (params.urgency) query.append("urgency", params.urgency);
  if (params.is_resolved !== undefined) query.append("is_resolved", params.is_resolved ? "true" : "false");
  if (params.ordering) query.append("ordering", params.ordering);

  const { accessToken } = loadStoredAuth();
  return apiFetch<IssueReportListResponse>(`/api/bookings/issues/admin/?${query.toString()}`, {}, accessToken || undefined);
};

export const getIssueReportDetail = async (id: string): Promise<IssueReportDetail> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch<IssueReportDetail>(`/api/bookings/issues/admin/${id}/`, {}, accessToken || undefined);
};

export const resolveIssueReport = async (
  bookingUuid: string,
  issueId: string
): Promise<IssueReportDetail> => {
  const { accessToken } = loadStoredAuth();
  return apiFetch<IssueReportDetail>(
    `/api/bookings/admin/${bookingUuid}/issues/${issueId}/resolve/`,
    { method: "POST" },
    accessToken || undefined
  );
};
