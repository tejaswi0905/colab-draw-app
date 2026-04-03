import express, { Router, Request, Response } from "express";
import { protect } from "../middleware/authMiddleware.js";

export const roomRouter: Router = express.Router();

roomRouter.get("/", protect, (req: Request, res: Response) => {
  res.send("You are currently inside the home page of room");
});
