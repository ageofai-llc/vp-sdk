import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type { SdkConfig } from "../types";
import {
  AuthenticationError,
  ScoreexlVoiceError,
  ValidationError,
} from "./errors";

export class HttpClient {
  private client: AxiosInstance;
  private accessToken?: string;
  private refreshToken?: string;
  private refreshEndpoint: string = "/auth/refresh";

  constructor(
    axios: AxiosInstance,
    config: SdkConfig = {
      baseURL: "https://voiceagentv3.scoreexl.com",
    },
  ) {
    this.client = axios;

    if (config.baseURL) {
      this.client.defaults.baseURL = config.baseURL;
    }

    if (config.accessToken) {
      this.setAuthToken(config.accessToken);
    }

    if (config.refreshToken) {
      this.setRefreshToken(config.refreshToken);
    }

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Attach access token to requests
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers = config.headers ?? {};
        config.headers["Authorization"] = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Refresh token on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as {
          _retry?: boolean;
        } & AxiosRequestConfig;

        if (
          error.response?.status === 401 &&
          this.refreshToken &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const { data } = await this.client.post(this.refreshEndpoint, {
              refreshToken: this.refreshToken,
            });

            this.setAuthToken(data.accessToken);
            this.setRefreshToken(data.refreshToken);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers["Authorization"] =
              `Bearer ${data.accessToken}`;

            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            throw new AuthenticationError(
              refreshError instanceof Error
                ? refreshError.message
                : String(refreshError),
            );
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 422) {
          const detail =
            typeof data?.detail === "string" ? data.detail : "Validation error";
          throw new ValidationError(detail);
        }

        throw new ScoreexlVoiceError(
          typeof (data as any)?.message === "string"
            ? (data as any).message
            : `Request failed with status ${status}`,
          status,
          typeof (data as any)?.code === "string"
            ? (data as any).code
            : "UNKNOWN",
          data,
        );
      }

      throw new ScoreexlVoiceError(
        "Network error occurred",
        500,
        "NETWORK_ERROR",
      );
    }
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: "GET", url, ...config });
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: "POST", url, data, ...config });
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: "PUT", url, data, ...config });
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: "DELETE", url, ...config });
  }

  setAuthToken(token: string) {
    this.accessToken = token;
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  setRefreshToken(token: string) {
    this.refreshToken = token;
  }

  setBaseURL(url: string) {
    this.client.defaults.baseURL = url;
  }

  clearTokens(): void {
    this.accessToken = undefined;
    this.refreshToken = undefined;
    delete this.client.defaults.headers.common["Authorization"];
  }
}
