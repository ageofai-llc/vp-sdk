import {
  createTestContext,
  TestContext,
  setupAuthenticatedClient,
  mockSession,
} from "../../setup/test-utils";

describe("SessionClient", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = createTestContext();
    await setupAuthenticatedClient(context.client, context.mock);
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("startSession", () => {
    it("should start a session successfully", async () => {
      context.mock.onPost("/sessions/1").reply(200, mockSession);

      const session = await context.client.sessions.startSession(1);
      expect(session).toEqual(mockSession);
    });

    it("should handle unauthorized session start", async () => {
      context.mock
        .onPost("/sessions/1")
        .reply(401, { message: "Unauthorized" });

      await expect(context.client.sessions.startSession(1)).rejects.toThrow();
    });

    it("should handle agent not found", async () => {
      context.mock
        .onPost("/sessions/1")
        .reply(404, { message: "Agent not found" });

      await expect(context.client.sessions.startSession(1)).rejects.toThrow();
    });
  });

  describe("listSessions", () => {
    it("should list sessions successfully", async () => {
      const mockSessions = [
        { session_id: 1, agent_id: 1 },
        { session_id: 2, agent_id: 2 },
      ];
      context.mock.onGet("/sessions").reply(200, mockSessions);

      const sessions = await context.client.sessions.listSessions();
      expect(sessions).toEqual(mockSessions);
    });

    it("should handle empty session list", async () => {
      context.mock.onGet("/sessions").reply(200, []);

      const sessions = await context.client.sessions.listSessions();
      expect(sessions).toEqual([]);
    });
  });

  describe("getSession", () => {
    it("should get a session successfully", async () => {
      const mockSessionData = { session_id: 1, agent_id: 1 };
      context.mock.onGet("/sessions/1").reply(200, mockSessionData);

      const session = await context.client.sessions.getSession(1);
      expect(session).toEqual(mockSessionData);
    });

    it("should handle session not found", async () => {
      context.mock
        .onGet("/sessions/1")
        .reply(404, { message: "Session not found" });

      await expect(context.client.sessions.getSession(1)).rejects.toThrow();
    });
  });

  describe("endSession", () => {
    it("should end a session successfully", async () => {
      context.mock.onPost("/sessions/1/end").reply(204);

      await expect(
        context.client.sessions.endSession(1)
      ).resolves.toBeUndefined();
    });

    it("should handle ending non-existent session", async () => {
      context.mock
        .onPost("/sessions/1/end")
        .reply(404, { message: "Session not found" });

      await expect(context.client.sessions.endSession(1)).rejects.toThrow();
    });
  });

  describe("sendMessage", () => {
    it("should send a message successfully", async () => {
      const mockResponse = { content: "Hello, user!" };
      context.mock.onPost("/sessions/1/message").reply(200, mockResponse);

      const response = await context.client.sessions.sendMessage(1, {
        content: "Hello, agent!",
      });
      expect(response).toEqual(mockResponse);
    });

    it("should handle message sending failure", async () => {
      context.mock
        .onPost("/sessions/1/message")
        .reply(500, { message: "Failed to send message" });

      await expect(
        context.client.sessions.sendMessage(1, { content: "Hello, agent!" })
      ).rejects.toThrow();
    });
  });

  describe("controlAgent", () => {
    it("should control an agent successfully", async () => {
      context.mock.onPost("/sessions/1/agent/control").reply(204);

      await expect(
        context.client.sessions.controlAgent(1, { command: "pause" })
      ).resolves.toBeUndefined();
    });

    it("should handle invalid control commands", async () => {
      context.mock
        .onPost("/sessions/1/agent/control")
        .reply(400, { message: "Invalid command" });

      await expect(
        context.client.sessions.controlAgent(1, { command: "invalid" })
      ).rejects.toThrow();
    });
  });

  describe("getConversationHistory", () => {
    it("should get conversation history successfully", async () => {
      const mockHistory = [{ message: "Hello", timestamp: "2025-06-25" }];
      context.mock.onGet("/sessions/1/conversation").reply(200, mockHistory);

      const history = await context.client.sessions.getConversationHistory(1, {
        limit: 10,
      });
      expect(history).toEqual(mockHistory);
    });

    it("should handle empty conversation history", async () => {
      context.mock.onGet("/sessions/1/conversation").reply(200, []);

      const history = await context.client.sessions.getConversationHistory(1, {
        limit: 10,
      });
      expect(history).toEqual([]);
    });
  });

  describe("conversationLogs", () => {
    it("should add conversation log successfully", async () => {
      context.mock.onPost("/sessions/1/logs").reply(204);

      await expect(
        context.client.sessions.addConversationLog(1, { message: "Log entry" })
      ).resolves.toBeUndefined();
    });

    it("should get conversation logs successfully", async () => {
      const mockLogs = [{ message: "Log entry" }];
      context.mock.onGet("/sessions/1/logs").reply(200, mockLogs);

      const logs = await context.client.sessions.getConversationLogs(1);
      expect(logs).toEqual(mockLogs);
    });
  });

  describe("updateAgentPrompt", () => {
    it("should update agent prompt successfully", async () => {
      context.mock.onPost("/sessions/1/agent/prompt").reply(204);

      await expect(
        context.client.sessions.updateAgentPrompt(1, { prompt: "New prompt" })
      ).resolves.toBeUndefined();
    });

    it("should handle invalid prompt update", async () => {
      context.mock
        .onPost("/sessions/1/agent/prompt")
        .reply(400, { message: "Invalid prompt" });

      await expect(
        context.client.sessions.updateAgentPrompt(1, { prompt: "" })
      ).rejects.toThrow();
    });
  });

  describe("getSessionStatus", () => {
    it("should get session status successfully", async () => {
      const mockStatus = { active: true };
      context.mock.onGet("/sessions/1/status").reply(200, mockStatus);

      const status = await context.client.sessions.getSessionStatus(1);
      expect(status).toEqual(mockStatus);
    });

    it("should handle inactive session status", async () => {
      const mockStatus = { active: false };
      context.mock.onGet("/sessions/1/status").reply(200, mockStatus);

      const status = await context.client.sessions.getSessionStatus(1);
      expect(status).toEqual(mockStatus);
    });
  });
});
