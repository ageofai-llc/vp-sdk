import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type { ScoreexlVoiceSdkConfig } from "../types";
import {
  AuthenticationError,
  ScoreexlVoiceError,
  ValidationError,
} from "./errors";

export class HttpClient {
  private client: AxiosInstance;

  constructor(axios: AxiosInstance, config: ScoreexlVoiceSdkConfig = {}) {
    this.client = axios;

    if (config.baseURL) {
      this.client.defaults.baseURL = config.baseURL;
    }

    if (config.accessToken) {
      this.setAuthToken(config.accessToken);
    }
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 422) throw new ValidationError(data.detail);
        if (status === 401) throw new AuthenticationError();

        throw new ScoreexlVoiceError(
          status,
          typeof data.code === "string" ? data.code : "UNKNOWN",
          typeof data.message === "string"
            ? data.message
            : `Request failed with status ${status}`,
        );
      }

      throw new ScoreexlVoiceError(
        500,
        "NETWORK_ERROR",
        "Network error occurred",
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
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  setBaseURL(url: string) {
    this.client.defaults.baseURL = url;
  }
}
