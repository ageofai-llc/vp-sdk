import type { HttpClient } from "../utils/http";
import { EventEmitter } from "events";

export class StreamClient {
  constructor(private http: HttpClient) {}

  async streamSSE(prompt: string): Promise<EventEmitter> {
    const emitter = new EventEmitter();
    const url = new URL(
      `${this.http["client"].defaults.baseURL}/llm/stream/sse`,
    );
    url.searchParams.append("prompt", prompt);

    // Use fetch for SSE since axios doesn't support streaming
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: this.http["client"].defaults.headers
          .Authorization as string,
      },
    });

    if (!response.ok) {
      emitter.emit(
        "error",
        new Error(`SSE request failed: ${response.status}`),
      );
      return emitter;
    }

    if (!response.body) {
      emitter.emit("error", new Error("Response body is not available"));
      return emitter;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    async function read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          emitter.emit("end");
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              emitter.emit("data", parsed);
            } catch (e) {
              emitter.emit(
                "error",
                new Error(`Failed to parse SSE data: ${e}`),
              );
            }
          }
        }

        read(); // Continue reading
      } catch (e) {
        emitter.emit("error", e);
      }
    }

    read();
    return emitter;
  }

  async streamLiveKit(prompt: string): Promise<any> {
    return this.http.request<any>({
      method: "POST",
      url: "/llm/stream/livekit",
      params: { prompt },
    });
  }
}
