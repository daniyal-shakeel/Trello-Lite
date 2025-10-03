import { google } from "../config/arctic.js";
import { generateState, generateCodeVerifier, decodeIdToken } from "arctic";
import {
  OAUTH_EXCHANGE_EXPIRY,
  TOKEN_EXPIRY,
} from "../utils/default-values/google.js";
import { User } from "../models/user.js";
import { Board } from "../models/board.js";
import { generateToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";

function sendJwtAndClearCookies(res, user) {
  res.clearCookie("google_oauth_state");
  res.clearCookie("google_code_verifier");

  const token = generateToken({
    _id: user._id,
    email: user.email,
    name: user.name,
  });

  const cookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: TOKEN_EXPIRY,
    sameSite: "lax",
  };

  res.cookie("token", token, cookieConfig);
  return res.redirect(`${process.env.CLIENT_URI}/dashboard`);
}

const redirectToGoogle = async (_, res) => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, [
      "openid",
      "profile",
      "email",
    ]);

    const cookieConfig = {
      httpOnly: true,
      secure: true,
      maxAge: OAUTH_EXCHANGE_EXPIRY,
      sameSite: "lax",
    };

    res.cookie("google_oauth_state", state, cookieConfig);
    res.cookie("google_code_verifier", codeVerifier, cookieConfig);

    res.redirect(url.toString());
  } catch (err) {
    console.error("An error occured in redirectToGoogle function", err.message);
    const message = encodeURIComponent("Failed to start Google login");
    return res.redirect(`${process.env.CLIENT_URI}/login?error=${message}`);
  }
};

const handleGoogleCallback = async (req, res) => {
  const { code, state } = req.query;
  const {
    google_oauth_state: storedState,
    google_code_verifier: codeVerifier,
  } = req.cookies;

  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    const message = encodeURIComponent("Invalid OAuth state or missing params");
    return res.redirect(`${process.env.CLIENT_URI}/login?error=${message}`);
  }

  let tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (error) {
    console.error("validateAuthorizationCode error:", error.message);
    const message = encodeURIComponent(
      "Failed to validate Google authorization code"
    );
    return res.redirect(`${process.env.CLIENT_URI}/login?error=${message}`);
  }

  const claims = decodeIdToken(tokens.idToken());
  const { sub: googleUserId, name, email, picture } = claims;

  try {
    let user = await User.findOne({ googleId: googleUserId });
    if (user) {
      return sendJwtAndClearCookies(res, user);
    }

    user = await User.findOne({ email });
    if (user && !user.googleId) {
      const message = encodeURIComponent(
        "Email already registered. Try another login method."
      );
      return res.redirect(`${process.env.CLIENT_URI}/login?error=${message}`);
    }

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: googleUserId,
        avatar: picture,
      });

      await Board.create({
        name: "My Board",
        user: user._id,
        isDefault: true,
      });
    }

    return sendJwtAndClearCookies(res, user);
  } catch (error) {
    console.error(
      "An error occured in handleGoogleCallback function:",
      error.message
    );
    const message = encodeURIComponent("Something went wrong during login");
    return res.redirect(`${process.env.CLIENT_URI}/login?error=${message}`);
  }
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.googleId) {
      return res.json({
        success: false,
        message: "Email detected. Try to Login",
      });
    }

    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken({
      _id: user._id,
      email: user.email,
      name: user.name,
    });

    const cookieConfig = {
      httpOnly: true,
      secure: true,
      maxAge: TOKEN_EXPIRY,
      sameSite: "lax",
    };

    res.cookie("token", token, cookieConfig);

    await Board.create({
      name: "My Board",
      user: user._id,
      isDefault: true,
    });

    return res.json({
      success: true,
      message: "Signup successful",
      user,
      token,
    });
  } catch (err) {
    console.error("An error occured in signup function", err.message);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    if (user.googleId) {
      return res.json({
        success: false,
        message:
          "This account is registered via Google. Use Google login instead.",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken({
      _id: user._id,
      email: user.email,
      name: user.name,
    });

    const cookieConfig = {
      httpOnly: true,
      secure: true,
      maxAge: TOKEN_EXPIRY,
      sameSite: "lax",
    };

    res.cookie("token", token, cookieConfig);

    return res.json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (err) {
    console.error("An error occured in login function", err.message);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

const logout = async (_, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("google_oauth_state");
    res.clearCookie("google_code_verifier");

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("An error occurred in logout function: ", err.message);
    return res.json({
      success: false,
      message: "Something went wrong during logout",
    });
  }
};

export { redirectToGoogle, handleGoogleCallback, signup, login, logout };
