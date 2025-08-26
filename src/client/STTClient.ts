import FormData from "form-data";
import type {
  TranscriptionListResponse,
  TranscriptionResponse,
  TranscriptionStatusResponse,
} from "../types";
import type { HttpClient } from "../utils/http";

export class STTClient {
  constructor(private http: HttpClient) {}
  async transcribeAudio(
    file: Buffer | Blob,
    providerPreference?: string,
    language?: string,
    modelSize?: string,
  ): Promise<TranscriptionResponse> {
    const formData = new FormData();
    formData.append("file", file);

    if (providerPreference)
      formData.append("provider_preference", providerPreference);
    if (language) formData.append("language", language);
    if (modelSize) formData.append("model_size", modelSize);

    return this.http.post<TranscriptionResponse>("/stt/transcribe", formData, {
      headers: formData.getHeaders(),
    });
  }

  async getTranscriptions(
    skip?: number,
    limit?: number,
    status?: string,
  ): Promise<TranscriptionListResponse> {
    return this.http.get<TranscriptionListResponse>("/stt/transcriptions", {
      params: { skip, limit, status },
    });
  }

  async getTranscription(
    transcriptionId: number,
  ): Promise<TranscriptionResponse> {
    return this.http.get<TranscriptionResponse>(
      `/stt/transcriptions/${transcriptionId}`,
    );
  }

  async deleteTranscription(transcriptionId: number): Promise<void> {
    await this.http.delete(`/stt/transcriptions/${transcriptionId}`);
  }

  async getTranscriptionStatus(
    transcriptionId: number,
  ): Promise<TranscriptionStatusResponse> {
    return this.http.get<TranscriptionStatusResponse>(
      `/stt/transcriptions/${transcriptionId}/status`,
    );
  }

  async getTranscriptionStats(): Promise<any> {
    return this.http.get("/stt/stats");
  }
}
