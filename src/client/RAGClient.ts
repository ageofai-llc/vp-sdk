import FormData from "form-data";
import type {
  AgentRAGDocumentCreate,
  AgentRAGDocumentListResponse,
  AgentRAGDocumentResponse,
  AgentRAGDocumentUpdate,
  DocumentAgentListResponse,
  RAGDocumentListResponse,
  RAGDocumentResponse,
  RAGDocumentUpdate,
  RAGDocumentUploadResponse,
  RAGQueryCreate,
  RAGQueryListResponse,
  RAGQueryResult,
  RAGStats,
} from "../types";
import type { HttpClient } from "../utils/http";

export class RAGClient {
  constructor(private http: HttpClient) {}

  async uploadDocument(
    file: Buffer | Blob,
    name: string,
    description?: string,
  ): Promise<RAGDocumentUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    if (description) formData.append("description", description);

    return this.http.post<RAGDocumentUploadResponse>(
      "/rag/documents/upload",
      formData,
      {
        headers: formData.getHeaders(),
      },
    );
  }

  async getDocuments(
    skip?: number,
    limit?: number,
  ): Promise<RAGDocumentListResponse> {
    return this.http.get<RAGDocumentListResponse>("/rag/documents", {
      params: { skip, limit },
    });
  }

  async getDocument(documentId: string): Promise<RAGDocumentResponse> {
    return this.http.get<RAGDocumentResponse>(`/rag/documents/${documentId}`);
  }

  async updateDocument(
    documentId: string,
    updateData: RAGDocumentUpdate,
  ): Promise<RAGDocumentResponse> {
    return this.http.put<RAGDocumentResponse>(
      `/rag/documents/${documentId}`,
      updateData,
    );
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.http.delete(`/rag/documents/${documentId}`);
  }

  async getDocumentAgents(
    documentId: string,
  ): Promise<DocumentAgentListResponse> {
    return this.http.get<DocumentAgentListResponse>(
      `/rag/documents/${documentId}/agents`,
    );
  }

  async linkDocumentToAgent(
    agentId: string,
    linkData: AgentRAGDocumentCreate,
  ): Promise<AgentRAGDocumentResponse> {
    return this.http.post<AgentRAGDocumentResponse>(
      `/rag/agents/${agentId}/documents`,
      linkData,
    );
  }

  async getAgentDocuments(
    agentId: string,
  ): Promise<AgentRAGDocumentListResponse> {
    return this.http.get<AgentRAGDocumentListResponse>(
      `/rag/agents/${agentId}/documents`,
    );
  }

  async updateAgentDocument(
    agentId: string,
    linkId: string,
    updateData: AgentRAGDocumentUpdate,
  ): Promise<AgentRAGDocumentResponse> {
    return this.http.put<AgentRAGDocumentResponse>(
      `/rag/agents/${agentId}/documents/${linkId}`,
      updateData,
    );
  }

  async unlinkDocumentFromAgent(
    agentId: string,
    linkId: string,
  ): Promise<void> {
    await this.http.delete(`/rag/agents/${agentId}/documents/${linkId}`);
  }

  async queryAgentKnowledgeBase(
    agentId: string,
    queryData: RAGQueryCreate,
  ): Promise<RAGQueryResult> {
    return this.http.post<RAGQueryResult>(
      `/rag/agents/${agentId}/query`,
      queryData,
    );
  }

  async getAgentQueries(
    agentId: string,
    skip?: number,
    limit?: number,
  ): Promise<RAGQueryListResponse> {
    return this.http.get<RAGQueryListResponse>(
      `/rag/agents/${agentId}/queries`,
      {
        params: { skip, limit },
      },
    );
  }

  async getUserQueries(
    skip?: number,
    limit?: number,
  ): Promise<RAGQueryListResponse> {
    return this.http.get<RAGQueryListResponse>("/rag/queries", {
      params: { skip, limit },
    });
  }

  async getAgentRAGStats(agentId: string): Promise<any> {
    return this.http.get(`/rag/agents/${agentId}/stats`);
  }

  async queryUserDocuments(queryData: RAGQueryCreate): Promise<RAGQueryResult> {
    return this.http.post<RAGQueryResult>("/rag/query", queryData);
  }

  async getRAGStats(): Promise<RAGStats> {
    return this.http.get<RAGStats>("/rag/stats");
  }
}
