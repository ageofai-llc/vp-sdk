import type {
  SynthesisListResponse,
  SynthesisRequest,
  SynthesisResponse,
  SynthesisStatsResponse,
} from "../types";
import type { HttpClient } from "../utils/http";

export class TTSClient {
  constructor(private http: HttpClient) {}

  async synthesizeText(
    synthesisRequest: SynthesisRequest,
  ): Promise<SynthesisResponse> {
    return this.http.post<SynthesisResponse>(
      "/tts/synthesize",
      synthesisRequest,
    );
  }

  async getSyntheses(
    skip?: number,
    limit?: number,
  ): Promise<SynthesisListResponse> {
    return this.http.get<SynthesisListResponse>("/tts/syntheses", {
      params: { skip, limit },
    });
  }

  async getSynthesis(synthesisId: number): Promise<SynthesisResponse> {
    return this.http.get<SynthesisResponse>(`/tts/syntheses/${synthesisId}`);
  }

  async deleteSynthesis(synthesisId: number): Promise<void> {
    await this.http.delete(`/tts/syntheses/${synthesisId}`);
  }

  async downloadSynthesis(synthesisId: number): Promise<any> {
    return this.http.get(`/tts/syntheses/${synthesisId}/download`);
  }

  async getSynthesisStats(): Promise<SynthesisStatsResponse> {
    return this.http.get<SynthesisStatsResponse>("/tts/stats");
  }
}
