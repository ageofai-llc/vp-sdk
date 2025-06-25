import { HttpClient } from "../utils/http";

export class AdminClient {
  constructor(private http: HttpClient) {}

  async getMetrics(): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: "/metrics",
    });
  }

  async listUsers(): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: "/admin/users",
    });
  }

  async listAgents(): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: "/admin/agents",
    });
  }

  async listSessions(): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: "/admin/sessions",
    });
  }

  async getUsage(): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: "/admin/usage",
    });
  }
}
