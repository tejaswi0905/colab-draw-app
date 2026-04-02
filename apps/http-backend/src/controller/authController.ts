import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

import {
  getGoogleAuthURL,
  getGoogleAuthTokens,
  getGoogleUserInfo,
} from "../utils/oauth.js";

import { signToken, sendTokenCookie } from "../utils/jwt.js";

// 🔹 Login → redirect
export const googleLogin = (req: Request, res: Response): void => {
  const result = getGoogleAuthURL();

  if (!result.success) {
    res.status(500).json({ error: result.error });
    return;
  }

  res.redirect(result.url!);
};

// 🔹 Callback
export const googleCallBack = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const code = req.query.code;

    // ✅ Type guard for query param
    if (!code || typeof code !== "string") {
      res.status(400).json({
        error: "Invalid OAuth request",
        message: "No valid code found",
      });
      return;
    }

    // ✅ Get tokens
    const tokenResult = await getGoogleAuthTokens(code);

    if (!tokenResult.success) {
      res.status(400).json({ error: tokenResult.error });
      return;
    }

    const accessToken = tokenResult.data.access_token;

    if (!accessToken) {
      res.status(400).json({ error: "No access token received" });
      return;
    }

    // ✅ Get user info
    const userResult = await getGoogleUserInfo(accessToken);

    if (!userResult.success) {
      res.status(400).json({ error: userResult.error });
      return;
    }

    const googleUser = userResult.data;

    if (!googleUser.email) {
      res.status(400).json({ error: "Google user email missing" });
      return;
    }

    // ✅ DB lookup
    let user = await prismaClient.user.findUnique({
      where: { email: googleUser.email },
    });

    // ✅ Create user if not exists
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || "",
          image: googleUser.picture || "",
          provider: "GOOGLE",
          googeId: googleUser.id || "",
        },
      });
    }

    // ✅ Sign JWT
    const myToken = signToken({
      userId: user.id,
      email: user.email,
    });

    sendTokenCookie(res, myToken);

    // ✅ Redirect
    res.redirect("http://localhost:3000/dashboard");
  } catch (e) {
    console.error(e);

    res.status(400).json({
      error: "Something went wrong in authController",
    });
  }
};
