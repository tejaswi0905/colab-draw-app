import express, { Router, Request, Response } from "express";

import { googleLogin, googleCallBack } from "../controller/authController.js";

import { clearTokenCookie } from "../utils/jwt.js";

const authRouter: Router = express.Router();

// 🔹 Sign In (for now just placeholder)
authRouter.get("/signIn", (req: Request, res: Response) => {
  res.send("Use /auth/google to sign in with Google");
});

// 🔹 Sign Up (we’ll implement later)
authRouter.get("/signUp", (req: Request, res: Response) => {
  res.send("Sign up will be implemented soon");
});

// 🔹 Google OAuth start
authRouter.get("/google", googleLogin);

// 🔹 Google OAuth callback
authRouter.get("/google/callback", googleCallBack);

// 🔹 Logout
authRouter.get("/logout", (req: Request, res: Response) => {
  clearTokenCookie(res);

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default authRouter;
