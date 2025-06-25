import { HttpClient } from "../utils/http";

export class VoiceClient {
  constructor(private http: HttpClient) {}

  async listVoices(): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: "/voices",
    });
  }

  async cloneVoice(audio: Buffer): Promise<any> {
    return this.http.request<any>({
      method: "POST",
      url: "/voices/clone",
      data: audio,
      headers: { "Content-Type": "application/octet-stream" },
    });
  }

  async getVoice(voiceId: string): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: `/voices/${voiceId}`,
    });
  }

  async deleteVoice(voiceId: string): Promise<void> {
    return this.http.request<void>({
      method: "DELETE",
      url: `/voices/${voiceId}`,
    });
  }
}
