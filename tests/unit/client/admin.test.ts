import {
  createTestContext,
  TestContext,
  setupAuthenticatedClient,
} from "../../setup/test-utils";

describe("AdminClient", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = createTestContext();
    await setupAuthenticatedClient(context.client, context.mock);
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("getMetrics", () => {
    it("should get metrics successfully", async () => {
      const mockMetrics = { active_sessions: 10 };
      context.mock.onGet("/metrics").reply(200, mockMetrics);

      const metrics = await context.client.admin.getMetrics();
      expect(metrics).toEqual(mockMetrics);
    });

    it("should handle unauthorized access", async () => {
      context.mock
        .onGet("/metrics")
        .reply(403, { message: "Admin access required" });

      await expect(context.client.admin.getMetrics()).rejects.toThrow();
    });
  });

  describe("listUsers", () => {
    it("should list users successfully", async () => {
      const mockUsers = [{ id: 1, username: "testuser" }];
      context.mock.onGet("/admin/users").reply(200, mockUsers);

      const users = await context.client.admin.listUsers();
      expect(users).toEqual(mockUsers);
    });
  });

  describe("listAgents", () => {
    it("should list agents successfully", async () => {
      const mockAgents = [{ id: 1, name: "Agent 1" }];
      context.mock.onGet("/admin/agents").reply(200, mockAgents);

      const agents = await context.client.admin.listAgents();
      expect(agents).toEqual(mockAgents);
    });
  });

  describe("listSessions", () => {
    it("should list sessions successfully", async () => {
      const mockSessions = [{ session_id: 1, agent_id: 1 }];
      context.mock.onGet("/admin/sessions").reply(200, mockSessions);

      const sessions = await context.client.admin.listSessions();
      expect(sessions).toEqual(mockSessions);
    });
  });

  describe("getUsage", () => {
    it("should get usage successfully", async () => {
      const mockUsage = { total_requests: 100 };
      context.mock.onGet("/admin/usage").reply(200, mockUsage);

      const usage = await context.client.admin.getUsage();
      expect(usage).toEqual(mockUsage);
    });
  });
});
