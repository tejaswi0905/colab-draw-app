import { axiosObj } from "@repo/common/fetch";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// 🔹 helper to safely get env
const getGoogleEnv = () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
    process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    return null;
  }

  return {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
  };
};

// ✅ 1. Auth URL
export const getGoogleAuthURL = () => {
  const env = getGoogleEnv();

  if (!env) {
    return {
      success: false,
      error: "Missing Google OAuth configuration",
    };
  }

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return {
    success: true,
    url: `${GOOGLE_AUTH_URL}?${params.toString()}`,
  };
};

// ✅ 2. Get Tokens
export const getGoogleAuthTokens = async (code: string) => {
  const env = getGoogleEnv();

  if (!env || !env.GOOGLE_CLIENT_SECRET) {
    return {
      success: false,
      error: "Missing Google OAuth configuration",
    };
  }

  const url = "https://oauth2.googleapis.com/token";

  const values: Record<string, string> = {
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  };

  try {
    const response = await axiosObj.post(url, new URLSearchParams(values), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch Google auth tokens",
    };
  }
};

// ✅ 3. Get User Info
export const getGoogleUserInfo = async (access_token: string) => {
  try {
    const response = await axiosObj.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch Google user info",
    };
  }
};
