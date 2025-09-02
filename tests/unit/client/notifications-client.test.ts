import {
  createTestContext,
  mockNotification,
  type TestContext,
} from "../../setup/test-utils";

describe("NotificationsClient", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("getNotifications", () => {
    it("should get notifications successfully", async () => {
      const notifications = [
        mockNotification,
        { ...mockNotification, id: "notif-124", title: "Another Notification" },
      ];

      context.mock.onGet("/notifications/").reply(200, notifications);

      const result = await context.client.notifications.getNotifications({
        skip: 0,
        limit: 10,
        unread_only: true,
      });

      expect(result).toEqual(notifications);
    });
  });

  describe("getUnreadCount", () => {
    it("should get unread count successfully", async () => {
      const count = { count: 5 };
      context.mock.onGet("/notifications/unread-count").reply(200, count);

      const result = await context.client.notifications.getUnreadCount();
      expect(result).toEqual(count);
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read successfully", async () => {
      context.mock.onPost("/notifications/notif-123/read").reply(200, {});

      await expect(
        context.client.notifications.markAsRead("notif-123"),
      ).resolves.not.toThrow();
    });

    it("should handle notification not found", async () => {
      context.mock
        .onPost("/notifications/notif-999/read")
        .reply(404, { message: "Notification not found" });

      await expect(
        context.client.notifications.markAsRead("notif-999"),
      ).rejects.toThrow();
    });
  });

  describe("markAllAsRead", () => {
    it("should mark all notifications as read successfully", async () => {
      context.mock.onPost("/notifications/mark-all-read").reply(200, {});

      await expect(
        context.client.notifications.markAllAsRead(),
      ).resolves.not.toThrow();
    });
  });

  describe("deleteNotification", () => {
    it("should delete notification successfully", async () => {
      context.mock.onDelete("/notifications/notif-123").reply(200, {});

      await expect(
        context.client.notifications.deleteNotification("notif-123"),
      ).resolves.not.toThrow();
    });
  });

  describe("clearAllNotifications", () => {
    it("should clear all notifications successfully", async () => {
      context.mock.onDelete("/notifications/clear-all").reply(200, {});

      await expect(
        context.client.notifications.clearAllNotifications(),
      ).resolves.not.toThrow();
    });
  });
});
