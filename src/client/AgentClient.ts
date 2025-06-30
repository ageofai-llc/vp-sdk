import type { HttpClient } from "../utils/http";
import type {
  AgentCreate,
  AgentOut,
  AgentAnalyticsOut,
  AgentTemplateCreate,
  AgentTemplateOut,
  AgentVersionCreate,
  AgentVersionOut,
} from "../types";

export class AgentClient {
  constructor(private http: HttpClient) {}

  async createAgent(agent: AgentCreate): Promise<AgentOut> {
    return this.http.request<AgentOut>({
      method: "POST",
      url: "/agents",
      data: agent,
    });
  }

  async listAgents(
    options: {
      includePublic?: boolean;
      category?: string;
      search?: string;
    } = {},
  ): Promise<AgentOut[]> {
    return this.http.request<AgentOut[]>({
      method: "GET",
      url: "/agents",
      params: {
        include_public: options.includePublic,
        category: options.category,
        search: options.search,
      },
    });
  }

  async getAgent(agentId: number): Promise<AgentOut> {
    return this.http.request<AgentOut>({
      method: "GET",
      url: `/agents/${agentId}`,
    });
  }

  async updateAgent(agentId: number, agent: AgentCreate): Promise<AgentOut> {
    return this.http.request<AgentOut>({
      method: "PUT",
      url: `/agents/${agentId}`,
      data: agent,
    });
  }

  async deleteAgent(agentId: number): Promise<void> {
    return this.http.request<void>({
      method: "DELETE",
      url: `/agents/${agentId}`,
    });
  }

  async getAgentAnalytics(agentId: number): Promise<AgentAnalyticsOut> {
    return this.http.request<AgentAnalyticsOut>({
      method: "GET",
      url: `/agents/${agentId}/analytics`,
    });
  }

  async toggleAgentSharing(agentId: number, isPublic: boolean): Promise<void> {
    return this.http.request<void>({
      method: "PUT",
      url: `/agents/${agentId}/share`,
      params: { is_public: isPublic },
    });
  }

  async createAgentTemplate(
    template: AgentTemplateCreate,
  ): Promise<AgentTemplateOut> {
    return this.http.request<AgentTemplateOut>({
      method: "POST",
      url: "/agent-templates",
      data: template,
    });
  }

  async listAgentTemplates(
    options: { category?: string; publicOnly?: boolean } = {},
  ): Promise<AgentTemplateOut[]> {
    return this.http.request<AgentTemplateOut[]>({
      method: "GET",
      url: "/agent-templates",
      params: {
        category: options.category,
        public_only: options.publicOnly,
      },
    });
  }

  async createAgentFromTemplate(
    templateId: number,
    agentName: string,
  ): Promise<AgentOut> {
    return this.http.request<AgentOut>({
      method: "POST",
      url: `/agents/from-template/${templateId}`,
      params: { agent_name: agentName },
    });
  }

  async createAgentVersion(
    agentId: number,
    version: AgentVersionCreate,
  ): Promise<AgentVersionOut> {
    return this.http.request<AgentVersionOut>({
      method: "POST",
      url: `/agents/${agentId}/versions`,
      data: version,
    });
  }

  async listAgentVersions(agentId: number): Promise<AgentVersionOut[]> {
    return this.http.request<AgentVersionOut[]>({
      method: "GET",
      url: `/agents/${agentId}/versions`,
    });
  }

  async cloneAgent(agentId: number, newName: string): Promise<AgentOut> {
    return this.http.request<AgentOut>({
      method: "POST",
      url: `/agents/${agentId}/clone`,
      params: { new_name: newName },
    });
  }

  async activateAgentVersion(
    agentId: number,
    versionId: number,
  ): Promise<void> {
    return this.http.request<void>({
      method: "PUT",
      url: `/agents/${agentId}/versions/${versionId}/activate`,
    });
  }

  async browseAgentMarketplace(
    options: {
      category?: string;
      search?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<any> {
    return this.http.request<any>({
      method: "GET",
      url: "/agents/marketplace",
      params: options,
    });
  }

  async createSampleTemplates(): Promise<void> {
    return this.http.request<void>({
      method: "POST",
      url: "/agent-templates/samples",
    });
  }
}
