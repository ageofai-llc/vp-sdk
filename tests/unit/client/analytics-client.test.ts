import { createTestContext, type TestContext } from "../../setup/test-utils";

describe("AnalyticsClient", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("getAnalyticsSummary", () => {
    it("should get analytics summary successfully", async () => {
      const summary = {
        users: { total: 100, active_today: 25 },
        stt: {
          total_transcriptions: 500,
          successful_transcriptions: 480,
          success_rate: 96,
        },
        tts: {
          total_syntheses: 300,
          successful_syntheses: 285,
          success_rate: 95,
        },
        activity: { events_today: 1000, avg_response_time_ms: 150 },
      };

      context.mock.onGet("/analytics/summary").reply(200, summary);

      const result = await context.client.analytics.getAnalyticsSummary();
      expect(result).toEqual(summary);
    });
  });

  describe("getUserAnalytics", () => {
    it("should get user analytics successfully", async () => {
      const userAnalytics = {
        user_id: "user-123",
        registration_date: "2023-01-01",
        last_login_date: "2023-06-01",
        last_activity_date: "2023-06-15T10:30:00Z",
        total_logins: 50,
        total_sessions: 60,
        total_session_duration_minutes: 1200,
        stt_transcriptions_count: 25,
        tts_syntheses_count: 15,
        days_active: 45,
        consecutive_days_active: 5,
        max_consecutive_days: 10,
        avg_response_time_ms: 200,
        total_processing_time_ms: 5000,
        id: "analytics-123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: null,
      };

      context.mock.onGet("/analytics/users/user-123").reply(200, userAnalytics);

      const result =
        await context.client.analytics.getUserAnalytics("user-123");
      expect(result).toEqual(userAnalytics);
    });
  });

  describe("getUserDailyStats", () => {
    it("should get user daily stats successfully", async () => {
      const dailyStats = {
        user_id: "user-123",
        stats: [
          {
            date: "2023-06-01",
            logins_count: 1,
            session_duration_minutes: 30,
            is_active: true,
            stt_transcriptions_count: 2,
            tts_syntheses_count: 1,
            api_requests_count: 10,
            avg_response_time_ms: 150,
            total_processing_time_ms: 300,
            id: "stat-1",
            user_analytics_id: "analytics-123",
            created_at: "2023-06-01T23:59:59Z",
            updated_at: null,
          },
        ],
      };

      context.mock
        .onGet("/analytics/users/user-123/daily-stats")
        .reply(200, dailyStats);

      const result = await context.client.analytics.getUserDailyStats(
        "user-123",
        "2023-06-01",
        "2023-06-30",
      );

      expect(result).toEqual(dailyStats);
    });
  });

  describe("getSTTAnalytics", () => {
    it("should get STT analytics successfully", async () => {
      const sttAnalytics = [
        {
          provider: "pywhispercpp",
          total_transcriptions: 100,
          successful_transcriptions: 95,
          failed_transcriptions: 5,
          avg_processing_time_seconds: 2.5,
          avg_confidence_score: 0.92,
          total_audio_duration_seconds: 500,
          total_file_size_bytes: 1024000,
          file_type_stats: { wav: 70, mp3: 30 },
          language_stats: { en: 80, es: 20 },
          error_stats: { format: 3, network: 2 },
          id: "stt-1",
          created_at: "2023-06-01T00:00:00Z",
          updated_at: null,
        },
      ];

      context.mock.onGet("/analytics/stt").reply(200, sttAnalytics);

      const result = await context.client.analytics.getSTTAnalytics();
      expect(result).toEqual(sttAnalytics);
    });
  });

  describe("getTTSAnalytics", () => {
    it("should get TTS analytics successfully", async () => {
      const ttsAnalytics = [
        {
          provider: "google",
          total_syntheses: 80,
          successful_syntheses: 78,
          failed_syntheses: 2,
          voice_id: 1,
          voice_usage_count: 50,
          avg_processing_time_seconds: 1.2,
          total_audio_duration_seconds: 400,
          total_output_size_bytes: 819200,
          text_length_stats: { avg: 150, max: 500, min: 10 },
          output_format_stats: { mp3: 70, wav: 10 },
          error_stats: { timeout: 1, invalid_text: 1 },
          id: "tts-1",
          created_at: "2023-06-01T00:00:00Z",
          updated_at: null,
        },
      ];

      context.mock.onGet("/analytics/tts").reply(200, ttsAnalytics);

      const result = await context.client.analytics.getTTSAnalytics();
      expect(result).toEqual(ttsAnalytics);
    });
  });

  describe("getMyAnalyticsEvents", () => {
    it("should get analytics events successfully", async () => {
      const events = {
        items: [
          {
            event_type: "user_login",
            user_id: "user-123",
            session_id: "session-456",
            event_data: { login_method: "email" },
            event_metadata: { user_agent: "Mozilla/5.0" },
            processing_time_ms: 50,
            response_time_ms: 100,
            id: "event-1",
            created_at: "2023-06-15T10:30:00Z",
            event_timestamp: "2023-06-15T10:30:00Z",
          },
        ],
        total: 1,
        page: 1,
        size: 10,
        pages: 1,
      };

      context.mock.onGet("/analytics/events").reply(200, events);

      const result = await context.client.analytics.getMyAnalyticsEvents({
        event_type: "user_login",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
      });

      expect(result).toEqual(events);
    });
  });

  describe("getMyRealTimeMetrics", () => {
    it("should get real-time metrics successfully", async () => {
      const metrics = [
        {
          metric_name: "active_sessions",
          metric_value: 25,
          metric_unit: "count",
          user_id: "user-123",
          session_id: null,
          metric_metadata: { service: "tts" },
          id: "metric-1",
          created_at: "2023-06-15T10:30:00Z",
          expires_at: "2023-06-16T10:30:00Z",
        },
      ];

      context.mock.onGet("/analytics/metrics/realtime").reply(200, metrics);

      const result = await context.client.analytics.getMyRealTimeMetrics({
        metric_name: "active_sessions",
        limit: 10,
      });

      expect(result).toEqual(metrics);
    });
  });

  describe("setRealTimeMetric", () => {
    it("should set real-time metric successfully", async () => {
      const metricData = {
        metric_name: "processing_queue",
        metric_value: 5,
        metric_unit: "count",
        user_id: "user-123",
        session_id: "session-456",
        metric_metadata: { service: "stt" },
        expires_in_hours: 24,
      };

      const metricResponse = {
        ...metricData,
        id: "metric-2",
        created_at: "2023-06-15T10:30:00Z",
        expires_at: "2023-06-16T10:30:00Z",
      };

      context.mock
        .onPost("/analytics/metrics/realtime")
        .reply(200, metricResponse);

      const result =
        await context.client.analytics.setRealTimeMetric(metricData);
      expect(result).toEqual(metricResponse);
    });
  });
});
