import { JWT_SECRET } from "@repo/backend-common/config";

import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

type TokenPayload = {
  userId: string;
  email: string;
  name: string;
};

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

    const user: User = {
      userId,
      rooms: [],
      socket,
    };

    users.push(user);

    // 🔹 Handle messages safely
    socket.on("message", (data) => {
      try {
        const parsedData = JSON.parse(data.toString());

        if (!parsedData || typeof parsedData !== "object") {
          return;
        }

        const currentUser = users.find((x) => x.socket === socket);
        if (!currentUser) return;

        // 🔹 JOIN ROOM
        if (parsedData.type === "join_room") {
          if (!parsedData.roomId || typeof parsedData.roomId !== "string") {
            return;
          }

          if (!currentUser.rooms.includes(parsedData.roomId)) {
            currentUser.rooms.push(parsedData.roomId);
          }
        }

        // 🔹 LEAVE ROOM
        else if (parsedData.type === "leave_room") {
          if (!parsedData.roomId || typeof parsedData.roomId !== "string") {
            return;
          }

          currentUser.rooms = currentUser.rooms.filter(
            (x) => x !== parsedData.roomId,
          );
        }

        // 🔹 CHAT
        else if (parsedData.type === "chat") {
          const { roomId, message } = parsedData;

          if (
            !roomId ||
            typeof roomId !== "string" ||
            !message ||
            typeof message !== "string"
          ) {
            return;
          }

          users.forEach((u) => {
            if (
              u.rooms.includes(roomId) &&
              u.socket.readyState === WebSocket.OPEN
            ) {
              try {
                u.socket.send(
                  JSON.stringify({
                    type: "chat",
                    message,
                    roomId,
                  }),
                );
              } catch {
                // ignore send errors
              }
            }
          });
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
      const index = users.findIndex((x) => x.socket === socket);
      if (index !== -1) {
        users.splice(index, 1);
      }
    });
  } catch (err) {
    console.error("Connection error:", err);
    socket.close();
  }
});
