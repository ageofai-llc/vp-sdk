import MockAdapter from "axios-mock-adapter";
import { VpSdk } from "../../src";
import axiosInstance from "../../src/axios";
import { HttpClient } from "../../src/utils/http";

export interface TestContext {
  client: VpSdk;
  mock: MockAdapter;
}

export const createTestContext = (): TestContext => {
  const mock = new MockAdapter(axiosInstance);
  const httpClient = new HttpClient(axiosInstance);
  const client = new VpSdk(httpClient);

  return { client, mock };
};

export const setupAuthenticatedClient = async (
  client: VpSdk,
  mock: MockAdapter,
): Promise<void> => {
  mock
    .onPost("/token")
    .reply(200, { access_token: "test-token", token_type: "bearer" });

  await client.auth.login({ username: "testuser", password: "securepassword" });
};

// Mock data
export const mockUser = {
  email: "test@example.com",
  username: "testuser",
  first_name: "Test",
  last_name: "User",
  id: "user-123",
  is_active: true,
  is_suspended: false,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: null,
};

export const mockToken = {
  access_token: "test-access-token",
  refresh_token: "test-refresh-token",
  token_type: "bearer",
};

export const mockVoice = {
  id: 1,
  name: "Test Voice",
  description: "A test voice",
  gender: "female",
  language: "en-US",
  accent: "US",
  is_premium: false,
  avatar: null,
  preview_text: "Hello, this is a test voice",
  preview_audio_base64: null,
};

export const mockSynthesis = {
  voice_id: 1,
  input_text: "Test synthesis",
  output_format: "mp3",
  speaking_rate: null,
  pitch: null,
  volume_gain_db: null,
  id: 1,
  user_id: "user-123",
  input_file_path: null,
  input_file_type: null,
  output_file_path: "/path/to/file.mp3",
  file_size: 1024,
  duration: 5.5,
  status: "COMPLETED",
  processing_time: 2.1,
  error_message: null,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: null,
};

export const mockTranscription = {
  provider_used: "PYWHISPERCPP",
  id: 1,
  user_id: "user-123",
  original_filename: "audio.wav",
  file_path: "/path/to/file.wav",
  file_size: 2048,
  duration: 10.5,
  mime_type: "audio/wav",
  transcription_text: "This is a test transcription",
  confidence_score: 0.95,
  language_detected: "en",
  status: "COMPLETED",
  processing_time: 3.2,
  error_message: null,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: null,
  segments: [],
};

export const mockAccountSummary = {
  account: {
    current_balance: 100.0,
    total_deposited: 200.0,
    total_spent: 100.0,
    total_refunded: 0.0,
    is_active: true,
    is_suspended: false,
    last_activity: "2023-01-01T00:00:00Z",
  },
  pricing: {
    stt_cost_per_second: 0.01,
    tts_cost_per_character: 0.001,
    text_extraction_cost_per_page: 0.1,
    storage_cost_per_mb: 0.05,
    api_call_cost: 0.001,
    minimum_deposit: 10.0,
  },
  recent_activity: {
    total_cost_30_days: 50.0,
    total_transactions_30_days: 25,
    usage_breakdown: {
      stt: 30.0,
      tts: 20.0,
    },
  },
  recent_transactions: [],
};

export const mockNotification = {
  title: "Test Notification",
  message: "This is a test notification",
  notification_type: "info",
  id: "notif-123",
  user_id: "user-123",
  status: "active",
  is_read: false,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: null,
};

export const mockRAGDocument = {
  name: "Test Document",
  description: "A test document",
  id: "doc-123",
  file_path: "/path/to/document.pdf",
  file_size: 10240,
  file_type: "application/pdf",
  extracted_text: "This is extracted text from the document",
  extraction_status: "completed",
  extraction_error: null,
  document_metadata: null,
  is_active: true,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: null,
  owner_id: "user-123",
};

export const mockAPIKey = {
  id: "key-123",
  name: "Test API Key",
  description: "A test API key",
  key_prefix: "sk_test",
  scopes: ["agent:connect"],
  permissions: ["read"],
  usage_count: "0",
  last_used_at: null,
  expires_at: "2024-01-01T00:00:00Z",
  is_active: true,
  is_revoked: false,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: null,
};

export const mockAgent = {
  name: "Test Agent",
  description: "A test agent",
  system_prompt: "You are a helpful assistant",
  voice_id: "voice-123",
  sound_effects_enabled: true,
  sound_effect_file: null,
  is_public: false,
  max_concurrent_connections: 10,
  id: "agent-123",
  owner_id: "user-123",
  status: "active",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: null,
};

export const expectUnauthorizedError = async (
  promise: Promise<any>,
): Promise<void> => {
  await expect(promise).rejects.toThrow();
};
