import type {
  AgentCreate,
  AgentListResponse,
  AgentRAGDocumentCreate,
  AgentRAGDocumentListResponse,
  AgentRAGDocumentResponse,
  AgentRAGDocumentUpdate,
  AgentResponse,
  AgentStats,
  AgentUpdate,
  ExternalAPIRequest,
  FunctionCallRequest,
  FunctionCallResponse,
  RAGQueryCreate,
  RAGQueryListResponse,
  RAGQueryResult,
  VoiceListResponse,
  WebhookCreate,
  WebhookResponse,
  WebhookUpdate,
} from "../types";
import type { HttpClient } from "../utils/http";

export class AgentsClient {
  constructor(private http: HttpClient) {}

  async createAgent(agentData: AgentCreate): Promise<AgentResponse> {
    return this.http.post<AgentResponse>("/agents/", agentData);
  }

  async getAgents(params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Promise<AgentListResponse> {
    return this.http.get<AgentListResponse>("/agents/", { params });
  }

  async getPublicAgents(params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Promise<AgentListResponse> {
    return this.http.get<AgentListResponse>("/agents/public", { params });
  }

  async getAvailableVoices(): Promise<VoiceListResponse> {
    return this.http.get<VoiceListResponse>("/agents/voices");
  }

  async getAgent(agentId: string): Promise<AgentResponse> {
    return this.http.get<AgentResponse>(`/agents/${agentId}`);
  }

  async updateAgent(
    agentId: string,
    updateData: AgentUpdate,
  ): Promise<AgentResponse> {
    return this.http.put<AgentResponse>(`/agents/${agentId}`, updateData);
  }

  async deleteAgent(agentId: string): Promise<void> {
    await this.http.delete(`/agents/${agentId}`);
  }

  async getAgentStats(agentId: string): Promise<AgentStats> {
    return this.http.get<AgentStats>(`/agents/${agentId}/stats`);
  }

  async createWebhook(
    agentId: string,
    webhookData: WebhookCreate,
  ): Promise<WebhookResponse> {
    return this.http.post<WebhookResponse>(
      `/agents/${agentId}/webhooks`,
      webhookData,
    );
  }

  async getAgentWebhooks(agentId: string): Promise<WebhookResponse[]> {
    return this.http.get<WebhookResponse[]>(`/agents/${agentId}/webhooks`);
  }

  async updateWebhook(
    webhookId: string,
    updateData: WebhookUpdate,
  ): Promise<WebhookResponse> {
    return this.http.put<WebhookResponse>(
      `/agents/webhooks/${webhookId}`,
      updateData,
    );
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    await this.http.delete(`/agents/webhooks/${webhookId}`);
  }

  async getAgentDocuments(
    agentId: string,
  ): Promise<AgentRAGDocumentListResponse> {
    return this.http.get<AgentRAGDocumentListResponse>(
      `/agents/${agentId}/documents`,
    );
  }

  async linkDocumentToAgent(
    agentId: string,
    linkData: AgentRAGDocumentCreate,
  ): Promise<AgentRAGDocumentResponse> {
    return this.http.post<AgentRAGDocumentResponse>(
      `/agents/${agentId}/documents`,
      linkData,
    );
  }

  async updateAgentDocument(
    agentId: string,
    linkId: string,
    updateData: AgentRAGDocumentUpdate,
  ): Promise<AgentRAGDocumentResponse> {
    return this.http.put<AgentRAGDocumentResponse>(
      `/agents/${agentId}/documents/${linkId}`,
      updateData,
    );
  }

  async unlinkDocumentFromAgent(
    agentId: string,
    linkId: string,
  ): Promise<void> {
    await this.http.delete(`/agents/${agentId}/documents/${linkId}`);
  }

  async queryAgentKnowledgeBase(
    agentId: string,
    queryData: RAGQueryCreate,
  ): Promise<RAGQueryResult> {
    return this.http.post<RAGQueryResult>(
      `/agents/${agentId}/query`,
      queryData,
    );
  }

  async getAgentQueries(
    agentId: string,
    skip?: number,
    limit?: number,
  ): Promise<RAGQueryListResponse> {
    return this.http.get<RAGQueryListResponse>(`/agents/${agentId}/queries`, {
      params: { skip, limit },
    });
  }

  async getAgentRAGStats(agentId: string): Promise<any> {
    return this.http.get(`/agents/${agentId}/rag-stats`);
  }

  async getAgentClient(): Promise<any> {
    return this.http.get("/agents/client");
  }

  async startAgentSession(payload: any): Promise<any> {
    return this.http.post("/agents/api/start", payload);
  }

  async handleAgentWebRTCOffer(payload: any): Promise<any> {
    return this.http.post("/agents/api/offer", payload);
  }

  async makeFunctionCall(
    agentId: string,
    functionCallData: FunctionCallRequest,
  ): Promise<FunctionCallResponse> {
    return this.http.post<FunctionCallResponse>(
      `/agents/${agentId}/function-calls`,
      functionCallData,
    );
  }

  async getFunctionCalls(
    agentId: string,
    params?: {
      skip?: number;
      limit?: number;
      status?: string;
      function_name?: string;
    },
  ): Promise<any> {
    return this.http.get(`/agents/${agentId}/function-calls`, { params });
  }

  async makeExternalRequest(
    agentId: string,
    requestData: ExternalAPIRequest,
  ): Promise<FunctionCallResponse> {
    return this.http.post<FunctionCallResponse>(
      `/agents/${agentId}/external-requests`,
      requestData,
    );
  }

  async getAvailableFunctions(): Promise<any> {
    return this.http.get("/agents/function-calls/available");
  }

  async getAgentAvailableFunctions(agentId: string): Promise<any> {
    return this.http.get(`/agents/${agentId}/available-functions`);
  }
}
