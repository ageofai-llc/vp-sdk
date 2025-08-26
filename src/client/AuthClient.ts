import type {
  Token,
  TokenRefresh,
  UserCreate,
  UserLogin,
  UserResponse,
} from "../types";
import { AuthenticationError } from "../utils/errors";
import type { HttpClient } from "../utils/http";

export class AuthClient {
  constructor(private http: HttpClient) {}

  async register(userData: UserCreate): Promise<UserResponse> {
    return this.http.request<UserResponse>({
      method: "POST",
      url: "/auth/register",
      data: userData,
    });
  }

  async login(credentials: UserLogin): Promise<Token> {
    const token = await this.http.request<Token>({
      method: "POST",
      url: "/auth/login",
      data: credentials,
    });

    this.http.setAuthToken(token.access_token);
    this.http.setRefreshToken(token.refresh_token);

    return token;
  }

  async refreshToken(refreshTokenData?: TokenRefresh): Promise<Token> {
    const data = refreshTokenData || { refresh_token: this.refreshToken };

    if (!data.refresh_token) {
      throw new AuthenticationError("Refresh token is required");
    }

    const token = await this.http.request<Token>({
      method: "POST",
      url: "/auth/refresh",
      data,
    });

    this.http.setAuthToken(token.access_token);
    this.http.setRefreshToken(token.refresh_token);

    return token;
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.http.request<UserResponse>({
      method: "GET",
      url: "/auth/me",
    });
  }

  async logout(): Promise<void> {
    await this.http.request({
      method: "POST",
      url: "/auth/logout",
    });

    this.http.clearTokens();
  }
}
