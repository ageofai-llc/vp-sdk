import type { UserOut } from "../types";
import type { HttpClient } from "../utils/http";

export class UserClient {
  constructor(private http: HttpClient) {}

  async getCurrentUser(): Promise<UserOut> {
    return this.http.request<UserOut>({
      method: "GET",
      url: "/users/me",
    });
  }

  async updateCurrentUser(
    options: { username?: string; email?: string } = {},
  ): Promise<UserOut> {
    return this.http.request<UserOut>({
      method: "PUT",
      url: "/users/me",
      params: options,
    });
  }
}
