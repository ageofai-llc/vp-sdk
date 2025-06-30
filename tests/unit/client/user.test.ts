import {
  createTestContext,
  TestContext,
  setupAuthenticatedClient,
  mockUser,
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

  describe("getCurrentUser", () => {
    it("should get current user successfully", async () => {
      context.mock.onGet("/users/me").reply(200, mockUser);

      const user = await context.client.users.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it("should handle unauthorized access", async () => {
      context.mock.onGet("/users/me").reply(401, { message: "Unauthorized" });

      await expect(context.client.users.getCurrentUser()).rejects.toThrow();
    });
  });

  describe("updateCurrentUser", () => {
    it("should update current user successfully", async () => {
      const updatedUser = {
        ...mockUser,
        username: "updateduser",
        email: "updated@example.com",
      };
      context.mock.onPut("/users/me").reply(200, updatedUser);

      const user = await context.client.users.updateCurrentUser({
        username: "updateduser",
      });
      expect(user).toEqual(updatedUser);
    });

    it("should handle validation errors", async () => {
      context.mock
        .onPut("/users/me")
        .reply(422, { message: "Invalid email format" });

      await expect(
        context.client.users.updateCurrentUser({
          email: "invalid-email",
        })
      ).rejects.toThrow();
    });
  });
});
