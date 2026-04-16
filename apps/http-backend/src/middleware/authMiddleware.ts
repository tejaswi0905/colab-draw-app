import { Request, Response, NextFunction } from "express";

import { verifyToken } from "../utils/jwt.js";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies.jwt;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) {
      return res.status(401).json({
        message: "Not authenticated (no token)",
      });
    }
    const decoded = verifyToken(token);
    if (decoded.success === false) {
      res.status(401).json({
        status: "failed",
        message: "Invalid or expired token",
      });
      return;
    }
    req.user = decoded.data;
    next();
  } catch (e: any) {
    res.status(401).json({
      status: "failed",
      message: "Something wrong with users' auth token",
    });
    console.log("Inside the authMiddleware.ts file, ", e);
    return;
  }
};
