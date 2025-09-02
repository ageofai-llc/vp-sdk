import {
  createTestContext,
  mockVoice,
  setupAuthenticatedClient,
  type TestContext,
} from "../../setup/test-utils";

describe("VoiceClient", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = createTestContext();
    await setupAuthenticatedClient(context.client, context.mock);
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("listVoices", () => {
    it("should list voices successfully", async () => {
      const voices = [mockVoice, { ...mockVoice, id: 2 }];
      context.mock.onGet("/voices/").reply(200, voices);

      const result = await context.client.voices.listVoices({
        language: "en-US",
        premium_only: false,
      });

      expect(result).toEqual(voices);
    });

    it("should handle empty response", async () => {
      context.mock.onGet("/voices/").reply(200, []);

      const result = await context.client.voices.listVoices();
      expect(result).toEqual([]);
    });
  });

  describe("getAvailableLanguages", () => {
    it("should get available languages successfully", async () => {
      const languages = { "en-US": 5, "es-ES": 3 };
      context.mock.onGet("/voices/languages").reply(200, languages);

      const result = await context.client.voices.getAvailableLanguages();
      expect(result).toEqual(languages);
    });
  });

  describe("getVoice", () => {
    it("should get voice details successfully", async () => {
      context.mock.onGet("/voices/1").reply(200, mockVoice);

      const voice = await context.client.voices.getVoice(1, true);
      expect(voice).toEqual(mockVoice);
    });

    it("should handle voice not found", async () => {
      context.mock
        .onGet("/voices/999")
        .reply(404, { message: "Voice not found" });

      await expect(context.client.voices.getVoice(999)).rejects.toThrow();
    });
  });

  describe("getVoicePreview", () => {
    it("should get voice preview successfully", async () => {
      const previewData = { audio: "base64-encoded-audio" };
      context.mock.onGet("/voices/1/preview").reply(200, previewData);

      const result = await context.client.voices.getVoicePreview(1);
      expect(result).toEqual(previewData);
    });
  });
});
