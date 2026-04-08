"use client";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { WS_URL } from "@/config";

export default function CanvasComp({ roomId }: { roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [socket, setSocket] = useState<WebSocket | null>(null);

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
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && socket) {
      // initDraw now returns a cleanup function
      initDraw(canvas, roomId, socket);

      // React calls this when the component unmounts
      // return () => {
      //   if (cleanup) cleanup();
      // };
    }
  }, [socket]); // Empty dependency array ensures this runs once on mount

  if (!socket) {
    return <div>Connecting to server!</div>;
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
