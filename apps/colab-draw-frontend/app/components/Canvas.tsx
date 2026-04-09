"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { WS_URL, HTTP_BACKEND } from "@/config";
import { axiosObj } from "@repo/common/fetch";

export default function CanvasComp({ roomId }: { roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // 🔌 WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  // 🎨 Setup drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;

    let cleanupFn: (() => void) | undefined;

    const setup = async () => {
      try {
        const resp = await axiosObj.get(
          `${HTTP_BACKEND}/room/${roomId}/messages`,
        );

        const messages = resp.data.data;

        const shapes = messages.map((x: { message: string }) =>
          JSON.parse(x.message),
        );

        cleanupFn = initDraw(canvas, roomId, socket, shapes);
      } catch (err) {
        console.error("Failed to fetch shapes:", err);
      }
    };

    setup();

    return () => {
      cleanupFn?.();
    };
  }, [socket, roomId]);

  if (!socket) {
    return <div>Connecting to server...</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <canvas
        ref={canvasRef}
        width={1080}
        height={1000}
        style={{ border: "1px solid #333", cursor: "crosshair" }}
      />
    </div>
  );
}
