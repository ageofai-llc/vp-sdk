import {
  createTestContext,
  mockUser,
  setupAuthenticatedClient,
  type TestContext,
} from "../../setup/test-utils";

describe("UserClient", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = createTestContext();
    await setupAuthenticatedClient(context.client, context.mock);
  });

  afterEach(() => {
    context.mock.reset();
  });
  describe("getMyProfile", () => {
    it("should get user profile successfully", async () => {
      context.mock.onGet("/users/me").reply(200, mockUser);

      const user = await context.client.users.getMyProfile();
      expect(user).toEqual(mockUser);
    });

    it("should handle unauthorized access", async () => {
      context.mock.onGet("/users/me").reply(401, { message: "Unauthorized" });

      await expect(context.client.users.getMyProfile()).rejects.toThrow(
        "Authentication failed",
      );
    });
  });

  describe("updateMyProfile", () => {
    it("should update user profile successfully", async () => {
      const updatedUser = { ...mockUser, first_name: "Updated" };
      context.mock.onPut("/users/me").reply(200, updatedUser);

      const user = await context.client.users.updateMyProfile({
        first_name: "Updated",
      });

      expect(user).toEqual(updatedUser);
    });

    it("should handle validation errors", async () => {
      context.mock
        .onPut("/users/me")
        .reply(422, { message: "Invalid email format" });

      await expect(
        context.client.users.updateMyProfile({
          email: "invalid-email",
        }),
      ).rejects.toThrow();
    });
  });

  describe("deleteMyAccount", () => {
    it("should delete account successfully", async () => {
      context.mock.onDelete("/users/me").reply(200, {});

      // Set tokens first
      context.client.setAccessToken("test-token");
      context.client.setRefreshToken("test-refresh-token");

      await context.client.users.deleteMyAccount();

      // Tokens should be cleared after account deletion
      expect(context.client.getAccessToken()).toBeUndefined();
      expect(context.client.getRefreshToken()).toBeUndefined();
    });

    it("should handle unauthorized access", async () => {
      context.mock
        .onDelete("/users/me")
        .reply(401, { message: "Unauthorized" });

      await expect(context.client.users.deleteMyAccount()).rejects.toThrow(
        "Authentication failed",
      );
    });
  });
});
