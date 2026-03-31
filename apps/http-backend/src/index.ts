import authRouter from "./routes/authRouter";

import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the home page");
});

app.use("/auth", authRouter);
app.listen(3001, () => {
  console.log("The server is litening in port 3000");
});
