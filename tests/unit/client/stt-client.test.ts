import {
  createTestContext,
  mockTranscription,
  type TestContext,
} from "../../setup/test-utils";

// Mock file for upload
const mockFile = Buffer.from("test audio content");

describe("STTClient", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("transcribeAudio", () => {
    it("should transcribe audio successfully", async () => {
      context.mock.onPost("/stt/transcribe").reply(200, mockTranscription);

      const transcription = await context.client.stt.transcribeAudio(
        mockFile,
        "pywhispercpp",
        "en",
        "base",
      );

      expect(transcription).toEqual(mockTranscription);
    });

    it("should handle unsupported audio format", async () => {
      context.mock
        .onPost("/stt/transcribe")
        .reply(400, { message: "Unsupported audio format" });

      await expect(
        context.client.stt.transcribeAudio(mockFile, "pywhispercpp"),
      ).rejects.toThrow();
    });
  });

  describe("getTranscriptions", () => {
    it("should get transcriptions list successfully", async () => {
      const transcriptions = {
        transcriptions: [mockTranscription, { ...mockTranscription, id: 2 }],
        total: 2,
        page: 1,
        per_page: 10,
      };

      context.mock.onGet("/stt/transcriptions").reply(200, transcriptions);

      const result = await context.client.stt.getTranscriptions(0, 10);
      expect(result).toEqual(transcriptions);
    });
  });

  describe("getTranscription", () => {
    it("should get transcription details successfully", async () => {
      context.mock.onGet("/stt/transcriptions/1").reply(200, mockTranscription);

      const transcription = await context.client.stt.getTranscription(1);
      expect(transcription).toEqual(mockTranscription);
    });

    it("should handle transcription not found", async () => {
      context.mock
        .onGet("/stt/transcriptions/999")
        .reply(404, { message: "Transcription not found" });

      await expect(context.client.stt.getTranscription(999)).rejects.toThrow();
    });
  });

  describe("deleteTranscription", () => {
    it("should delete transcription successfully", async () => {
      context.mock.onDelete("/stt/transcriptions/1").reply(200, {});

      await expect(
        context.client.stt.deleteTranscription(1),
      ).resolves.not.toThrow();
    });
  });

  describe("getTranscriptionStatus", () => {
    it("should get transcription status successfully", async () => {
      const status = {
        id: 1,
        status: "PROCESSING",
        progress: 50,
        estimated_time_remaining: 30,
      };

      context.mock.onGet("/stt/transcriptions/1/status").reply(200, status);

      const result = await context.client.stt.getTranscriptionStatus(1);
      expect(result).toEqual(status);
    });
  });

  describe("getTranscriptionStats", () => {
    it("should get transcription statistics successfully", async () => {
      const stats = {
        total_transcriptions: 15,
        successful_transcriptions: 12,
        failed_transcriptions: 3,
        success_rate: 80,
      };

      context.mock.onGet("/stt/stats").reply(200, stats);

      const result = await context.client.stt.getTranscriptionStats();
      expect(result).toEqual(stats);
    });
  });
});
