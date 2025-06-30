import {
  createTestContext,
  mockUser,
  type TestContext,
} from "../../setup/test-utils";

describe("AuthClient", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      context.mock.onPost("/register").reply(200, mockUser);

      const user = await context.client.auth.register({
        username: "testuser",
        email: "test@example.com",
        password: "securepassword",
      });

      expect(user).toEqual(mockUser);
    });

    it("should handle registration failure with existing user", async () => {
      context.mock
        .onPost("/register")
        .reply(400, { message: "User already exists" });

      await expect(
        context.client.auth.register({
          username: "testuser",
          email: "test@example.com",
          password: "securepassword",
        }),
      ).rejects.toThrow();
    });

    it("should handle validation errors", async () => {
      context.mock
        .onPost("/register")
        .reply(422, { message: "Invalid email format" });

      await expect(
        context.client.auth.register({
          username: "testuser",
          email: "invalid-email",
          password: "securepassword",
        }),
      ).rejects.toThrow();
    });
  });

  describe("login", () => {
    it("should login and set token automatically", async () => {
      const mockTokenResponse = {
        access_token: "test-token",
        token_type: "bearer",
      };
      context.mock.onPost("/token").reply(200, mockTokenResponse);

      const response = await context.client.auth.login(
        "testuser",
        "securepassword",
      );
      expect(response).toEqual(mockTokenResponse);

      const sessionResponse = { session_id: 1, agent_id: 1 };
      context.mock
        .onPost("/sessions/1")
        .reply(200, sessionResponse, { Authorization: "Bearer test-token" });

      const session = await context.client.sessions.startSession(1);
      expect(session).toEqual(sessionResponse);
    });

    it("should handle login failure with invalid credentials", async () => {
      context.mock
        .onPost("/token")
        .reply(401, { message: "Invalid credentials" });

      await expect(
        context.client.auth.login("testuser", "wrongpassword"),
      ).rejects.toThrow("Authentication failed");
    });

    it("should handle server errors during login", async () => {
      context.mock
        .onPost("/token")
        .reply(500, { message: "Internal server error" });

      await expect(
        context.client.auth.login("testuser", "password"),
      ).rejects.toThrow();
    });
  });
});
