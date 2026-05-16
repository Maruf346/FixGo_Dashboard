import { apiFetch } from "./api";

export interface Notification {
  id: string;
  notification_type: string;
  title: string;
  body: string;
  data?: string;
  priority: "low" | "medium" | "high";
  is_read: boolean;
  read_at?: string;
  websocket_pushed: boolean;
  websocket_success: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Notification[];
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkAllReadResponse {
  count: number;
}

export interface ClearReadResponse {
  deleted_count: number;
}

const NOTIFICATION_POLL_INTERVAL = 30000; // 30 seconds fallback polling

export class NotificationManager {
  private ws: WebSocket | null = null;
  private token: string;
  private pollInterval: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private wsUrl: string;

  constructor(token: string) {
    this.token = token;
    this.wsUrl = this.buildWsUrl();
  }

  private buildWsUrl(): string {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = "10.10.20.45"; // Replace with your backend host
    return `${protocol}//${host}/ws/notifications/?token=${this.token}`;
  }

  private emit(event: string, data: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in listener for event ${event}:`, error);
        }
      });
    }
  }

  public on(event: string, listener: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    return () => {
      this.listeners.get(event)!.delete(listener);
    };
  }

  private startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      this.fetchNotifications();
    }, NOTIFICATION_POLL_INTERVAL);
  }

  private stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  public connectWebSocket() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
        this.stopPolling();
        this.emit("connected", true);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "notification") {
            // Backend may send the notification payload either as `data.notification`
            // or flattened at the top level. Emit the inner object if present,
            // otherwise emit the whole message so listeners can handle both.
            const payload = data.notification ?? data;
            this.emit("notification", payload);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.emit("error", error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected, falling back to polling");
        this.ws = null;
        this.emit("disconnected", true);
        this.startPolling();
        this.attemptReconnect();
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.startPolling();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting WebSocket reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      setTimeout(() => {
        this.connectWebSocket();
      }, delay);
    }
  }

  public disconnect() {
    this.stopPolling();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public async fetchNotifications(
    params?: {
      is_read?: boolean;
      notification_type?: string;
      ordering?: string;
      page?: number;
      page_size?: number;
      priority?: string;
      search?: string;
    }
  ): Promise<NotificationListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const query = queryParams.toString();
    const path = `/api/notification/admin/${query ? `?${query}` : ""}`;
    return apiFetch<NotificationListResponse>(path, {}, this.token);
  }

  public async getUnreadCount(): Promise<UnreadCountResponse> {
    return apiFetch<UnreadCountResponse>("/api/notification/admin/unread-count/", {}, this.token);
  }

  public async markAllRead(): Promise<MarkAllReadResponse> {
    return apiFetch<MarkAllReadResponse>(
      "/api/notification/admin/mark-all-read/",
      { method: "POST" },
      this.token
    );
  }

  public async clearReadNotifications(): Promise<ClearReadResponse> {
    return apiFetch<ClearReadResponse>(
      "/api/notification/admin/clear-read/",
      { method: "DELETE" },
      this.token
    );
  }

  public async markNotificationRead(id: string): Promise<Notification> {
    return apiFetch<Notification>(
      `/api/notification/admin/${id}/mark-read/`,
      { method: "POST" },
      this.token
    );
  }
}

let notificationManager: NotificationManager | null = null;

export function initializeNotifications(token: string): NotificationManager {
  if (notificationManager) {
    notificationManager.disconnect();
  }
  notificationManager = new NotificationManager(token);
  notificationManager.connectWebSocket();
  return notificationManager;
}

export function getNotificationManager(): NotificationManager | null {
  return notificationManager;
}

export function disconnectNotifications() {
  if (notificationManager) {
    notificationManager.disconnect();
    notificationManager = null;
  }
}
