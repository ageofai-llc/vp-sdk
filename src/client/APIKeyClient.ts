import type { HttpClient } from "../utils/http";
import type { APIKeyCreate, APIKeyOut } from "../types";

export class APIKeyClient {
  constructor(private http: HttpClient) {}

  async listAPIKeys(): Promise<APIKeyOut[]> {
    return this.http.request<APIKeyOut[]>({
      method: "GET",
      url: "/api-keys",
    });
  }

  async createAPIKey(apiKey: APIKeyCreate): Promise<APIKeyOut> {
    return this.http.request<APIKeyOut>({
      method: "POST",
      url: "/api-keys",
      data: apiKey,
    });
  }

  async deleteAPIKey(keyId: number): Promise<void> {
    return this.http.request<void>({
      method: "DELETE",
      url: `/api-keys/${keyId}`,
    });
  }
}
