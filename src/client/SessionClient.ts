import type { HttpClient } from "../utils/http";
import type { SessionOut, TextMessage, AgentResponse, AgentControl } from "../types";

export class SessionClient {
  constructor(private http: HttpClient) {}

  async startSession(agentId: number): Promise<SessionOut> {
    return this.http.request<SessionOut>({
      method: "POST",
      url: `/sessions/${agentId}`,
    });
  }

  async listSessions(): Promise<SessionOut[]> {
    return this.http.request<SessionOut[]>({
      method: "GET",
      url: "/sessions",
    });
  }

  async getSession(sessionId: number): Promise<SessionOut> {
    return this.http.request<SessionOut>({
      method: "GET",
      url: `/sessions/${sessionId}`,
    });
  }

  async endSession(sessionId: number): Promise<void> {
    return this.http.request<void>({
      method: "POST",
      url: `/sessions/${sessionId}/end`,
    });
  }

  async sendMessage(
    sessionId: number,
    message: TextMessage,
  ): Promise<AgentResponse> {
    return this.http.request<AgentResponse>({
      method: "POST",
      url: `/sessions/${sessionId}/message`,
      data: message,
    });
  }

  async controlAgent(sessionId: number, control: AgentControl): Promise<void> {
    return this.http.request<void>({
      method: "POST",
      url: `/sessions/${sessionId}/agent/control`,
      data: control,
    });
  }

  async getConversationHistory(
    sessionId: number,
    options: { limit?: number; offset?: number } = {},
  ): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: `/sessions/${sessionId}/conversation`,
      params: options,
    });
  }

  async addConversationLog(
    sessionId: number,
    logEntry: Record<string, any>,
  ): Promise<void> {
    return this.http.request<void>({
      method: "POST",
      url: `/sessions/${sessionId}/logs`,
      data: logEntry,
    });
  }

  async getConversationLogs(sessionId: number): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: `/sessions/${sessionId}/logs`,
    });
  }

  async updateAgentPrompt(
    sessionId: number,
    prompt: Record<string, any>,
  ): Promise<void> {
    return this.http.request<void>({
      method: "POST",
      url: `/sessions/${sessionId}/agent/prompt`,
      data: prompt,
    });
  }

  async getSessionStatus(sessionId: number): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: `/sessions/${sessionId}/status`,
    });
  }
}
