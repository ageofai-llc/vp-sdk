import type { VoicePublic } from "../types";
import type { HttpClient } from "../utils/http";

export class VoicesClient {
  constructor(private http: HttpClient) {}

  async listVoices(params?: {
    include_buffer?: boolean;
    premium_only?: boolean;
    language?: string;
    enabled_only?: boolean;
    demo_only?: boolean;
  }): Promise<VoicePublic[]> {
    return this.http.get<VoicePublic[]>("/voices/", { params });
  }

  async getAvailableLanguages(): Promise<any> {
    return this.http.get("/voices/languages");
  }

  async getVoice(
    voiceId: number,
    includeBuffer?: boolean,
  ): Promise<VoicePublic> {
    return this.http.get<VoicePublic>(`/voices/${voiceId}`, {
      params: { include_buffer: includeBuffer },
    });
  }

  async getVoicePreview(voiceId: number): Promise<any> {
    return this.http.get(`/voices/${voiceId}/preview`);
  }
}
