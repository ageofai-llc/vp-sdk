import type {
  AccountSummary,
  CostEstimationRequest,
  CostEstimationResponse,
  DepositRequest,
  DepositResponse,
  PaginatedTransactionsResponse,
  PaginatedUsageRecordsResponse,
  RefundRequest,
  RefundResponse,
  UsageSummary,
} from "../types";
import type { HttpClient } from "../utils/http";

export class CreditsClient {
  constructor(private http: HttpClient) {}

  async getAccountSummary(): Promise<AccountSummary> {
    return this.http.get<AccountSummary>("/credits/account");
  }

  async getAccountBalance(): Promise<any> {
    return this.http.get("/credits/account/balance");
  }

  async depositFunds(depositRequest: DepositRequest): Promise<DepositResponse> {
    return this.http.post<DepositResponse>("/credits/deposit", depositRequest);
  }

  async estimateUsageCost(
    estimationRequest: CostEstimationRequest,
  ): Promise<CostEstimationResponse> {
    return this.http.post<CostEstimationResponse>(
      "/credits/usage/estimate",
      estimationRequest,
    );
  }

  async refundUsage(refundRequest: RefundRequest): Promise<RefundResponse> {
    return this.http.post<RefundResponse>("/credits/refund", refundRequest);
  }

  async getTransactions(params?: {
    transaction_type?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedTransactionsResponse> {
    return this.http.get<PaginatedTransactionsResponse>(
      "/credits/transactions",
      { params },
    );
  }

  async getUsageRecords(params?: {
    usage_type?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedUsageRecordsResponse> {
    return this.http.get<PaginatedUsageRecordsResponse>(
      "/credits/usage/records",
      { params },
    );
  }

  async getUsageAnalytics(params?: {
    start_date?: string;
    end_date?: string;
    usage_type?: string;
  }): Promise<any[]> {
    return this.http.get<any[]>("/credits/usage/analytics", { params });
  }

  async getUsageSummary(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<UsageSummary> {
    return this.http.get<UsageSummary>("/credits/usage/summary", { params });
  }
}
