import {
  createTestContext,
  mockToken,
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
      context.mock.onPost("/auth/register").reply(200, mockUser);

      const user = await context.client.auth.register({
        email: "test@example.com",
        username: "testuser",
        password: "securepassword",
        first_name: "Test",
        last_name: "User",
      });

      expect(user).toEqual(mockUser);
    });

    it("should handle registration failure with existing user", async () => {
      context.mock
        .onPost("/auth/register")
        .reply(400, { message: "User already exists" });

      await expect(
        context.client.auth.register({
          email: "test@example.com",
          username: "testuser",
          password: "securepassword",
        }),
      ).rejects.toThrow();
    });

    it("should handle validation errors", async () => {
      context.mock
        .onPost("/auth/register")
        .reply(422, { message: "Invalid email format" });

      await expect(
        context.client.auth.register({
          email: "invalid-email",
          username: "testuser",
          password: "securepassword",
        }),
      ).rejects.toThrow();
    });
  });

  describe("login", () => {
    it("should login and set token automatically", async () => {
      context.mock.onPost("/auth/login").reply(200, mockToken);

      const response = await context.client.auth.login({
        email: "test@example.com",
        password: "securepassword",
      });

      expect(response).toEqual(mockToken);
      expect(context.client.getAccessToken()).toBe("test-access-token");
      expect(context.client.getRefreshToken()).toBe("test-refresh-token");
    });

    it("should handle login failure with invalid credentials", async () => {
      context.mock
        .onPost("/auth/login")
        .reply(401, { message: "Invalid credentials" });

      await expect(
        context.client.auth.login({
          email: "test@example.com",
          password: "wrongpassword",
        }),
      ).rejects.toThrow("Authentication failed");
    });

    it("should handle server errors during login", async () => {
      context.mock
        .onPost("/auth/login")
        .reply(500, { message: "Internal server error" });

      await expect(
        context.client.auth.login({
          email: "test@example.com",
          password: "password",
        }),
      ).rejects.toThrow();
    });
  });

  describe("refreshToken", () => {
    it("should refresh token successfully", async () => {
      context.mock.onPost("/auth/refresh").reply(200, mockToken);

      const response = await context.client.auth.refreshToken({
        refresh_token: "old-refresh-token",
      });

      expect(response).toEqual(mockToken);
      expect(context.client.getAccessToken()).toBe("test-access-token");
      expect(context.client.getRefreshToken()).toBe("test-refresh-token");
    });

    it("should handle refresh token failure", async () => {
      context.mock
        .onPost("/auth/refresh")
        .reply(401, { message: "Invalid refresh token" });

      await expect(
        context.client.auth.refreshToken({
          refresh_token: "invalid-refresh-token",
        }),
      ).rejects.toThrow("Authentication failed");
    });
  });

  describe("getCurrentUser", () => {
    it("should get current user successfully", async () => {
      context.mock.onGet("/auth/me").reply(200, mockUser);

      const user = await context.client.auth.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it("should handle unauthorized access", async () => {
      context.mock.onGet("/auth/me").reply(401, { message: "Unauthorized" });

      await expect(context.client.auth.getCurrentUser()).rejects.toThrow(
        "Authentication failed",
      );
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      context.mock.onPost("/auth/logout").reply(200, {});

      // Set tokens first
      context.client.setAccessToken("test-token");
      context.client.setRefreshToken("test-refresh-token");

      await context.client.auth.logout();

      // Tokens should be cleared after logout
      expect(context.client.getAccessToken()).toBeUndefined();
      expect(context.client.getRefreshToken()).toBeUndefined();
    });
  });
});
