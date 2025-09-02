import axios from "./axios";
import { AgentsClient } from "./client/AgentsClient";
import { AnalyticsClient } from "./client/AnalyticsClient";
import { APIKeysClient } from "./client/APIKeysClient";
import { AuthClient } from "./client/AuthClient";
import { CreditsClient } from "./client/CreditsClient";
import { NotificationsClient } from "./client/NotificationsClient";
import { RAGClient } from "./client/RAGClient";
import { STTClient } from "./client/STTClient";
import { TTSClient } from "./client/TTSClient";
import { UsageTrackingClient } from "./client/UsageTrackingClient";
import { UsersClient } from "./client/UsersClient";
import { VoicesClient } from "./client/VoicesClient";
import type { SdkConfig } from "./types";
import { HttpClient } from "./utils/http";

export class VpSdk {
  private httpClient: HttpClient;
  public auth: AuthClient;
  public notifications: NotificationsClient;
  public agents: AgentsClient;
  public voices: VoicesClient;
  public users: UsersClient;
  public credits: CreditsClient;
  public analytics: AnalyticsClient;
  public stt: STTClient;
  public rag: RAGClient;
  public apiKey: APIKeysClient;
  public tts: TTSClient;
  public usageTracking: UsageTrackingClient;

  constructor(httpClient?: HttpClient, config?: SdkConfig) {
    this.httpClient = httpClient ?? new HttpClient(axios, config);

    this.auth = new AuthClient(this.httpClient);
    this.notifications = new NotificationsClient(this.httpClient);
    this.agents = new AgentsClient(this.httpClient);
    this.voices = new VoicesClient(this.httpClient);
    this.users = new UsersClient(this.httpClient);
    this.credits = new CreditsClient(this.httpClient);
    this.analytics = new AnalyticsClient(this.httpClient);
    this.stt = new STTClient(this.httpClient);
    this.rag = new RAGClient(this.httpClient);
    this.apiKey = new APIKeysClient(this.httpClient);
    this.tts = new TTSClient(this.httpClient);
    this.usageTracking = new UsageTrackingClient(this.httpClient);
  }

  setAuthToken(token: string) {
    this.httpClient.setAuthToken(token);
  }

  setAccessToken(token: string): void {
    this.httpClient.setAccessToken(token);
  }

  setRefreshToken(token: string): void {
    this.httpClient.setRefreshToken(token);
  }

  getRefreshToken(): void {
    this.httpClient.getRefreshToken();
  }

  getAccessToken(): void {
    this.httpClient.getAccessToken();
  }

  clearTokens(): void {
    this.httpClient.clearTokens();
  }
}
