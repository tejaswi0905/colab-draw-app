import express, { Router } from "express";

const authRouter: Router = express.Router();

authRouter.get("/signIn", (req, res) => {
  res.send("inside the /singIn endpoing");
});
authRouter.get("/signUp", (req, res) => {
  res.send("inside the /signUp endpoing");
});

authRouter.get("/google", (req, res) => {
  res.send("Inside the /google oauth endpoing");
});

authRouter.get("/google/callback", (req, res) => {
  res.send("Inside the /google/callback endpoint");
});

authRouter.get("/logout", (req, res) => {
  res.send("Inside the /logout endpoing");
});

export default authRouter;
