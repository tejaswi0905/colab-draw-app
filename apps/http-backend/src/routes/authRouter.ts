import express, { Router, Request, Response } from "express";

import { googleLogin, googleCallBack } from "../controller/authController.js";

import { clearTokenCookie } from "../utils/jwt.js";

const authRouter: Router = express.Router();

authRouter.get("/signIn", (req: Request, res: Response) => {
  res.send("Use /auth/google to sign in with Google");
});
authRouter.get("/signUp", (req: Request, res: Response) => {
  res.send("Sign up will be implemented soon");
});

authRouter.get("/google", googleLogin);

authRouter.get("/google/callback", googleCallBack);

authRouter.get("/logout", (req: Request, res: Response) => {
  clearTokenCookie(res);

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default authRouter;
