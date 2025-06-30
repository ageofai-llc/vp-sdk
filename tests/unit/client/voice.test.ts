import {
  createTestContext,
  TestContext,
  setupAuthenticatedClient,
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
      const mockVoices = [{ id: "voice1", name: "Voice 1" }];
      context.mock.onGet("/voices").reply(200, mockVoices);

      const voices = await context.client.voices.listVoices();
      expect(voices).toEqual(mockVoices);
    });
  });

  describe("cloneVoice", () => {
    it("should clone a voice successfully", async () => {
      const mockVoice = { id: "voice2", name: "Cloned Voice" };
      context.mock.onPost("/voices/clone").reply(200, mockVoice);

      const voice = await context.client.voices.cloneVoice(
        Buffer.from("audio data")
      );
      expect(voice).toEqual(mockVoice);
    });

    it("should handle clone failure", async () => {
      context.mock
        .onPost("/voices/clone")
        .reply(400, { message: "Invalid audio data" });

      await expect(
        context.client.voices.cloneVoice(Buffer.from("invalid data"))
      ).rejects.toThrow();
    });
  });

  describe("getVoice", () => {
    it("should get a voice successfully", async () => {
      const mockVoice = { id: "voice1", name: "Voice 1" };
      context.mock.onGet("/voices/voice1").reply(200, mockVoice);

      const voice = await context.client.voices.getVoice("voice1");
      expect(voice).toEqual(mockVoice);
    });

    it("should handle voice not found", async () => {
      context.mock
        .onGet("/voices/voice1")
        .reply(404, { message: "Voice not found" });

      await expect(context.client.voices.getVoice("voice1")).rejects.toThrow();
    });
  });

  describe("deleteVoice", () => {
    it("should delete a voice successfully", async () => {
      context.mock.onDelete("/voices/voice1").reply(204);

      await expect(
        context.client.voices.deleteVoice("voice1")
      ).resolves.toBeUndefined();
    });

    it("should handle unauthorized deletion", async () => {
      context.mock
        .onDelete("/voices/voice1")
        .reply(403, { message: "Unauthorized" });

      await expect(
        context.client.voices.deleteVoice("voice1")
      ).rejects.toThrow();
    });
  });
});
