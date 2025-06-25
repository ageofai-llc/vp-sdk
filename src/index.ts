import { HttpClient } from "./utils/http";
import { AuthClient } from "./clients/AuthClient";
import { SessionClient } from "./clients/SessionClient";
import { AgentClient } from "./clients/AgentClient";
import { VoiceClient } from "./clients/VoiceClient";
import { UserClient } from "./clients/UserClient";
import { WebhookClient } from "./clients/WebhookClient";
import { AdminClient } from "./clients/AdminClient";
import { StreamClient } from "./clients/StreamClient";

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
  }

  setAuthToken(token: string) {
    this.httpClient.setAuthToken(token);
  }
}
export * from "./types";
// export * from "./utils/errors";
