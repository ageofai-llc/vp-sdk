import { HttpClient } from "../utils/http";
import { WebhookCreate, WebhookOut } from "../types";

export class WebhookClient {
  constructor(private http: HttpClient) {}

  async listWebhooks(): Promise<WebhookOut[]> {
    return this.http.request<WebhookOut[]>({
      method: "GET",
      url: "/webhooks",
    });
  }

  async createWebhook(webhook: WebhookCreate): Promise<WebhookOut> {
    return this.http.request<WebhookOut>({
      method: "POST",
      url: "/webhooks",
      data: webhook,
    });
  }

  async getWebhook(webhookId: number): Promise<WebhookOut> {
    return this.http.request<WebhookOut>({
      method: "GET",
      url: `/webhooks/${webhookId}`,
    });
  }

  async updateWebhook(
    webhookId: number,
    webhook: WebhookCreate
  ): Promise<WebhookOut> {
    return this.http.request<WebhookOut>({
      method: "PUT",
      url: `/webhooks/${webhookId}`,
      data: webhook,
    });
  }

  async deleteWebhook(webhookId: number): Promise<void> {
    return this.http.request<void>({
      method: "DELETE",
      url: `/webhooks/${webhookId}`,
    });
  }

  async toggleWebhook(webhookId: number): Promise<void> {
    return this.http.request<void>({
      method: "PUT",
      url: `/webhooks/${webhookId}/toggle`,
    });
  }

  async testWebhook(webhookId: number): Promise<void> {
    return this.http.request<void>({
      method: "POST",
      url: `/webhooks/${webhookId}/test`,
    });
  }

  async listWebhookEvents(): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: "/webhooks/events",
    });
  }
}
