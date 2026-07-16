import { eventBus } from "@/lib/eventBus";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: string) => {
        try {
          controller.enqueue(encoder.encode(payload));
        } catch {
          // Controller already closed (client disconnected); ignore.
        }
      };

      send("retry: 3000\n\n");

      const onChange = () => send("data: refresh\n\n");
      eventBus.on("change", onChange);

      const heartbeat = setInterval(() => send(": heartbeat\n\n"), 20000);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        eventBus.off("change", onChange);
        try {
          controller.close();
        } catch {
          // Already closed.
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
