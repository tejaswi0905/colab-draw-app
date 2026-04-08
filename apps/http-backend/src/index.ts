import authRouter from "./routes/authRouter.js";
import chatRouter from "./routes/chatRouter.js";

import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the home page");
});

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.listen(3000, () => {
  console.log("The server is litening in port 3000");
});
