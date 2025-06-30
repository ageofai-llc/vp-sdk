import { ScoreexlVoiceSdk } from "../../src";
import MockAdapter from "axios-mock-adapter";
import { createMockAdapter } from "./jest.setup";
import axios from "axios";
import { HttpClient } from "../../src/utils/http";
import axiosInstance from "../../src/axios";

export interface TestContext {
  client: ScoreexlVoiceSdk;
  mock: MockAdapter;
}

export const createTestContext = (): TestContext => {
  const mock = new MockAdapter(axiosInstance);
  const httpClient = new HttpClient(axiosInstance);
  const client = new ScoreexlVoiceSdk(httpClient);

  return { client, mock };
};

export const setupAuthenticatedClient = async (
  client: ScoreexlVoiceSdk,
  mock: MockAdapter
): Promise<void> => {
  mock
    .onPost("/token")
    .reply(200, { access_token: "test-token", token_type: "bearer" });

  await client.auth.login("testuser", "securepassword");
};

export const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  created_at: "2025-06-25",
  updated_at: "2025-06-25",
};

export const mockAgent = {
  id: 1,
  name: "Test Agent",
  initial_prompt: "You are a helpful assistant",
};

export const mockSession = {
  session_id: 1,
  agent_id: 1,
  room_name: "test-room",
  livekit_token: "token",
};

export const expectUnauthorizedError = async (
  promise: Promise<any>
): Promise<void> => {
  await expect(promise).rejects.toThrow();
};
