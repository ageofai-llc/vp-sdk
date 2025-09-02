import {
  createTestContext,
  mockAPIKey,
  type TestContext,
} from "../../setup/test-utils";

describe("APIKeysClient", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("getAvailableScopes", () => {
    it("should get available scopes successfully", async () => {
      const scopes = {
        scopes: [
          { scope: "agent:connect", description: "Connect to agents" },
          { scope: "stt:transcribe", description: "Transcribe audio" },
          { scope: "tts:synthesize", description: "Synthesize text to speech" },
        ],
      };

      context.mock.onGet("/auth/api-keys/scopes").reply(200, scopes);

      const result = await context.client.apiKey.getAvailableScopes();
      expect(result).toEqual(scopes);
    });
  });

  describe("createAPIKey", () => {
    it("should create API key successfully", async () => {
      const apiKeyData = {
        name: "Test API Key",
        description: "A test API key",
        scopes: ["agent:connect"],
        expires_in_days: 30,
      };

      const createResponse = {
        api_key: mockAPIKey,
        key: "sk_test_1234567890abcdef",
        message: "API key created successfully",
      };

      context.mock.onPost("/auth/api-keys/").reply(200, createResponse);

      const result = await context.client.apiKey.createAPIKey(apiKeyData);
      expect(result).toEqual(createResponse);
    });

    it("should handle validation errors", async () => {
      context.mock
        .onPost("/auth/api-keys/")
        .reply(422, { message: "Invalid scopes" });

      await expect(
        context.client.apiKey.createAPIKey({
          name: "Test Key",
          scopes: ["invalid:scope"],
        }),
      ).rejects.toThrow();
    });
  });

  describe("listAPIKeys", () => {
    it("should list API keys successfully", async () => {
      const apiKeys = {
        keys: [mockAPIKey, { ...mockAPIKey, id: "key-124" }],
        total: 2,
        page: 1,
        size: 10,
        pages: 1,
      };

      context.mock.onGet("/auth/api-keys/").reply(200, apiKeys);

      const result = await context.client.apiKey.listAPIKeys(0, 10);
      expect(result).toEqual(apiKeys);
    });
  });

  describe("getAPIKey", () => {
    it("should get API key details successfully", async () => {
      context.mock.onGet("/auth/api-keys/key-123").reply(200, mockAPIKey);

      const apiKey = await context.client.apiKey.getAPIKey("key-123");
      expect(apiKey).toEqual(mockAPIKey);
    });

    it("should handle API key not found", async () => {
      context.mock
        .onGet("/auth/api-keys/key-999")
        .reply(404, { message: "API key not found" });

      await expect(
        context.client.apiKey.getAPIKey("key-999"),
      ).rejects.toThrow();
    });
  });

  describe("updateAPIKey", () => {
    it("should update API key successfully", async () => {
      const updatedAPIKey = { ...mockAPIKey, name: "Updated API Key" };
      context.mock.onPut("/auth/api-keys/key-123").reply(200, updatedAPIKey);

      const result = await context.client.apiKey.updateAPIKey("key-123", {
        name: "Updated API Key",
      });

      expect(result).toEqual(updatedAPIKey);
    });
  });

  describe("deleteAPIKey", () => {
    it("should delete API key successfully", async () => {
      context.mock.onDelete("/auth/api-keys/key-123").reply(200, {});

      await expect(
        context.client.apiKey.deleteAPIKey("key-123"),
      ).resolves.not.toThrow();
    });
  });

  describe("revokeAPIKey", () => {
    it("should revoke API key successfully", async () => {
      context.mock.onPost("/auth/api-keys/key-123/revoke").reply(200, {});

      await expect(
        context.client.apiKey.revokeAPIKey("key-123", {
          reason: "Security concerns",
        }),
      ).resolves.not.toThrow();
    });
  });
});
