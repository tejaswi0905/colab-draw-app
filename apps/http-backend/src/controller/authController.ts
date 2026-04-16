// import { prismaClient } from "@repo/db";
// import { Request, Response } from "express";

// import bcrypt from "bcrypt";

// import {
//   getGoogleAuthURL,
//   getGoogleAuthTokens,
//   getGoogleUserInfo,
// } from "../utils/oauth.js";
// import { loginSchema, signupSchema } from "@repo/common/types";
// import { TokenPayload } from "../utils/jwt.js";
// import { signToken, sendTokenCookie } from "../utils/jwt.js";

// export const googleLogin = (req: Request, res: Response): void => {
//   const result = getGoogleAuthURL();

//   if (!result.success) {
//     res.status(500).json({ error: result.error });
//     return;
//   }

//   res.redirect(result.url!);
// };

// export const googleCallBack = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const code = req.query.code;

//     // ✅ Type guard for query param
//     if (!code || typeof code !== "string") {
//       res.status(400).json({
//         error: "Invalid OAuth request",
//         message: "No valid code found",
//       });
//       return;
//     }

//     // ✅ Get tokens
//     const tokenResult = await getGoogleAuthTokens(code);

//     if (!tokenResult.success) {
//       res.status(400).json({ error: tokenResult.error });
//       return;
//     }

//     const accessToken = tokenResult.data.access_token;

//     if (!accessToken) {
//       res.status(400).json({ error: "No access token received" });
//       return;
//     }

//     // ✅ Get user info
//     const userResult = await getGoogleUserInfo(accessToken);

//     if (!userResult.success) {
//       res.status(400).json({ error: userResult.error });
//       return;
//     }

//     const googleUser = userResult.data;

//     if (!googleUser.email) {
//       res.status(400).json({ error: "Google user email missing" });
//       return;
//     }

//     // ✅ DB lookup
//     let user = await prismaClient.user.findUnique({
//       where: { email: googleUser.email },
//     });

//     // ✅ Create user if not exists
//     if (!user) {
//       user = await prismaClient.user.create({
//         data: {
//           email: googleUser.email,
//           name: googleUser.name || "",
//           image: googleUser.picture || "",
//           provider: "GOOGLE",
//           googleId: googleUser.id || "",
//         },
//       });
//     }

//     // ✅ Sign JWT
//     const myToken = signToken({
//       userId: user.id,
//       email: user.email,
//       name: user.name!,
//     });

//     sendTokenCookie(res, myToken);

//     // ✅ Redirect
//     res.redirect("http://localhost:3000/dashboard");
//   } catch (e) {
//     console.error(e);

//     res.status(400).json({
//       error: "Something went wrong in authController",
//     });
//   }
// };

import { prismaClient } from "@repo/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

import {
  getGoogleAuthURL,
  getGoogleAuthTokens,
  getGoogleUserInfo,
} from "../utils/oauth.js";

import { loginSchema, signupSchema } from "@repo/common/types";
import { TokenPayload } from "../utils/jwt.js";
import { signToken, sendTokenCookie } from "../utils/jwt.js";

// 🔐 GOOGLE LOGIN
export const googleLogin = (req: Request, res: Response): void => {
  const result = getGoogleAuthURL();

  if (!result.success) {
    res.status(500).json({ error: result.error });
    return;
  }

  res.redirect(result.url!);
};

// 🔐 GOOGLE CALLBACK
export const googleCallBack = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const code = req.query.code;

    if (!code || typeof code !== "string") {
      res.status(400).json({
        error: "Invalid OAuth request",
      });
      return;
    }

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

    let user = await prismaClient.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || "",
          image: googleUser.picture || "",
          provider: "GOOGLE",
          googleId: googleUser.id || "",
        },
      });
    }

    const myToken = signToken({
      userId: user.id,
      email: user.email,
      name: user.name!,
    });

    sendTokenCookie(res, myToken);

    // ✅ FIXED: redirect to frontend
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4000";
    res.redirect(`${frontendUrl}/?token=${myToken}`);
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const singInController = async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: "Invalid input",
      issues: result.error.issues,
    });
    return;
  }
  const { email, password, name } = result.data;

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(400).json({
        status: "failed",
        message: "Email already in use",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: "Credentials",
      },
    });

    const payload: TokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name!,
    };
    const token = signToken(payload);
    sendTokenCookie(res, token);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Something went wrong during signup",
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      status: "failed",
      message: "Invalid Credentials",
    });
    return;
  }
  const { email, password } = result.data;

  try {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (!user || !user.password) {
      res.status(400).json({
        status: "failed",
        message: "Invalid email or password",
      });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({
        status: "failed",
        message: "Invalid email or password",
      });
      return;
    }
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name!,
    };
    const token = signToken(payload);
    sendTokenCookie(res, token);
    res.json({
      success: true,
      message: "Logged in successfully",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong during login",
    });
  }
};
