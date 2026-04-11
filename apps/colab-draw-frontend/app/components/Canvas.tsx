"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { WS_URL, HTTP_BACKEND } from "@/config";
import { axiosObj } from "@repo/common/fetch";

export default function CanvasComp({ roomId }: { roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [initialShapes, setInitialShapes] = useState<any[] | null>(null);

  // 🔥 STEP 1: Fetch shapes FIRST
  useEffect(() => {
    const fetchShapes = async () => {
      try {
        const resp = await axiosObj.get(
          `${HTTP_BACKEND}/room/${roomId}/messages`,
          {
            withCredentials: true,
          },
        );

        const messages = resp.data.data;

        const shapes = messages.map((x: { message: string }) =>
          JSON.parse(x.message),
        );

        setInitialShapes(shapes);
      } catch (err) {
        console.error("Failed to fetch shapes:", err);
        setInitialShapes([]); // fallback
      }
    };

    fetchShapes();
  }, [roomId]);

  // 🔥 STEP 2: Connect WS AFTER shapes loaded
  useEffect(() => {
    if (!initialShapes) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
      setSocket(ws);
    };

    return () => {
      ws.close();
    };
  }, [initialShapes, roomId]);

  // 🔥 STEP 3: Init drawing AFTER both ready
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !socket || !initialShapes) return;

    const cleanup = initDraw(canvas, roomId, socket, initialShapes);

    return () => {
      cleanup?.();
    };
  }, [socket, initialShapes, roomId]);

  // 🔥 Loading UI
  if (!initialShapes) {
    return <div>Loading canvas...</div>;
  }

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
