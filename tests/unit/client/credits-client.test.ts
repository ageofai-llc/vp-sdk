import { PaymentMethodEnum, UsageTypeEnum } from "../../../src";
import {
  createTestContext,
  mockAccountSummary,
  type TestContext,
} from "../../setup/test-utils";

describe("CreditsClient", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("getAccountSummary", () => {
    it("should get account summary successfully", async () => {
      context.mock.onGet("/credits/account").reply(200, mockAccountSummary);

      const result = await context.client.credits.getAccountSummary();
      expect(result).toEqual(mockAccountSummary);
    });
  });

  describe("getAccountBalance", () => {
    it("should get account balance successfully", async () => {
      const balance = { balance: 100.0, currency: "USD" };
      context.mock.onGet("/credits/account/balance").reply(200, balance);

      const result = await context.client.credits.getAccountBalance();
      expect(result).toEqual(balance);
    });
  });

  describe("depositFunds", () => {
    it("should deposit funds successfully", async () => {
      const depositRequest = {
        amount: 50.0,
        payment_method: PaymentMethodEnum.CREDIT_CARD,
        payment_reference: "ref-123",
        payment_provider: "stripe",
        description: "Test deposit",
      };

      const depositResponse = {
        transaction: {
          transaction_type: "deposit",
          status: "completed",
          amount: "50.00",
          balance_before: "100.00",
          balance_after: "150.00",
          payment_method: "credit_card",
          payment_reference: "ref-123",
          payment_provider: "stripe",
          description: "Test deposit",
          transaction_metadata: null,
          id: "txn-123",
          account_id: "acc-123",
          user_id: "user-123",
          created_at: "2023-06-15T10:30:00Z",
          processed_at: "2023-06-15T10:30:00Z",
          updated_at: null,
        },
        new_balance: "150.00",
        message: "Deposit successful",
      };

      context.mock.onPost("/credits/deposit").reply(200, depositResponse);

      const result = await context.client.credits.depositFunds(depositRequest);
      expect(result).toEqual(depositResponse);
    });
  });

  describe("estimateUsageCost", () => {
    it("should estimate usage cost successfully", async () => {
      const estimationRequest = {
        usage_type: UsageTypeEnum.STT_TRANSCRIPTION,
        units: 300, // seconds
        user_id: "user-123",
      };

      const estimationResponse = {
        usage_type: "stt_transcription",
        units: 300,
        cost_per_unit: 0.01,
        estimated_cost: 3.0,
        currency: "USD",
      };

      context.mock
        .onPost("/credits/usage/estimate")
        .reply(200, estimationResponse);

      const result =
        await context.client.credits.estimateUsageCost(estimationRequest);
      expect(result).toEqual(estimationResponse);
    });
  });

  describe("refundUsage", () => {
    it("should refund usage successfully", async () => {
      const refundRequest = {
        usage_record_id: "usage-123",
        reason: "Incorrect billing",
        transaction_metadata: { note: "Customer requested refund" },
      };

      const refundResponse = {
        transaction: {
          transaction_type: "refund",
          status: "completed",
          amount: "-10.00",
          balance_before: "150.00",
          balance_after: "140.00",
          payment_method: null,
          payment_reference: null,
          payment_provider: null,
          description: "Refund for usage-123",
          transaction_metadata: { note: "Customer requested refund" },
          id: "txn-124",
          account_id: "acc-123",
          user_id: "user-123",
          created_at: "2023-06-15T10:30:00Z",
          processed_at: "2023-06-15T10:30:00Z",
          updated_at: null,
        },
        new_balance: "140.00",
        message: "Refund processed successfully",
      };

      context.mock.onPost("/credits/refund").reply(200, refundResponse);

      const result = await context.client.credits.refundUsage(refundRequest);
      expect(result).toEqual(refundResponse);
    });
  });

  describe("getTransactions", () => {
    it("should get transactions successfully", async () => {
      const transactions = {
        items: [
          {
            transaction_type: "deposit",
            status: "completed",
            amount: "50.00",
            balance_before: "100.00",
            balance_after: "150.00",
            payment_method: "credit_card",
            payment_reference: "ref-123",
            payment_provider: "stripe",
            description: "Test deposit",
            transaction_metadata: null,
            id: "txn-123",
            account_id: "acc-123",
            user_id: "user-123",
            created_at: "2023-06-15T10:30:00Z",
            processed_at: "2023-06-15T10:30:00Z",
            updated_at: null,
          },
        ],
        total: 1,
        page: 1,
        size: 10,
        pages: 1,
      };

      context.mock.onGet("/credits/transactions").reply(200, transactions);

      const result = await context.client.credits.getTransactions({
        transaction_type: "deposit",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
      });

      expect(result).toEqual(transactions);
    });
  });

  describe("getUsageRecords", () => {
    it("should get usage records successfully", async () => {
      const usageRecords = {
        items: [
          {
            usage_type: "stt_transcription",
            service_provider: "pywhispercpp",
            units_consumed: 120,
            cost_per_unit: "0.01",
            total_cost: "1.20",
            resource_id: "transcription-123",
            resource_size: 1024000,
            resource_duration: 120,
            resource_metadata: { language: "en", confidence: 0.95 },
            processing_time_ms: 5000,
            success: true,
            error_message: null,
            id: "usage-123",
            account_id: "acc-123",
            user_id: "user-123",
            created_at: "2023-06-15T10:30:00Z",
            usage_date: "2023-06-15",
          },
        ],
        total: 1,
        page: 1,
        size: 10,
        pages: 1,
      };

      context.mock.onGet("/credits/usage/records").reply(200, usageRecords);

      const result = await context.client.credits.getUsageRecords({
        usage_type: "stt_transcription",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
      });

      expect(result).toEqual(usageRecords);
    });
  });

  describe("getUsageAnalytics", () => {
    it("should get usage analytics successfully", async () => {
      const analytics = [
        {
          date: "2023-06-15",
          stt_seconds_processed: 120,
          stt_cost: "1.20",
          stt_transactions_count: 2,
          tts_characters_processed: 500,
          tts_cost: "0.50",
          tts_transactions_count: 1,
          text_extraction_pages_processed: 0,
          text_extraction_cost: "0.00",
          text_extraction_transactions_count: 0,
          storage_mb_used: 10,
          storage_cost: "0.50",
          api_calls_count: 15,
          api_calls_cost: "0.15",
          total_cost: "2.35",
          total_transactions: 18,
          avg_processing_time_ms: 250,
          success_rate: 100,
          id: "analytics-1",
          user_id: "user-123",
          created_at: "2023-06-15T23:59:59Z",
          updated_at: null,
        },
      ];

      context.mock.onGet("/credits/usage/analytics").reply(200, analytics);

      const result = await context.client.credits.getUsageAnalytics({
        start_date: "2023-06-15",
        end_date: "2023-06-15",
      });

      expect(result).toEqual(analytics);
    });
  });

  describe("getUsageSummary", () => {
    it("should get usage summary successfully", async () => {
      const summary = {
        total_cost: 50.0,
        total_transactions: 100,
        usage_breakdown: {
          stt: { cost: 30.0, transactions: 60, seconds_processed: 3000 },
          tts: { cost: 15.0, transactions: 30, characters_processed: 15000 },
          text_extraction: { cost: 2.0, transactions: 5, pages_processed: 20 },
          storage: { cost: 2.5, transactions: 3, mb_used: 50 },
          api_calls: { cost: 0.5, transactions: 2, count: 50 },
        },
        daily_data: [
          {
            date: "2023-06-15",
            total_cost: 2.35,
            total_transactions: 18,
            stt_cost: 1.2,
            tts_cost: 0.5,
            text_extraction_cost: 0.0,
            storage_cost: 0.5,
            api_calls_cost: 0.15,
          },
        ],
      };

      context.mock.onGet("/credits/usage/summary").reply(200, summary);

      const result = await context.client.credits.getUsageSummary({
        start_date: "2023-06-01",
        end_date: "2023-06-30",
      });

      expect(result).toEqual(summary);
    });
  });
});
