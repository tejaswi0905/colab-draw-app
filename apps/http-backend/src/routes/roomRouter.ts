import express, { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getRoomMessages,
  createRoom,
  getRoomBySlug,
  getMyRooms,
} from "../controller/roomController.js";

export const roomRouter: Router = express.Router();

roomRouter.get("/", (req, res) => {
  res.send("Hello from the room route");
});

// ✅ CREATE ROOM
roomRouter.post("/create", protect, createRoom);

// GET MESSAGES
roomRouter.get("/:roomId/messages", protect, getRoomMessages);

roomRouter.get("/slug/:slug", protect, getRoomBySlug);

roomRouter.get("/my-rooms", protect, getMyRooms);

export default roomRouter;
