import type {
  AnalyticsEventsResponse,
  AnalyticsSummary,
  RealTimeMetricsCreate,
  RealTimeMetricsResponse,
  STTAnalyticsResponse,
  TTSAnalyticsResponse,
  UserAnalyticsResponse,
  UserDailyStatsListResponse,
} from "../types";
import type { HttpClient } from "../utils/http";

export class AnalyticsClient {
  constructor(private http: HttpClient) {}

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>("/analytics/summary");
  }

  async getUserAnalytics(userId: string): Promise<UserAnalyticsResponse> {
    return this.http.get<UserAnalyticsResponse>(`/analytics/users/${userId}`);
  }

  async getUserDailyStats(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<UserDailyStatsListResponse> {
    return this.http.get<UserDailyStatsListResponse>(
      `/analytics/users/${userId}/daily-stats`,
      {
        params: { start_date: startDate, end_date: endDate },
      },
    );
  }

  async getSTTAnalytics(provider?: string): Promise<STTAnalyticsResponse[]> {
    return this.http.get<STTAnalyticsResponse[]>("/analytics/stt", {
      params: { provider },
    });
  }

  async getTTSAnalytics(provider?: string): Promise<TTSAnalyticsResponse[]> {
    return this.http.get<TTSAnalyticsResponse[]>("/analytics/tts", {
      params: { provider },
    });
  }

  async getMyAnalyticsEvents(params?: {
    event_type?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<AnalyticsEventsResponse> {
    return this.http.get<AnalyticsEventsResponse>("/analytics/events", {
      params,
    });
  }

  async getMyRealTimeMetrics(params?: {
    metric_name?: string;
    limit?: number;
  }): Promise<RealTimeMetricsResponse[]> {
    return this.http.get<RealTimeMetricsResponse[]>(
      "/analytics/metrics/realtime",
      { params },
    );
  }

  async setRealTimeMetric(
    metricData: RealTimeMetricsCreate,
  ): Promise<RealTimeMetricsResponse> {
    return this.http.post<RealTimeMetricsResponse>(
      "/analytics/metrics/realtime",
      metricData,
    );
  }
}
