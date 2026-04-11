import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";

import { JWT_SECRET } from "@repo/backend-common/config";

export type TokenPayload = {
  userId: string;
  email: string;
  name: string;
};

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "10d",
  });
};
export const verifyToken = (
  token: string,
):
  | { success: true; data: TokenPayload }
  | { success: false; error: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return { success: false, error: "Invalid token format" };
    }

    return {
      success: true,
      data: decoded as TokenPayload,
    };
  } catch (err) {
    return {
      success: false,
      error: "Invalid or expired token",
    };
  }
};

export const sendTokenCookie = (res: Response, token: string): void => {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction, // Must be true in production for cross-site cookies
    sameSite: isProduction ? "none" : "lax", // 'none' required for cross-domain
    maxAge: 1000 * 60 * 60 * 24 * 10,
  });
};

export const clearTokenCookie = (res: Response): void => {
  res.clearCookie("jwt");
};
