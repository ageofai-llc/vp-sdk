import {
  createTestContext,
  type TestContext,
  setupAuthenticatedClient,
} from "../../setup/test-utils";
import { ReadableStream } from "stream/web";
import fetchMock from "jest-fetch-mock";

describe("StreamClient", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = createTestContext();
    await setupAuthenticatedClient(context.client, context.mock);
  });

  afterEach(() => {
    context.mock.reset();
  });

  //   describe("streamSSE", () => {
  //     it("should handle SSE stream with valid response body", async () => {
  //       const sseData = 'data: {"message": "test"}\n\n';

  //       const stream = new ReadableStream({
  //         start(controller) {
  //           controller.enqueue(new TextEncoder().encode(sseData));
  //           controller.close();
  //         },
  //       });

  //       fetchMock.mockResponseOnce(JSON.stringify(() => Promise.resolve(stream)));

  //       const sseStream = await context.client.stream.streamSSE("test prompt");

  //       await new Promise<void>((resolve, reject) => {
  //         sseStream.on("data", (data) => {
  //           try {
  //             expect(data).toEqual({ message: "test" });
  //           } catch (err) {
  //             reject(err);
  //           }
  //         });

  //         sseStream.on("end", resolve);
  //         sseStream.on("error", reject);
  //       });
  //     });

  //     it("should handle missing response body in SSE stream", async () => {
  //       fetchMock.mockResponseOnce("", { status: 200 });

  //       const stream = await context.client.stream.streamSSE("test prompt");

  //       await new Promise<void>((resolve, reject) => {
  //         stream.on("error", (error) => {
  //           try {
  //             expect(error.message).toBe("Response body is not available");
  //             resolve();
  //           } catch (err) {
  //             reject(err);
  //           }
  //         });

  //         stream.on("data", () => {
  //           reject(new Error("Should not receive data"));
  //         });
  //       });
  //     });

  //     it("should handle invalid SSE data", async () => {
  //       fetchMock.mockResponse(
  //         JSON.stringify({
  //           body: new ReadableStream({
  //             start(controller) {
  //               controller.enqueue(
  //                 new TextEncoder().encode("data: invalid json\n\n")
  //               );
  //               controller.close();
  //             },
  //           }),
  //         })
  //       );

  //       const stream = await context.client.stream.streamSSE("test prompt");

  //       await new Promise<void>((resolve, reject) => {
  //         stream.on("error", (error) => {
  //           try {
  //             expect(error.message).toBe("Failed to parse SSE data");
  //             resolve();
  //           } catch (err) {
  //             reject(err);
  //           }
  //         });

  //         stream.on("data", () => {
  //           reject(new Error("Should not receive data"));
  //         });
  //       });
  //     });
  //   });

  describe("streamLiveKit", () => {
    it("should handle LiveKit streaming successfully", async () => {
      const mockResponse = { stream_id: "stream1" };
      context.mock.onPost("/llm/stream/livekit").reply(200, mockResponse);

      const response = await context.client.stream.streamLiveKit("test prompt");
      expect(response).toEqual(mockResponse);
    });

    it("should handle LiveKit streaming failure", async () => {
      context.mock
        .onPost("/llm/stream/livekit")
        .reply(500, { message: "Stream failed" });

      await expect(
        context.client.stream.streamLiveKit("test prompt"),
      ).rejects.toThrow();
    });
  });
});
