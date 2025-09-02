// scoreexl-sdk/tests/usage-tracking-client.test.ts
import { createTestContext, type TestContext } from "../../setup/test-utils";

describe("UsageTrackingClient", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("trackTTSUsage", () => {
    it("should track TTS usage successfully", async () => {
      const usageRequest = {
        text: "Hello world",
        voice_id: "voice-123",
        audio_format: "mp3",
        quality: "standard",
        speed: 1.0,
        processing_time_ms: 500,
        output_duration_seconds: 2.5,
        file_size_bytes: 10240,
        success: true,
        error_message: null,
      };

      context.mock.onPost("/usage/track/tts").reply(200, {});

      await expect(
        context.client.usageTracking.trackTTSUsage(usageRequest),
      ).resolves.not.toThrow();
    });
  });

  describe("trackSTTUsage", () => {
    it("should track STT usage successfully", async () => {
      const usageRequest = {
        audio_duration_seconds: 10.5,
        file_size_bytes: 102400,
        transcribed_text: "This is a test transcription",
        audio_format: "wav",
        sample_rate: 16000,
        channels: 1,
        language: "en",
        model: "nova-2",
        processing_time_ms: 3000,
        confidence_score: 0.95,
        success: true,
        error_message: null,
      };

      context.mock.onPost("/usage/track/stt").reply(200, {});

      await expect(
        context.client.usageTracking.trackSTTUsage(usageRequest),
      ).resolves.not.toThrow();
    });
  });

  describe("trackAgentUsage", () => {
    it("should track agent usage successfully", async () => {
      const usageRequest = {
        agent_id: "agent-123",
        session_duration_seconds: 300,
        messages_sent: 10,
        messages_received: 12,
        function_calls_made: 2,
        webhooks_triggered: 1,
        total_input_characters: 500,
        total_output_characters: 600,
        voice_mode_duration: 180,
        text_mode_duration: 120,
        processing_time_ms: 5000,
        success: true,
        error_message: null,
      };

      context.mock.onPost("/usage/track/agent").reply(200, {});

      await expect(
        context.client.usageTracking.trackAgentUsage(usageRequest),
      ).resolves.not.toThrow();
    });
  });

  describe("trackEmbeddingUsage", () => {
    it("should track embedding usage successfully", async () => {
      const usageRequest = {
        text_inputs: ["Hello world", "Test text"],
        model: "text-embedding-ada-002",
        vector_dimensions: 1536,
        batch_size: 2,
        similarity_calculations: 5,
        processing_time_ms: 1000,
        success: true,
        error_message: null,
      };

      context.mock.onPost("/usage/track/embeddings").reply(200, {});

      await expect(
        context.client.usageTracking.trackEmbeddingUsage(usageRequest),
      ).resolves.not.toThrow();
    });
  });

  describe("trackRAGUsage", () => {
    it("should track RAG usage successfully", async () => {
      const usageRequest = {
        query_text: "What is the capital of France?",
        response_text: "The capital of France is Paris.",
        documents_searched: 5,
        relevant_documents_found: 2,
        vector_searches_performed: 3,
        agent_id: "agent-123",
        processing_time_ms: 1500,
        success: true,
        error_message: null,
      };

      context.mock.onPost("/usage/track/rag").reply(200, {});

      await expect(
        context.client.usageTracking.trackRAGUsage(usageRequest),
      ).resolves.not.toThrow();
    });
  });

  describe("trackFunctionCallUsage", () => {
    it("should track function call usage successfully", async () => {
      const usageRequest = {
        agent_id: "agent-123",
        function_name: "get_weather",
        parameters: { location: "Paris", unit: "celsius" },
        result: { temperature: 25, condition: "Sunny" },
        execution_time_ms: 800,
        success: true,
        error_message: null,
      };

      context.mock.onPost("/usage/track/function-call").reply(200, {});

      await expect(
        context.client.usageTracking.trackFunctionCallUsage(usageRequest),
      ).resolves.not.toThrow();
    });
  });

  describe("getDetailedUsageAnalysis", () => {
    it("should get detailed usage analysis successfully", async () => {
      const analysis = {
        period: "2023-06",
        total_cost: 50.0,
        service_breakdown: {
          stt: { cost: 30.0, usage: 3000 },
          tts: { cost: 15.0, usage: 15000 },
          other: { cost: 5.0, usage: 50 },
        },
        daily_usage: [{ date: "2023-06-15", cost: 2.35, transactions: 18 }],
        top_resources: [{ resource_id: "voice-123", cost: 10.0, usage: 1000 }],
      };

      context.mock.onGet("/usage/analysis").reply(200, analysis);

      const result =
        await context.client.usageTracking.getDetailedUsageAnalysis({
          start_date: "2023-06-01",
          end_date: "2023-06-30",
          service_type: "stt",
        });

      expect(result).toEqual(analysis);
    });
  });

  describe("analyzeText", () => {
    it("should analyze text successfully", async () => {
      const analysis = {
        text: "Hello world",
        character_count: 11,
        word_count: 2,
        sentence_count: 1,
        estimated_cost: 0.011,
        language: "en",
        complexity: "low",
      };

      context.mock.onPost("/usage/analyze-text").reply(200, analysis);

      const result =
        await context.client.usageTracking.analyzeText("Hello world");
      expect(result).toEqual(analysis);
    });
  });

  describe("getDetailedCostEstimate", () => {
    it("should get detailed cost estimate successfully", async () => {
      const estimate = {
        service_type: "stt_transcription",
        units: 300,
        cost_per_unit: 0.01,
        estimated_cost: 3.0,
        currency: "USD",
        breakdown: {
          base_cost: 3.0,
          tax: 0.3,
          total: 3.3,
        },
      };

      context.mock.onPost("/usage/estimate").reply(200, estimate);

      const result = await context.client.usageTracking.getDetailedCostEstimate(
        "stt_transcription",
        300,
        { include_tax: true },
      );

      expect(result).toEqual(estimate);
    });
  });
});
