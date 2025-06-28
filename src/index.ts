import { HttpClient } from "./utils/http";
import { AuthClient } from "./client/AuthClient";
import { SessionClient } from "./client/SessionClient";
import { AgentClient } from "./client/AgentClient";
import { VoiceClient } from "./client/VoiceClient";
import { UserClient } from "./client/UserClient";
import { WebhookClient } from "./client/WebhookClient";
import { AdminClient } from "./client/AdminClient";
import { StreamClient } from "./client/StreamClient";
import { HealthClient } from "./client/HealthClient";
import { APIKeyClient } from "./client/APIKeyClient";

export interface ScoreexlVoiceSdkConfig {
  baseURL?: string;
  apiKey?: string;
  accessToken?: string;
}

export class ScoreexlVoiceSdk {
  private httpClient: HttpClient;
  public auth: AuthClient;
  public sessions: SessionClient;
  public agents: AgentClient;
  public voices: VoiceClient;
  public users: UserClient;
  public webhooks: WebhookClient;
  public admin: AdminClient;
  public stream: StreamClient;
  public health: HealthClient;
  public apiKey: APIKeyClient;

  constructor(config: ScoreexlVoiceSdkConfig = {}) {
    const DEFAULT_BASE_URL = "https://voiceagentv2.scoreexl.com";

    const baseURL = config.baseURL || DEFAULT_BASE_URL;
    const authToken = config.accessToken || config.apiKey;
    this.httpClient = new HttpClient(baseURL, authToken);

    this.auth = new AuthClient(this.httpClient);
    this.sessions = new SessionClient(this.httpClient);
    this.agents = new AgentClient(this.httpClient);
    this.voices = new VoiceClient(this.httpClient);
    this.users = new UserClient(this.httpClient);
    this.webhooks = new WebhookClient(this.httpClient);
    this.admin = new AdminClient(this.httpClient);
    this.stream = new StreamClient(this.httpClient);
    this.health = new HealthClient(this.httpClient);
    this.apiKey = new APIKeyClient(this.httpClient);
  }

  setAuthToken(token: string) {
    this.httpClient.setAuthToken(token);
  }
}
export * from "./types";
// export * from "./utils/errors";
