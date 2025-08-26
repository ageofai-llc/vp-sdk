import type {
  APIKeyCreate,
  APIKeyCreateResponse,
  APIKeyListResponse,
  APIKeyResponse,
  APIKeyRevoke,
  APIKeyUpdate,
  AvailableScopesResponse,
} from "../types";
import type { HttpClient } from "../utils/http";

export class APIKeysClient {
  constructor(private http: HttpClient) {}

  async getAvailableScopes(): Promise<AvailableScopesResponse> {
    return this.http.get<AvailableScopesResponse>("/auth/api-keys/scopes");
  }

  async createAPIKey(apiKeyData: APIKeyCreate): Promise<APIKeyCreateResponse> {
    return this.http.post<APIKeyCreateResponse>("/auth/api-keys/", apiKeyData);
  }

  async listAPIKeys(
    skip?: number,
    limit?: number,
  ): Promise<APIKeyListResponse> {
    return this.http.get<APIKeyListResponse>("/auth/api-keys/", {
      params: { skip, limit },
    });
  }

  async getAPIKey(keyId: string): Promise<APIKeyResponse> {
    return this.http.get<APIKeyResponse>(`/auth/api-keys/${keyId}`);
  }

  async updateAPIKey(
    keyId: string,
    updateData: APIKeyUpdate,
  ): Promise<APIKeyResponse> {
    return this.http.put<APIKeyResponse>(`/auth/api-keys/${keyId}`, updateData);
  }

  async deleteAPIKey(keyId: string): Promise<void> {
    await this.http.delete(`/auth/api-keys/${keyId}`);
  }

  async revokeAPIKey(keyId: string, revokeData: APIKeyRevoke): Promise<void> {
    await this.http.post(`/auth/api-keys/${keyId}/revoke`, revokeData);
  }
}
