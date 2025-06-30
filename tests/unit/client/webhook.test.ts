import {
  createTestContext,
  type TestContext,
  setupAuthenticatedClient,
} from "../../setup/test-utils";

describe("WebhookClient", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = createTestContext();
    await setupAuthenticatedClient(context.client, context.mock);
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("listWebhooks", () => {
    it("should list webhooks successfully", async () => {
      const mockWebhooks = [
        { id: 1, url: "https://example.com", event: "session_ended" },
      ];
      context.mock.onGet("/webhooks").reply(200, mockWebhooks);

      const webhooks = await context.client.webhooks.listWebhooks();
      expect(webhooks).toEqual(mockWebhooks);
    });
  });

  describe("createWebhook", () => {
    it("should create a webhook successfully", async () => {
      const mockWebhook = {
        id: 1,
        url: "https://example.com",
        event: "session_ended",
      };
      context.mock.onPost("/webhooks").reply(200, mockWebhook);

      const webhook = await context.client.webhooks.createWebhook({
        url: "https://example.com",
        event: "session_ended",
      });
      expect(webhook).toEqual(mockWebhook);
    });

    it("should handle invalid webhook URL", async () => {
      context.mock.onPost("/webhooks").reply(400, { message: "Invalid URL" });

      await expect(
        context.client.webhooks.createWebhook({
          url: "invalid-url",
          event: "session_ended",
        }),
      ).rejects.toThrow();
    });
  });

  describe("getWebhook", () => {
    it("should get a webhook successfully", async () => {
      const mockWebhook = {
        id: 1,
        url: "https://example.com",
        event: "session_ended",
      };
      context.mock.onGet("/webhooks/1").reply(200, mockWebhook);

      const webhook = await context.client.webhooks.getWebhook(1);
      expect(webhook).toEqual(mockWebhook);
    });
  });

  describe("updateWebhook", () => {
    it("should update a webhook successfully", async () => {
      const mockWebhook = {
        id: 1,
        url: "https://new.example.com",
        event: "session_ended",
      };
      context.mock.onPut("/webhooks/1").reply(200, mockWebhook);

      const webhook = await context.client.webhooks.updateWebhook(1, {
        url: "https://new.example.com",
        event: "session_ended",
      });
      expect(webhook).toEqual(mockWebhook);
    });
  });

  describe("deleteWebhook", () => {
    it("should delete a webhook successfully", async () => {
      context.mock.onDelete("/webhooks/1").reply(204);

      await expect(
        context.client.webhooks.deleteWebhook(1),
      ).resolves.toBeUndefined();
    });
  });

  describe("toggleWebhook", () => {
    it("should toggle a webhook successfully", async () => {
      context.mock.onPut("/webhooks/1/toggle").reply(204);

      await expect(
        context.client.webhooks.toggleWebhook(1),
      ).resolves.toBeUndefined();
    });
  });

  describe("testWebhook", () => {
    it("should test a webhook successfully", async () => {
      context.mock.onPost("/webhooks/1/test").reply(204);

      await expect(
        context.client.webhooks.testWebhook(1),
      ).resolves.toBeUndefined();
    });
  });

  describe("listWebhookEvents", () => {
    it("should list webhook events successfully", async () => {
      const mockEvents = ["session_ended", "session_started"];
      context.mock.onGet("/webhooks/events").reply(200, mockEvents);

      const events = await context.client.webhooks.listWebhookEvents();
      expect(events).toEqual(mockEvents);
    });
  });
});
