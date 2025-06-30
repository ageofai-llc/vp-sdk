import {
  createTestContext,
  mockAgent,
  setupAuthenticatedClient,
  type TestContext,
} from "../../setup/test-utils";

describe("AgentClient", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = createTestContext();
    await setupAuthenticatedClient(context.client, context.mock);
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("createAgent", () => {
    it("should create an agent successfully", async () => {
      context.mock.onPost("/agents").reply(200, mockAgent);

      const agent = await context.client.agents.createAgent({
        name: "Test Agent",
        initial_prompt: "You are a helpful assistant",
      });
      expect(agent).toEqual(mockAgent);
    });

    it("should handle agent creation failure", async () => {
      context.mock
        .onPost("/agents")
        .reply(400, { message: "Invalid agent data" });

      await expect(
        context.client.agents.createAgent({
          name: "",
          initial_prompt: "You are a helpful assistant",
        }),
      ).rejects.toThrow();
    });
  });

  describe("listAgents", () => {
    it("should list agents successfully", async () => {
      const mockAgents = [
        { id: 1, name: "Agent 1" },
        { id: 2, name: "Agent 2" },
      ];
      context.mock.onGet("/agents").reply(200, mockAgents);

      const agents = await context.client.agents.listAgents({
        includePublic: true,
      });
      expect(agents).toEqual(mockAgents);
    });

    it("should handle empty agent list", async () => {
      context.mock.onGet("/agents").reply(200, []);

      const agents = await context.client.agents.listAgents({
        includePublic: false,
      });
      expect(agents).toEqual([]);
    });
  });

  describe("getAgent", () => {
    it("should get an agent successfully", async () => {
      context.mock.onGet("/agents/1").reply(200, mockAgent);

      const agent = await context.client.agents.getAgent(1);
      expect(agent).toEqual(mockAgent);
    });

    it("should handle agent not found", async () => {
      context.mock
        .onGet("/agents/1")
        .reply(404, { message: "Agent not found" });

      await expect(context.client.agents.getAgent(1)).rejects.toThrow();
    });
  });

  describe("updateAgent", () => {
    it("should update an agent successfully", async () => {
      const updatedAgent = { id: 1, name: "Updated Agent" };
      context.mock.onPut("/agents/1").reply(200, updatedAgent);

      const agent = await context.client.agents.updateAgent(1, {
        name: "Updated Agent",
        initial_prompt: "",
      });
      expect(agent).toEqual(updatedAgent);
    });

    it("should handle unauthorized update", async () => {
      context.mock.onPut("/agents/1").reply(403, { message: "Unauthorized" });

      await expect(
        context.client.agents.updateAgent(1, {
          name: "Updated Agent",
          initial_prompt: "",
        }),
      ).rejects.toThrow();
    });
  });

  describe("deleteAgent", () => {
    it("should delete an agent successfully", async () => {
      context.mock.onDelete("/agents/1").reply(204);

      await expect(
        context.client.agents.deleteAgent(1),
      ).resolves.toBeUndefined();
    });

    it("should handle agent not found during deletion", async () => {
      context.mock
        .onDelete("/agents/1")
        .reply(404, { message: "Agent not found" });

      await expect(context.client.agents.deleteAgent(1)).rejects.toThrow();
    });
  });

  describe("getAgentAnalytics", () => {
    it("should get agent analytics successfully", async () => {
      const mockAnalytics = { sessions: 10, avg_duration: 300 };
      context.mock.onGet("/agents/1/analytics").reply(200, mockAnalytics);

      const analytics = await context.client.agents.getAgentAnalytics(1);
      expect(analytics).toEqual(mockAnalytics);
    });

    it("should handle analytics for non-existent agent", async () => {
      context.mock
        .onGet("/agents/1/analytics")
        .reply(404, { message: "Agent not found" });

      await expect(
        context.client.agents.getAgentAnalytics(1),
      ).rejects.toThrow();
    });
  });

  describe("toggleAgentSharing", () => {
    it("should toggle agent sharing successfully", async () => {
      context.mock.onPut("/agents/1/share").reply(204);

      await expect(
        context.client.agents.toggleAgentSharing(1, true),
      ).resolves.toBeUndefined();
    });

    it("should handle unauthorized sharing toggle", async () => {
      context.mock
        .onPut("/agents/1/share")
        .reply(403, { message: "Unauthorized" });

      await expect(
        context.client.agents.toggleAgentSharing(1, true),
      ).rejects.toThrow();
    });
  });

  describe("agentTemplates", () => {
    it("should create an agent template successfully", async () => {
      const mockTemplate = { id: 1, name: "Test Template" };
      context.mock.onPost("/agent-templates").reply(200, mockTemplate);

      const template = await context.client.agents.createAgentTemplate({
        name: "Test Template",
        initial_prompt: "You are a helpful assistant",
        description: "",
        category: "",
        voice_id: "",
        llm_model: "",
        stt_model: "",
      });
      expect(template).toEqual(mockTemplate);
    });

    it("should list agent templates successfully", async () => {
      const mockTemplates = [{ id: 1, name: "Template 1" }];
      context.mock.onGet("/agent-templates").reply(200, mockTemplates);

      const templates = await context.client.agents.listAgentTemplates({
        publicOnly: true,
      });
      expect(templates).toEqual(mockTemplates);
    });

    it("should create agent from template successfully", async () => {
      const mockAgentFromTemplate = { id: 1, name: "New Agent" };
      context.mock
        .onPost("/agents/from-template/1")
        .reply(200, mockAgentFromTemplate);

      const agent = await context.client.agents.createAgentFromTemplate(
        1,
        "New Agent",
      );
      expect(agent).toEqual(mockAgentFromTemplate);
    });

    it("should create sample templates successfully", async () => {
      context.mock.onPost("/agent-templates/samples").reply(204);

      await expect(
        context.client.agents.createSampleTemplates(),
      ).resolves.toBeUndefined();
    });
  });

  describe("agentVersions", () => {
    it("should create agent version successfully", async () => {
      const mockVersion = { id: 1, version: "1.0" };
      context.mock.onPost("/agents/1/versions").reply(200, mockVersion);

      const version = await context.client.agents.createAgentVersion(1, {
        version_number: "",
        name: "",
        initial_prompt: "",
        voice_id: "",
        llm_model: "",
        stt_model: "",
      });
      expect(version).toEqual(mockVersion);
    });

    it("should list agent versions successfully", async () => {
      const mockVersions = [{ id: 1, version: "1.0" }];
      context.mock.onGet("/agents/1/versions").reply(200, mockVersions);

      const versions = await context.client.agents.listAgentVersions(1);
      expect(versions).toEqual(mockVersions);
    });

    it("should activate an agent version successfully", async () => {
      context.mock.onPut("/agents/1/versions/1/activate").reply(204);

      await expect(
        context.client.agents.activateAgentVersion(1, 1),
      ).resolves.toBeUndefined();
    });
  });

  describe("cloneAgent", () => {
    it("should clone an agent successfully", async () => {
      const mockClonedAgent = { id: 2, name: "Cloned Agent" };
      context.mock.onPost("/agents/1/clone").reply(200, mockClonedAgent);

      const agent = await context.client.agents.cloneAgent(1, "Cloned Agent");
      expect(agent).toEqual(mockClonedAgent);
    });

    it("should handle clone failure", async () => {
      context.mock
        .onPost("/agents/1/clone")
        .reply(404, { message: "Agent not found" });

      await expect(
        context.client.agents.cloneAgent(1, "Cloned Agent"),
      ).rejects.toThrow();
    });
  });

  describe("browseAgentMarketplace", () => {
    it("should browse agent marketplace successfully", async () => {
      const mockMarketplace = [{ id: 1, name: "Marketplace Agent" }];
      context.mock.onGet("/agents/marketplace").reply(200, mockMarketplace);

      const marketplace = await context.client.agents.browseAgentMarketplace({
        category: "general",
      });
      expect(marketplace).toEqual(mockMarketplace);
    });

    it("should handle empty marketplace", async () => {
      context.mock.onGet("/agents/marketplace").reply(200, []);

      const marketplace = await context.client.agents.browseAgentMarketplace({
        category: "nonexistent",
      });
      expect(marketplace).toEqual([]);
    });
  });
});
