import {
  createTestContext,
  mockSynthesis,
  type TestContext,
} from "../../setup/test-utils";

describe("TTSClient", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("synthesizeText", () => {
    it("should synthesize text successfully", async () => {
      context.mock.onPost("/tts/synthesize").reply(200, mockSynthesis);

      const synthesis = await context.client.tts.synthesizeText({
        voice_id: 1,
        input_text: "Test synthesis text",
        output_format: "mp3",
      });

      expect(synthesis).toEqual(mockSynthesis);
    });

    it("should handle invalid voice ID", async () => {
      context.mock
        .onPost("/tts/synthesize")
        .reply(404, { message: "Voice not found" });

      await expect(
        context.client.tts.synthesizeText({
          voice_id: 999,
          input_text: "Test text",
        }),
      ).rejects.toThrow();
    });
  });

  describe("getSyntheses", () => {
    it("should get syntheses list successfully", async () => {
      const syntheses = {
        syntheses: [mockSynthesis, { ...mockSynthesis, id: 2 }],
        total: 2,
        page: 1,
        per_page: 10,
      };

      context.mock.onGet("/tts/syntheses").reply(200, syntheses);

      const result = await context.client.tts.getSyntheses(0, 10);
      expect(result).toEqual(syntheses);
    });
  });

  describe("getSynthesis", () => {
    it("should get synthesis details successfully", async () => {
      context.mock.onGet("/tts/syntheses/1").reply(200, mockSynthesis);

      const synthesis = await context.client.tts.getSynthesis(1);
      expect(synthesis).toEqual(mockSynthesis);
    });

    it("should handle synthesis not found", async () => {
      context.mock
        .onGet("/tts/syntheses/999")
        .reply(404, { message: "Synthesis not found" });

      await expect(context.client.tts.getSynthesis(999)).rejects.toThrow();
    });
  });

  describe("deleteSynthesis", () => {
    it("should delete synthesis successfully", async () => {
      context.mock.onDelete("/tts/syntheses/1").reply(200, {});

      await expect(
        context.client.tts.deleteSynthesis(1),
      ).resolves.not.toThrow();
    });

    it("should handle synthesis not found for deletion", async () => {
      context.mock
        .onDelete("/tts/syntheses/999")
        .reply(404, { message: "Synthesis not found" });

      await expect(context.client.tts.deleteSynthesis(999)).rejects.toThrow();
    });
  });

  describe("downloadSynthesis", () => {
    it("should download synthesis audio successfully", async () => {
      const audioData = { url: "https://example.com/audio.mp3" };
      context.mock.onGet("/tts/syntheses/1/download").reply(200, audioData);

      const result = await context.client.tts.downloadSynthesis(1);
      expect(result).toEqual(audioData);
    });
  });

  describe("getSynthesisStats", () => {
    it("should get synthesis statistics successfully", async () => {
      const stats = {
        total_syntheses: 10,
        completed_syntheses: 8,
        failed_syntheses: 2,
        processing_syntheses: 0,
        success_rate: 80,
        provider_usage: { google: 5, deepgram: 5 },
        total_duration: 50.5,
        average_processing_time: 2.1,
      };

      context.mock.onGet("/tts/stats").reply(200, stats);

      const result = await context.client.tts.getSynthesisStats();
      expect(result).toEqual(stats);
    });
  });
});
