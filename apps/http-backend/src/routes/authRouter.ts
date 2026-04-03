import express, { Router, Request, Response } from "express";

import {
  googleLogin,
  googleCallBack,
  singInController,
  loginController,
} from "../controller/authController.js";

import { clearTokenCookie, verifyToken } from "../utils/jwt.js";

const authRouter: Router = express.Router();

authRouter.get("/signUp", singInController);
authRouter.get("/login", loginController);

authRouter.get("/google", googleLogin);

authRouter.get("/google/callback", googleCallBack);

authRouter.get("/logout", (req: Request, res: Response) => {
  clearTokenCookie(res);

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

authRouter.get("/me", (req: Request, res: Response) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.json({
        message: "failed",
        user: null,
      });
      return;
    }
    const decoded = verifyToken(token);
    if (decoded.success === false) {
      res.json({
        message: "failed",
        user: null,
      });
      return;
    }
    res.json({
      message: "success",
      user: decoded.data,
    });
  } catch (e: any) {
    console.log("Something went wrong in /auth/me route ", e);
    res.json({
      message: "failed",
      user: null,
    });
  }
});

export default authRouter;
