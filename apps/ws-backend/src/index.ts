import { JWT_SECRET } from "@repo/backend-common/config";

import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { prismaClient } from "@repo/db";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const wss = new WebSocketServer({ port: PORT });

type TokenPayload = {
  userId: string;
  email: string;
  name: string;
};

const rooms = new Map<string, Set<WebSocket>>();
const socketToUser = new Map<WebSocket, string>();

const verifyUser = (
  token: string,
):
  | { success: true; data: TokenPayload }
  | { success: false; error: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return { success: false, error: "Invalid token format" };
    }

    return {
      success: true,
      data: decoded as TokenPayload,
    };
  } catch {
    return {
      success: false,
      error: "Invalid or expired token",
    };
  }
};

wss.on("connection", (socket, req) => {
  console.log("New user connected ");
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.jwt;

    if (!token) {
      socket.close();
      return;
    }

    const verifiedUser = verifyUser(token);
    if (!verifiedUser.success) {
      socket.close();
      return;
    }

    const userId = verifiedUser.data.userId;

    if (!userId) {
      socket.close();
      return;
    }
    socketToUser.set(socket, userId);

    // 🔹 Handle messages safely
    socket.on("message", async (data) => {
      try {
        const parsedData = JSON.parse(data.toString());

        if (!parsedData || typeof parsedData !== "object") {
          return;
        }

        // 🔹 JOIN ROOM
        if (parsedData.type === "join_room") {
          if (!parsedData.roomId || typeof parsedData.roomId !== "string") {
            return;
          }
          const roomId = parsedData.roomId;
          const roomIdNum = Number(roomId);
          if (isNaN(roomIdNum)) return;
          const userId = socketToUser.get(socket);
          if (!userId) {
            return;
          }

          const room = await prismaClient.room.findUnique({
            where: {
              id: roomIdNum,
            },
          });
          if (!room) {
            socket.send(
              JSON.stringify({
                type: "error",
                message: "Room does not exist",
              }),
            );
            return;
          }

          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
          }
          rooms.get(roomId)!.add(socket);
          socket.send(
            JSON.stringify({
              type: "joined",
              roomId: roomId,
            }),
          );
        }

        // 🔹 LEAVE ROOM
        else if (parsedData.type === "leave_room") {
          if (!parsedData.roomId || typeof parsedData.roomId !== "string") {
            return;
          }

          rooms.get(parsedData.roomId)?.delete(socket);
        }

        // 🔹 CHAT
        else if (parsedData.type === "chat") {
          const { roomId, message } = parsedData;

          if (
            !roomId ||
            typeof roomId !== "string" ||
            !message ||
            typeof message !== "string"
          )
            return;

          const userId = socketToUser.get(socket);
          if (!userId) return;

          const roomIdNum = Number(roomId);
          if (isNaN(roomIdNum)) return;

          try {
            // ✅ Save to DB first
            const savedMessage = await prismaClient.chat.create({
              data: {
                message,
                roomId: roomIdNum,
                userId,
              },
            });

            // ✅ Then broadcast
            const sockets = rooms.get(roomId);
            if (!sockets) return;

            sockets.forEach((s) => {
              if (s.readyState === WebSocket.OPEN) {
                s.send(
                  JSON.stringify({
                    type: "chat",
                    message: savedMessage.message,
                    roomId,
                    userId,
                    chatId: savedMessage.id,
                  }),
                );
              }
            });
          } catch (err) {
            console.error("Chat save failed:", err);

            socket.send(
              JSON.stringify({
                type: "error",
                message: "Failed to send message",
              }),
            );
          }
        }
      } catch (err) {
        console.error("Invalid message received:", err);
        // don't crash, just ignore
      }
    });

    // 🔹 Handle socket errors
    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    // 🔹 Cleanup on disconnect
    socket.on("close", () => {
      socketToUser.delete(socket);

      //remove socket from all rooms
      rooms.forEach((sockets) => {
        sockets.delete(socket);
      });
    });
  } catch (err) {
    console.error("Connection error:", err);
    socket.close();
  }
});
