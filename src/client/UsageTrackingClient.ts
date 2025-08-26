import type {
  AgentUsageRequest,
  EmbeddingUsageRequest,
  FunctionCallUsageRequest,
  RAGUsageRequest,
  STTUsageRequest,
  TTSUsageRequest,
} from "../types";
import type { HttpClient } from "../utils/http";

export class UsageTrackingClient {
  constructor(private http: HttpClient) {}

  async trackTTSUsage(usageRequest: TTSUsageRequest): Promise<void> {
    await this.http.post("/usage/track/tts", usageRequest);
  }

  async trackSTTUsage(usageRequest: STTUsageRequest): Promise<void> {
    await this.http.post("/usage/track/stt", usageRequest);
  }

  async trackAgentUsage(usageRequest: AgentUsageRequest): Promise<void> {
    await this.http.post("/usage/track/agent", usageRequest);
  }

  async trackEmbeddingUsage(
    usageRequest: EmbeddingUsageRequest,
  ): Promise<void> {
    await this.http.post("/usage/track/embeddings", usageRequest);
  }

  async trackRAGUsage(usageRequest: RAGUsageRequest): Promise<void> {
    await this.http.post("/usage/track/rag", usageRequest);
  }

  async trackFunctionCallUsage(
    usageRequest: FunctionCallUsageRequest,
  ): Promise<void> {
    await this.http.post("/usage/track/function-call", usageRequest);
  }

  async getDetailedUsageAnalysis(params?: {
    start_date?: string;
    end_date?: string;
    service_type?: string;
  }): Promise<any> {
    return this.http.get("/usage/analysis", { params });
  }

  async analyzeText(text: string): Promise<any> {
    return this.http.post("/usage/analyze-text", null, {
      params: { text },
    });
  }

  async getDetailedCostEstimate(
    serviceType: string,
    units: number,
    additionalParams?: Record<string, any>,
  ): Promise<any> {
    return this.http.post("/usage/estimate", additionalParams, {
      params: { service_type: serviceType, units },
    });
  }
}
