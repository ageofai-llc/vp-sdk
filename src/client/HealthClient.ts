import { HttpClient } from "../utils/http";
import { HealthResponse } from "../types";

export class HealthClient {
  constructor(private client: HttpClient) {}

  async checkHealth(): Promise<HealthResponse> {
    return this.client.request<HealthResponse>({
      method: "GET",
      url: "/health",
    });
  }
}
