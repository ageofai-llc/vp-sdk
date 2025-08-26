import type { UserResponse, UserUpdate } from "../types";
import type { HttpClient } from "../utils/http";

export class UsersClient {
  constructor(private http: HttpClient) {}

  async getMyProfile(): Promise<UserResponse> {
    return this.http.get<UserResponse>("/users/me");
  }

  async updateMyProfile(userData: UserUpdate): Promise<UserResponse> {
    return this.http.put<UserResponse>("/users/me", userData);
  }

  async deleteMyAccount(): Promise<void> {
    await this.http.delete("/users/me");
    this.http.clearTokens();
  }
}
