import {
  createTestContext,
  type TestContext,
  setupAuthenticatedClient,
} from "../../setup/test-utils";

describe("APIKeyClient", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = createTestContext();
    await setupAuthenticatedClient(context.client, context.mock);
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("listAPIKeys", () => {
    it("should list API keys successfully", async () => {
      const mockKeys = [{ id: 1, name: "Test Key" }];
      context.mock.onGet("/api-keys").reply(200, mockKeys);

      const keys = await context.client.apiKey.listAPIKeys();
      expect(keys).toEqual(mockKeys);
    });

    it("should handle empty API key list", async () => {
      context.mock.onGet("/api-keys").reply(200, []);

      const keys = await context.client.apiKey.listAPIKeys();
      expect(keys).toEqual([]);
    });
  });

  describe("createAPIKey", () => {
    it("should create an API key successfully", async () => {
      const mockKey = { id: 1, name: "Test Key", key: "api-key-123" };
      context.mock.onPost("/api-keys").reply(200, mockKey);

      const key = await context.client.apiKey.createAPIKey({
        name: "Test Key",
      });
      expect(key).toEqual(mockKey);
    });

    it("should handle API key creation failure", async () => {
      context.mock
        .onPost("/api-keys")
        .reply(400, { message: "Invalid key name" });

      await expect(
        context.client.apiKey.createAPIKey({ name: "" }),
      ).rejects.toThrow();
    });
  });

  describe("deleteAPIKey", () => {
    it("should delete an API key successfully", async () => {
      context.mock.onDelete("/api-keys/1").reply(204);

      await expect(
        context.client.apiKey.deleteAPIKey(1),
      ).resolves.toBeUndefined();
    });

    it("should handle API key not found during deletion", async () => {
      context.mock
        .onDelete("/api-keys/1")
        .reply(404, { message: "API key not found" });

      await expect(context.client.apiKey.deleteAPIKey(1)).rejects.toThrow();
    });
  });
});
