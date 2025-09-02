import {
  createTestContext,
  mockAgent,
  type TestContext,
} from "../../setup/test-utils";

describe("AgentsClient", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("createAgent", () => {
    it("should create agent successfully", async () => {
      const agentData = {
        name: "Test Agent",
        description: "A test agent",
        system_prompt: "You are a helpful assistant",
        voice_id: "voice-123",
        sound_effects_enabled: true,
        sound_effect_file: null,
        is_public: false,
        max_concurrent_connections: 10,
      };

      context.mock.onPost("/agents/").reply(200, mockAgent);

      const result = await context.client.agents.createAgent(agentData);
      expect(result).toEqual(mockAgent);
    });

    it("should handle validation errors", async () => {
      context.mock
        .onPost("/agents/")
        .reply(422, { message: "Invalid voice ID" });

      await expect(
        context.client.agents.createAgent({
          name: "Test Agent",
          system_prompt: "Test",
          voice_id: "invalid-voice",
        }),
      ).rejects.toThrow();
    });
  });

  describe("getAgents", () => {
    it("should get agents successfully", async () => {
      const agents = {
        agents: [mockAgent, { ...mockAgent, id: "agent-124" }],
        total: 2,
        page: 1,
        per_page: 10,
      };

      context.mock.onGet("/agents/").reply(200, agents);

      const result = await context.client.agents.getAgents({
        skip: 0,
        limit: 10,
        status: "active",
      });

      expect(result).toEqual(agents);
    });
  });

  describe("getPublicAgents", () => {
    it("should get public agents successfully", async () => {
      const publicAgents = {
        agents: [{ ...mockAgent, is_public: true }],
        total: 1,
        page: 1,
        per_page: 10,
      };

      context.mock.onGet("/agents/public").reply(200, publicAgents);

      const result = await context.client.agents.getPublicAgents({
        skip: 0,
        limit: 10,
      });

      expect(result).toEqual(publicAgents);
    });
  });

  describe("getAvailableVoices", () => {
    it("should get available voices successfully", async () => {
      const voices = {
        voices: [
          {
            uuid: "voice-123",
            name: "Test Voice",
            display_name: "Test Voice",
            gender: "female",
            language: "en-US",
          },
        ],
        total: 1,
      };

      context.mock.onGet("/agents/voices").reply(200, voices);

      const result = await context.client.agents.getAvailableVoices();
      expect(result).toEqual(voices);
    });
  });

  describe("getAgent", () => {
    it("should get agent details successfully", async () => {
      context.mock.onGet("/agents/agent-123").reply(200, mockAgent);

      const agent = await context.client.agents.getAgent("agent-123");
      expect(agent).toEqual(mockAgent);
    });

    it("should handle agent not found", async () => {
      context.mock
        .onGet("/agents/agent-999")
        .reply(404, { message: "Agent not found" });

      await expect(
        context.client.agents.getAgent("agent-999"),
      ).rejects.toThrow();
    });
  });

  describe("updateAgent", () => {
    it("should update agent successfully", async () => {
      const updatedAgent = { ...mockAgent, name: "Updated Agent" };
      context.mock.onPut("/agents/agent-123").reply(200, updatedAgent);

      const result = await context.client.agents.updateAgent("agent-123", {
        name: "Updated Agent",
      });

      expect(result).toEqual(updatedAgent);
    });
  });

  describe("deleteAgent", () => {
    it("should delete agent successfully", async () => {
      context.mock.onDelete("/agents/agent-123").reply(200, {});

      await expect(
        context.client.agents.deleteAgent("agent-123"),
      ).resolves.not.toThrow();
    });
  });

  describe("getAgentStats", () => {
    it("should get agent statistics successfully", async () => {
      const stats = {
        total_connections: 50,
        active_connections: 5,
        total_messages_sent: 200,
        total_messages_received: 180,
        total_duration: 3600,
        webhooks_count: 3,
        last_activity: "2023-06-15T10:30:00Z",
        rag_queries_count: 25,
        rag_successful_queries: 22,
        rag_failed_queries: 3,
        rag_total_tokens_used: 2500,
        rag_documents_count: 5,
        rag_last_query: "2023-06-15T10:25:00Z",
      };

      context.mock.onGet("/agents/agent-123/stats").reply(200, stats);

      const result = await context.client.agents.getAgentStats("agent-123");
      expect(result).toEqual(stats);
    });
  });

  describe("makeFunctionCall", () => {
    it("should make function call successfully", async () => {
      const functionCallRequest = {
        function_name: "get_weather",
        parameters: { location: "Paris", unit: "celsius" },
        timeout: 30,
        webhook_url: null,
        metadata: null,
      };

      const functionCallResponse = {
        call_id: "call-123",
        function_name: "get_weather",
        status: "completed",
        result: { temperature: 25, condition: "Sunny" },
        error: null,
        execution_time_ms: 500,
        created_at: "2023-06-15T10:30:00Z",
        completed_at: "2023-06-15T10:30:00Z",
      };

      context.mock
        .onPost("/agents/agent-123/function-calls")
        .reply(200, functionCallResponse);

      const result = await context.client.agents.makeFunctionCall(
        "agent-123",
        functionCallRequest,
      );
      expect(result).toEqual(functionCallResponse);
    });
  });

  describe("makeExternalRequest", () => {
    it("should make external request successfully", async () => {
      const externalRequest = {
        url: "https://api.weather.com/current",
        method: "GET",
        headers: { "X-API-Key": "test-key" },
        params: { location: "Paris" },
        data: null,
        timeout: 30,
        webhook_url: null,
        metadata: null,
      };

      const externalResponse = {
        call_id: "call-124",
        function_name: "external_request",
        status: "completed",
        result: { temperature: 25, condition: "Sunny" },
        error: null,
        execution_time_ms: 800,
        created_at: "2023-06-15T10:30:00Z",
        completed_at: "2023-06-15T10:30:00Z",
      };

      context.mock
        .onPost("/agents/agent-123/external-requests")
        .reply(200, externalResponse);

      const result = await context.client.agents.makeExternalRequest(
        "agent-123",
        externalRequest,
      );
      expect(result).toEqual(externalResponse);
    });
  });
});
