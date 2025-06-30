import type {
  Body_login_for_access_token_token_post,
  UserCreate,
  UserOut,
} from "../types";
import type { HttpClient } from "../utils/http";

type AuthOptions = Partial<
  Omit<Body_login_for_access_token_token_post, "username" | "password">
>;

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export class AuthClient {
  constructor(private http: HttpClient) {}

  async register(user: UserCreate): Promise<UserOut> {
    return this.http.request<UserOut>({
      method: "POST",
      url: "/register",
      data: user,
    });
  }

  async login(
    username: string,
    password: string,
    options: AuthOptions = {},
  ): Promise<LoginResponse> {
    const payload: Record<string, string> = {
      username,
      password,
      grant_type: options.grant_type ?? "password",
      scope: options.scope ?? "",
    };

    if (options.client_id) payload.client_id = options.client_id;
    if (options.client_secret) payload.client_secret = options.client_secret;

    const response = await this.http.request<LoginResponse>({
      method: "POST",
      url: "/token",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams(payload),
    });

    this.http.setAuthToken(response.access_token);
    return response;
  }
}
