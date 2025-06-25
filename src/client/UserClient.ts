import { HttpClient } from "../utils/http";
import { UserOut } from "../types";

export class UserClient {
  constructor(private http: HttpClient) {}

  async getCurrentUser(): Promise<UserOut> {
    return this.http.request<UserOut>({
      method: "GET",
      url: "/users/me",
    });
  }

  async updateCurrentUser(
    options: { username?: string; email?: string } = {}
  ): Promise<UserOut> {
    return this.http.request<UserOut>({
      method: "PUT",
      url: "/users/me",
      params: options,
    });
  }
}
