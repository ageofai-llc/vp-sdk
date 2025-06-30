export interface HealthResponse {
  status: string;
  cpu_usage: number;
  memory_usage: number;
  memory_available_mb: number;
  process_cpu_usage: number;
  process_memory_mb: number;
  active_workers: number;
  pending_workers: number;
  max_workers: number;
  active_rooms: number;
  uptime_seconds: number;
  error_rate: number;
  is_accepting_new_workers: boolean;
}

export interface SessionOut {
  session_id: number;
  agent_id: number;
  room_name: string;
  livekit_token: string;
  status: string;
  created_at: string;
  ended_at?: string | null;
}

export interface TextMessage {
  content: string;
  metadata?: Record<string, any> | null;
}

export interface AgentResponse {
  content: string;
  agent_id: number;
  session_id: number;
  timestamp: string;
  metadata?: Record<string, any> | null;
}

export interface AgentControl {
  command: string;
  params?: Record<string, any> | null;
}

export interface ApiCreateRoomRequest {
  user_id: string;
  initial_prompt?: string;
  participant_name?: string | null;
  room_name?: string | null;
}

export interface ConnectionDetails {
  server_url: string;
  room_name: string;
  participant_token: string;
  participant_name: string;
}

export interface EndSessionRequest {
  room_name: string;
}

export interface AgentCreate {
  name: string;
  description?: string | null;
  initial_prompt: string;
  voice_id?: string;
  llm_model?: string;
  stt_model?: string;
  tools?: string[];
}

export interface AgentOut {
  id: number;
  user_id: number;
  name: string;
  description?: string | null;
  initial_prompt: string;
  voice_id: string;
  llm_model: string;
  stt_model: string;
  tools: string[];
  created_at: string;
  updated_at: string;
  is_public: boolean;
  is_template: boolean;
  template_id?: number | null;
  current_version: string;
  total_sessions: number;
  total_duration_minutes: number;
  average_satisfaction?: number | null;
}

export interface AgentAnalyticsOut {
  [x: string]: any;
  agent_id: number;
  total_sessions: number;
  total_duration_minutes: number;
  average_satisfaction?: number | null;
  recent_sessions_count: number;
  recent_duration_minutes: number;
  recent_satisfaction?: number | null;
}

export interface AgentTemplateCreate {
  name: string;
  description: string;
  category: string;
  initial_prompt: string;
  voice_id: string;
  llm_model: string;
  stt_model: string;
  tools?: string[];
  is_public?: boolean;
}

export interface AgentTemplateOut {
  id: number;
  name: string;
  description: string;
  category: string;
  initial_prompt: string;
  voice_id: string;
  llm_model: string;
  stt_model: string;
  tools: string[];
  is_public: boolean;
  created_by?: number | null;
  created_at: string;
  usage_count: number;
}

export interface AgentVersionCreate {
  version_number: string;
  name: string;
  description?: string | null;
  initial_prompt: string;
  voice_id: string;
  llm_model: string;
  stt_model: string;
  tools?: string[];
}

export interface AgentVersionOut {
  id: number;
  agent_id: number;
  version_number: string;
  name: string;
  description?: string | null;
  initial_prompt: string;
  voice_id: string;
  llm_model: string;
  stt_model: string;
  tools: string[];
  created_at: string;
  is_active: boolean;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserOut {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Body_login_for_access_token_token_post {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
}

export interface WebhookCreate {
  url: string;
  event: string;
  description?: string | null;
}

export interface WebhookOut {
  id: number;
  user_id: number;
  url: string;
  event: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface APIKeyCreate {
  name?: string | null;
}

export interface APIKeyOut {
  id: number;
  key: string;
  name?: string | null;
  created_at: string;
  is_active: boolean;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface UserProfile {
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}
