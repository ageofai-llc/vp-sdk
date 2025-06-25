import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  AuthenticationError,
  ScoreexlVoiceError,
  ValidationError,
} from "./errors";

export class HttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string, private authToken?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        console.error("Response Error:", data);

        if (status === 422) throw new ValidationError(data.detail);
        if (status === 401) throw new AuthenticationError();

        throw new ScoreexlVoiceError(
          status,
          typeof data.code === "string" ? data.code : "UNKNOWN",
          typeof data.message === "string" ? data.message : "Request failed"
        );
      }

      throw new ScoreexlVoiceError(
        500,
        "NETWORK_ERROR",
        "Network error occurred"
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
    this.authToken = token;
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  setBaseURL(url: string) {
    this.client.defaults.baseURL = url;
  }
}
