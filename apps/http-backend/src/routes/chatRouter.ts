import express, { Router, Request, Response } from "express";

const chatRouter: Router = express.Router();

chatRouter.get("/:roomId", (req: Request, res: Response) => {
  const roomId = req.params;
  console.log("The room id is ", roomId);
  res.send("inside the /chats/roomId");
});

export default chatRouter;
