import express, { Router, Request, Response } from "express";

import {
  googleLogin,
  googleCallBack,
  singInController,
  loginController,
} from "../controller/authController.js";

import { clearTokenCookie, verifyToken } from "../utils/jwt.js";

const authRouter: Router = express.Router();

authRouter.post("/signUp", singInController);
authRouter.post("/login", loginController);

authRouter.get("/google", googleLogin);
authRouter.get("/google/callback", googleCallBack);

authRouter.get("/logout", (req: Request, res: Response) => {
  clearTokenCookie(res);

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// ✅ FIXED: safe cookie handling
authRouter.get("/me", (req: Request, res: Response) => {
  try {
    const token = req.cookies?.jwt; // ✅ SAFE ACCESS

    if (!token) {
      return res.json({
        message: "failed",
        user: null,
      });
    }

    const decoded = verifyToken(token);

    if (decoded.success === false) {
      return res.json({
        message: "failed",
        user: null,
      });
    }

    return res.json({
      message: "success",
      user: decoded.data,
      token: token,
    });
  } catch (e: any) {
    console.log("Error in /auth/me:", e);

    return res.json({
      message: "failed",
      user: null,
    });
  }
});

export default authRouter;
