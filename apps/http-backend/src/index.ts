import authRouter from "./routes/authRouter.js";
import chatRouter from "./routes/chatRouter.js";
import roomRouter from "./routes/roomRouter.js";

import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4000";
const allowedOrigins = [frontendUrl, "http://localhost:4000"];

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Welcome to the home page");
});

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/room", roomRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});
