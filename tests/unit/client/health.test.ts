import { createTestContext, TestContext } from "../../setup/test-utils";

describe("HealthClient", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("checkHealth", () => {
    it("should get health status successfully", async () => {
      const mockHealth = { status: "healthy", cpu_usage: 10 };
      context.mock.onGet("/health").reply(200, mockHealth);

      const health = await context.client.health.checkHealth();
      expect(health).toEqual(mockHealth);
    });

    it("should handle health check failure", async () => {
      context.mock
        .onGet("/health")
        .reply(500, { message: "Request failed with status 500" });

      await expect(context.client.health.checkHealth()).rejects.toThrow(
        "Request failed with status 500"
      );
    });

    it("should handle network errors", async () => {
      context.mock.onGet("/health").networkError();

      await expect(context.client.health.checkHealth()).rejects.toThrow();
    });

    it("should handle timeout errors", async () => {
      context.mock.onGet("/health").timeout();

      await expect(context.client.health.checkHealth()).rejects.toThrow();
    });
  });
});
