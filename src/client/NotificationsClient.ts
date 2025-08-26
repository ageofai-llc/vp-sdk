import type { NotificationResponse } from "../types";
import type { HttpClient } from "../utils/http";

export class NotificationsClient {
  constructor(private http: HttpClient) {}

  async getNotifications(params?: {
    skip?: number;
    limit?: number;
    unread_only?: boolean;
  }): Promise<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>("/notifications/", { params });
  }

  async getUnreadCount(): Promise<any> {
    return this.http.get("/notifications/unread-count");
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.http.post(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await this.http.post("/notifications/mark-all-read");
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.http.delete(`/notifications/${notificationId}`);
  }

  async clearAllNotifications(): Promise<void> {
    await this.http.delete("/notifications/clear-all");
  }
}
