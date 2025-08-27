export interface UserCreate {
  email: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  password: string;
}

export interface UserLogin {
  email?: string | null;
  username?: string | null;
  password: string;
}

export interface UserResponse {
  email: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  id: string;
  is_active: boolean;
  is_suspended: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TokenRefresh {
  refresh_token: string;
}

export interface UserUpdate {
  email?: string | null;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  password?: string | null;
}

export interface VoicePublic {
  id: number;
  name: string;
  description?: string | null;
  gender?: string | null;
  language: string;
  accent?: string | null;
  is_premium: boolean;
  avatar?: string | null;
  preview_text?: string | null;
  preview_audio_base64?: string | null;
}

export interface SynthesisRequest {
  voice_id: number;
  input_text?: string | null;
  input_file?: string | null;
  output_format?: string;
  speaking_rate?: number | null;
  pitch?: number | null;
  volume_gain_db?: number | null;
}

export interface SynthesisResponse {
  voice_id: number;
  input_text: string;
  output_format: string;
  speaking_rate?: number | null;
  pitch?: number | null;
  volume_gain_db?: number | null;
  id: number;
  user_id: string;
  input_file_path?: string | null;
  input_file_type?: string | null;
  output_file_path?: string | null;
  file_size?: number | null;
  duration?: number | null;
  status: SynthesisStatusEnum;
  processing_time?: number | null;
  error_message?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface SynthesisListResponse {
  syntheses: SynthesisResponse[];
  total: number;
  page: number;
  per_page: number;
}

export interface SynthesisStatsResponse {
  total_syntheses: number;
  completed_syntheses: number;
  failed_syntheses: number;
  processing_syntheses: number;
  success_rate: number;
  provider_usage: Record<string, any>;
  total_duration: number;
  average_processing_time: number;
}

export interface TranscriptionResponse {
  provider_used: TranscriptionProviderEnum;
  id: number;
  user_id: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  duration?: number | null;
  mime_type: string;
  transcription_text?: string | null;
  confidence_score?: number | null;
  language_detected?: string | null;
  status: TranscriptionStatusEnum;
  processing_time?: number | null;
  error_message?: string | null;
  created_at: string;
  updated_at?: string | null;
  segments: TranscriptionSegmentResponse[];
}

export interface TranscriptionListResponse {
  transcriptions: TranscriptionResponse[];
  total: number;
  page: number;
  per_page: number;
}

export interface TranscriptionStatusResponse {
  id: number;
  status: TranscriptionStatusEnum;
  progress?: number | null;
  estimated_time_remaining?: number | null;
}

export interface TranscriptionSegmentResponse {
  start_time: number;
  end_time: number;
  text: string;
  confidence?: number | null;
  id: number;
  transcription_id: number;
  created_at: string;
}

export interface AccountSummary {
  account: AccountInfo;
  pricing: PricingInfo;
  recent_activity: RecentActivity;
  recent_transactions: TransactionSummary[];
}

export interface AccountInfo {
  current_balance: number;
  total_deposited: number;
  total_spent: number;
  total_refunded: number;
  is_active: boolean;
  is_suspended: boolean;
  last_activity?: string | null;
}

export interface PricingInfo {
  stt_cost_per_second: number;
  tts_cost_per_character: number;
  text_extraction_cost_per_page: number;
  storage_cost_per_mb: number;
  api_call_cost: number;
  minimum_deposit: number;
}

export interface RecentActivity {
  total_cost_30_days: number;
  total_transactions_30_days: number;
  usage_breakdown: Record<string, number>;
}

export interface TransactionSummary {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
}

export interface DepositRequest {
  amount: number | string;
  payment_method: PaymentMethodEnum;
  payment_reference?: string | null;
  payment_provider?: string | null;
  description?: string | null;
  metadata?: Record<string, any> | null;
}

export interface DepositResponse {
  transaction: CreditTransactionResponse;
  new_balance: string;
  message: string;
}

export interface CreditTransactionResponse {
  transaction_type: TransactionTypeEnum;
  status: TransactionStatusEnum;
  amount: string;
  balance_before: string;
  balance_after: string;
  payment_method?: PaymentMethodEnum | null;
  payment_reference?: string | null;
  payment_provider?: string | null;
  description?: string | null;
  transaction_metadata?: Record<string, any> | null;
  id: string;
  account_id: string;
  user_id: string;
  created_at: string;
  processed_at?: string | null;
  updated_at?: string | null;
}

export interface CostEstimationRequest {
  usage_type: UsageTypeEnum;
  units: number;
  user_id: string;
}

export interface CostEstimationResponse {
  usage_type: UsageTypeEnum;
  units: number;
  cost_per_unit: number;
  estimated_cost: number;
  currency?: string;
}

export interface RefundRequest {
  usage_record_id: string;
  reason: string;
  transaction_metadata?: Record<string, any> | null;
}

export interface RefundResponse {
  transaction: CreditTransactionResponse;
  new_balance: string;
  message: string;
}

export interface PaginatedTransactionsResponse {
  items: CreditTransactionResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginatedUsageRecordsResponse {
  items: UsageRecordResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface UsageRecordResponse {
  usage_type: UsageTypeEnum;
  service_provider?: string | null;
  units_consumed: number;
  cost_per_unit: string;
  total_cost: string;
  resource_id?: string | null;
  resource_size?: number | null;
  resource_duration?: number | null;
  resource_metadata?: Record<string, any> | null;
  processing_time_ms?: number | null;
  success: boolean;
  error_message?: string | null;
  id: string;
  account_id: string;
  user_id: string;
  created_at: string;
  usage_date: string;
}

export interface UsageSummary {
  total_cost: number;
  total_transactions: number;
  usage_breakdown: UsageBreakdown;
  daily_data: DailyUsageData[];
}

export interface UsageBreakdown {
  stt: STTUsageBreakdown;
  tts: TTSUsageBreakdown;
  text_extraction: TextExtractionUsageBreakdown;
  storage: StorageUsageBreakdown;
  api_calls: APICallsUsageBreakdown;
}

export interface STTUsageBreakdown {
  cost: number;
  transactions: number;
  seconds_processed: number;
}

export interface TTSUsageBreakdown {
  cost: number;
  transactions: number;
  characters_processed: number;
}

export interface TextExtractionUsageBreakdown {
  cost: number;
  transactions: number;
  pages_processed: number;
}

export interface StorageUsageBreakdown {
  cost: number;
  transactions: number;
  mb_used: number;
}

export interface APICallsUsageBreakdown {
  cost: number;
  transactions: number;
  count: number;
}

export interface DailyUsageData {
  date: string;
  total_cost: number;
  total_transactions: number;
  stt_cost: number;
  tts_cost: number;
  text_extraction_cost: number;
  storage_cost: number;
  api_calls_cost: number;
}

export interface AnalyticsSummary {
  users: UserStats;
  stt: STTStats;
  tts: TTSStats;
  activity: ActivityStats;
}

export interface UserStats {
  total: number;
  active_today: number;
}

export interface STTStats {
  total_transcriptions: number;
  successful_transcriptions: number;
  success_rate: number;
}

export interface TTSStats {
  total_syntheses: number;
  successful_syntheses: number;
  success_rate: number;
}

export interface ActivityStats {
  events_today: number;
  avg_response_time_ms?: number | null;
}

export interface UserAnalyticsResponse {
  user_id: string;
  registration_date: string;
  last_login_date?: string | null;
  last_activity_date?: string | null;
  total_logins: number;
  total_sessions: number;
  total_session_duration_minutes: number;
  stt_transcriptions_count: number;
  tts_syntheses_count: number;
  days_active: number;
  consecutive_days_active: number;
  max_consecutive_days: number;
  avg_response_time_ms?: number | null;
  total_processing_time_ms: number;
  id: string;
  created_at: string;
  updated_at?: string | null;
}

export interface UserDailyStatsListResponse {
  user_id: string;
  stats: UserDailyStatsResponse[];
}

export interface UserDailyStatsResponse {
  date: string;
  logins_count: number;
  session_duration_minutes: number;
  is_active: boolean;
  stt_transcriptions_count: number;
  tts_syntheses_count: number;
  api_requests_count: number;
  avg_response_time_ms?: number | null;
  total_processing_time_ms: number;
  id: string;
  user_analytics_id: string;
  created_at: string;
  updated_at?: string | null;
}

export interface STTAnalyticsResponse {
  provider: string;
  total_transcriptions: number;
  successful_transcriptions: number;
  failed_transcriptions: number;
  avg_processing_time_seconds?: number | null;
  avg_confidence_score?: number | null;
  total_audio_duration_seconds: number;
  total_file_size_bytes: number;
  file_type_stats?: Record<string, number> | null;
  language_stats?: Record<string, number> | null;
  error_stats?: Record<string, number> | null;
  id: string;
  created_at: string;
  updated_at?: string | null;
}

export interface TTSAnalyticsResponse {
  provider: string;
  total_syntheses: number;
  successful_syntheses: number;
  failed_syntheses: number;
  voice_id?: number | null;
  voice_usage_count: number;
  avg_processing_time_seconds?: number | null;
  total_audio_duration_seconds: number;
  total_output_size_bytes: number;
  text_length_stats?: Record<string, any> | null;
  output_format_stats?: Record<string, number> | null;
  error_stats?: Record<string, number> | null;
  id: string;
  created_at: string;
  updated_at?: string | null;
}

export interface AnalyticsEventResponse {
  event_type: AnalyticsEventTypeEnum;
  user_id?: string | null;
  session_id?: string | null;
  event_data?: Record<string, any> | null;
  event_metadata?: Record<string, any> | null;
  processing_time_ms?: number | null;
  response_time_ms?: number | null;
  id: string;
  created_at: string;
  event_timestamp: string;
}

export interface AnalyticsEventsResponse {
  items: AnalyticsEventResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface RealTimeMetricsCreate {
  metric_name: string;
  metric_value: number;
  metric_unit?: string | null;
  user_id?: string | null;
  session_id?: string | null;
  // metric_metadata?: Record<string, any> | null;
  metric_metadata?: {
    [key: string]: string | number | boolean | null;
  };
  expires_in_hours?: number;
}

export interface RealTimeMetricsResponse {
  metric_name: string;
  metric_value: number;
  metric_unit?: string | null;
  user_id?: string | null;
  session_id?: string | null;
  metric_metadata?: Record<string, any> | null;
  id: string;
  created_at: string;
  expires_at?: string | null;
}

export interface NotificationResponse {
  title: string;
  message: string;
  notification_type: string;
  id: string;
  user_id: string;
  status: NotificationStatusEnum;
  is_read: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface RAGDocumentUploadResponse {
  document_id: string;
  message: string;
  extraction_status: string;
}

export interface RAGDocumentResponse {
  name: string;
  description?: string | null;
  id: string;
  file_path: string;
  file_size: number;
  file_type: string;
  extracted_text?: string | null;
  extraction_status: string;
  extraction_error?: string | null;
  document_metadata?: Record<string, any> | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
  owner_id: string;
}

export interface RAGDocumentListResponse {
  documents: RAGDocumentResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface RAGDocumentUpdate {
  name?: string | null;
  description?: string | null;
  is_active?: boolean | null;
}

export interface RAGQueryCreate {
  query_text: string;
}

export interface RAGQueryResult {
  query_id: string;
  response_text: string;
  source_documents: string[];
  confidence_score?: string | null;
  processing_time_ms: number;
  tokens_used?: number | null;
}

export interface RAGQueryResponse {
  query_text: string;
  id: string;
  agent_id: string;
  user_id: string;
  response_text?: string | null;
  source_documents?: string[] | null;
  confidence_score?: string | null;
  processing_time_ms?: number | null;
  tokens_used?: number | null;
  status: string;
  error_message?: string | null;
  created_at: string;
  completed_at?: string | null;
}

export interface RAGQueryListResponse {
  queries: RAGQueryResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface RAGStats {
  total_documents: number;
  active_documents: number;
  total_queries: number;
  successful_queries: number;
  failed_queries: number;
  avg_processing_time_ms?: number | null;
  total_tokens_used?: number | null;
}

export interface AgentRAGDocumentCreate {
  rag_prompt?: string | null;
  is_active?: boolean;
  priority?: number;
  document_id: string;
}

export interface AgentRAGDocumentResponse {
  rag_prompt?: string | null;
  is_active: boolean;
  priority: number;
  id: string;
  agent_id: string;
  document_id: string;
  created_at: string;
  updated_at?: string | null;
  document: RAGDocumentResponse;
}

export interface AgentRAGDocumentListResponse {
  documents: AgentRAGDocumentResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface AgentRAGDocumentUpdate {
  rag_prompt?: string | null;
  is_active?: boolean | null;
  priority?: number | null;
}

export interface DocumentAgentListResponse {
  agents: DocumentAgentResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface DocumentAgentResponse {
  rag_prompt?: string | null;
  is_active: boolean;
  priority: number;
  id: string;
  agent_id: string;
  document_id: string;
  created_at: string;
  updated_at?: string | null;
  agent_name: string;
  agent_description?: string | null;
  agent_is_public: boolean;
  agent_status: string;
}

export interface APIKeyCreate {
  name: string;
  description?: string | null;
  scopes?: string[];
  expires_in_days?: number | null;
}

export interface APIKeyCreateResponse {
  api_key: APIKeyResponse;
  key: string;
  message?: string;
}

export interface APIKeyListResponse {
  keys: APIKeyResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface APIKeyResponse {
  id: string;
  name: string;
  description?: string | null;
  key_prefix: string;
  scopes: string[];
  permissions: string[];
  usage_count: string;
  last_used_at?: string | null;
  expires_at?: string | null;
  is_active: boolean;
  is_revoked: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface APIKeyRevoke {
  reason?: string | null;
}

export interface APIKeyUpdate {
  name?: string | null;
  description?: string | null;
  scopes?: string[] | null;
  is_active?: boolean | null;
}

export interface AvailableScopesResponse {
  scopes: ScopeInfo[];
}

export interface ScopeInfo {
  scope: string;
  description: string;
}

export interface AgentCreate {
  name: string;
  description?: string | null;
  system_prompt: string;
  voice_id: string;
  sound_effects_enabled?: boolean;
  sound_effect_file?: string | null;
  is_public?: boolean;
  max_concurrent_connections?: number;
}

export interface AgentListResponse {
  agents: AgentResponse[];
  total: number;
  page: number;
  per_page: number;
}

export interface AgentResponse {
  name: string;
  description?: string | null;
  system_prompt: string;
  voice_id: string;
  sound_effects_enabled: boolean;
  sound_effect_file?: string | null;
  is_public: boolean;
  max_concurrent_connections: number;
  id: string;
  owner_id: string;
  status: AgentStatus;
  created_at: string;
  updated_at?: string | null;
}

export interface AgentUpdate {
  name?: string | null;
  description?: string | null;
  system_prompt?: string | null;
  voice_id?: string | null;
  sound_effects_enabled?: boolean | null;
  sound_effect_file?: string | null;
  is_public?: boolean | null;
  max_concurrent_connections?: number | null;
  status?: AgentStatus | null;
}

export interface AgentStats {
  total_connections: number;
  active_connections: number;
  total_messages_sent: number;
  total_messages_received: number;
  total_duration: number;
  webhooks_count: number;
  last_activity?: string | null;
  rag_queries_count: number;
  rag_successful_queries: number;
  rag_failed_queries: number;
  rag_total_tokens_used: number;
  rag_documents_count: number;
  rag_last_query?: string | null;
}

export interface WebhookCreate {
  name: string;
  url: string;
  event_types: WebhookEventType[];
  headers?: Record<string, string> | null;
  is_active?: boolean;
  retry_count?: number;
  timeout_seconds?: number;
}

export interface WebhookResponse {
  name: string;
  url: string;
  event_types: WebhookEventType[];
  headers?: Record<string, string> | null;
  is_active: boolean;
  retry_count: number;
  timeout_seconds: number;
  id: string;
  agent_id: string;
  created_at: string;
  updated_at?: string | null;
}

export interface WebhookUpdate {
  name?: string | null;
  url?: string | null;
  event_types?: WebhookEventType[] | null;
  headers?: Record<string, string> | null;
  is_active?: boolean | null;
  retry_count?: number | null;
  timeout_seconds?: number | null;
}

export interface FunctionCallRequest {
  function_name: string;
  parameters: Record<string, any>;
  timeout?: number;
  webhook_url?: string | null;
  metadata?: Record<string, any> | null;
}

export interface FunctionCallResponse {
  call_id: string;
  function_name: string;
  status: string;
  result?: Record<string, any> | null;
  error?: string | null;
  execution_time_ms?: number | null;
  created_at: string;
  completed_at?: string | null;
}

export interface ExternalAPIRequest {
  url: string;
  method?: string;
  headers?: Record<string, string> | null;
  params?: Record<string, any> | null;
  data?: Record<string, any> | null;
  timeout?: number;
  webhook_url?: string | null;
  metadata?: Record<string, any> | null;
}

export interface TTSUsageRequest {
  text: string;
  voice_id?: string | null;
  audio_format?: string;
  quality?: string;
  speed?: number;
  processing_time_ms?: number | null;
  output_duration_seconds?: number | null;
  file_size_bytes?: number | null;
  success?: boolean;
  error_message?: string | null;
}

export interface STTUsageRequest {
  audio_duration_seconds: number;
  file_size_bytes?: number | null;
  transcribed_text?: string | null;
  audio_format?: string;
  sample_rate?: number | null;
  channels?: number;
  language?: string;
  model?: string;
  processing_time_ms?: number | null;
  confidence_score?: number | null;
  success?: boolean;
  error_message?: string | null;
}

export interface AgentUsageRequest {
  agent_id: string;
  session_duration_seconds: number;
  messages_sent?: number;
  messages_received?: number;
  function_calls_made?: number;
  webhooks_triggered?: number;
  total_input_characters?: number;
  total_output_characters?: number;
  voice_mode_duration?: number | null;
  text_mode_duration?: number | null;
  processing_time_ms?: number | null;
  success?: boolean;
  error_message?: string | null;
}

export interface EmbeddingUsageRequest {
  text_inputs: string[];
  model?: string;
  vector_dimensions?: number;
  batch_size?: number | null;
  similarity_calculations?: number;
  processing_time_ms?: number | null;
  success?: boolean;
  error_message?: string | null;
}

export interface RAGUsageRequest {
  query_text: string;
  response_text: string;
  documents_searched: number;
  relevant_documents_found: number;
  vector_searches_performed?: number;
  agent_id?: string | null;
  processing_time_ms?: number | null;
  success?: boolean;
  error_message?: string | null;
}

export interface FunctionCallUsageRequest {
  agent_id: string;
  function_name: string;
  parameters: Record<string, any>;
  result?: Record<string, any> | null;
  execution_time_ms: number;
  success?: boolean;
  error_message?: string | null;
}

export interface VoiceListResponse {
  voices: VoiceOption[];
  total: number;
}

export interface VoiceOption {
  uuid: string;
  name: string;
  display_name: string;
  gender?: string | null;
  language: string;
}

export enum SynthesisStatusEnum {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum TranscriptionStatusEnum {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum TranscriptionProviderEnum {
  PYWHISPERCPP = "PYWHISPERCPP",
  DEEPGRAM = "DEEPGRAM",
  GOOGLE = "GOOGLE",
}

export enum PaymentMethodEnum {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  BANK_TRANSFER = "bank_transfer",
  PAYPAL = "paypal",
  STRIPE = "stripe",
  CRYPTO = "crypto",
  SYSTEM = "system",
}

export enum TransactionTypeEnum {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  CHARGE = "charge",
  REFUND = "refund",
  BONUS = "bonus",
  PENALTY = "penalty",
}

export enum TransactionStatusEnum {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum UsageTypeEnum {
  STT_TRANSCRIPTION = "stt_transcription",
  TTS_SYNTHESIS = "tts_synthesis",
  TEXT_EXTRACTION = "text_extraction",
  FILE_PROCESSING = "file_processing",
  API_CALL = "api_call",
  STORAGE = "storage",
}

export enum NotificationStatusEnum {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  BANNED = "banned",
  DELETED = "deleted",
}

export enum AnalyticsEventTypeEnum {
  USER_REGISTERED = "user_registered",
  USER_LOGIN = "user_login",
  USER_LOGOUT = "user_logout",
  USER_PROFILE_UPDATED = "user_profile_updated",
  USER_PASSWORD_CHANGED = "user_password_changed",
  STT_TRANSCRIPTION_STARTED = "stt_transcription_started",
  STT_TRANSCRIPTION_COMPLETED = "stt_transcription_completed",
  STT_TRANSCRIPTION_FAILED = "stt_transcription_failed",
  STT_FILE_UPLOADED = "stt_file_uploaded",
  TTS_SYNTHESIS_STARTED = "tts_synthesis_started",
  TTS_SYNTHESIS_COMPLETED = "tts_synthesis_completed",
  TTS_SYNTHESIS_FAILED = "tts_synthesis_failed",
  TTS_VOICE_SELECTED = "tts_voice_selected",
  API_REQUEST = "api_request",
  API_ERROR = "api_error",
  SYSTEM_ERROR = "system_error",
  PERFORMANCE_METRIC = "performance_metric",
  NOTIFICATION_SENT = "notification_sent",
  NOTIFICATION_READ = "notification_read",
  NOTIFICATION_DELETED = "notification_deleted",
}

export enum AgentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
}

export enum WebhookEventType {
  AGENT_STARTED = "agent_started",
  AGENT_STOPPED = "agent_stopped",
  USER_CONNECTED = "user_connected",
  USER_DISCONNECTED = "user_disconnected",
  MESSAGE_RECEIVED = "message_received",
  MESSAGE_SENT = "message_sent",
  ERROR_OCCURRED = "error_occurred",
}

export interface SdkConfig {
  baseURL?: string;
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  headers?: Record<string, string>;
}
