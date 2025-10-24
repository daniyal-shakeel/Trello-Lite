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
import { MESSAGES } from "../constants/messages.js";

function sendJwtAndClearCookies(res, user) {
  res.clearCookie("google_oauth_state");
  res.clearCookie("google_code_verifier");

  const token = generateToken({
    _id: user._id,
    email: user.email,
    name: user.name,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    maxAge: TOKEN_EXPIRY,
    sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
  });
  return res.redirect(getRedirectUri('/dashboard'));
}

const getRedirectUri = (params) => `${process.env.CLIENT_URI}${params}`;

const redirectToGoogle = async (_, res) => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, [
      "openid",
      "profile",
      "email",
    ]);

    res.cookie("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      maxAge: OAUTH_EXCHANGE_EXPIRY,
      sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
    });
    res.cookie("google_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      maxAge: OAUTH_EXCHANGE_EXPIRY,
      sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
    });

    res.redirect(url.toString());
  } catch (err) {
    console.error("An error occured in redirectToGoogle function", err.message);
    const message = encodeURIComponent("Failed to start Google login");
    return res.redirect(getRedirectUri(`/login?error=${message}`));
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
    return res.redirect(getRedirectUri(`/login?error=${message}`));
  }

  let tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (error) {
    console.error("validateAuthorizationCode error:", error.message);
    const message = encodeURIComponent(
      "Failed to validate Google authorization code"
    );
    return res.redirect(getRedirectUri(`/login?error=${message}`));
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
      return res.redirect(getRedirectUri(`/login?error=${message}`));
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
    return res.redirect(getRedirectUri(`/login?error=${message}`));
  }
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: MESSAGES.AUTH.VALIDATION.ALL_FIELDS_REQUIRED });
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
      return res.json({ success: false, message: MESSAGES.AUTH.ERROR.EMAIL_ALREADY_REGISTERED });
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      maxAge: TOKEN_EXPIRY,
      sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
    });

    await Board.create({
      name: "My Board",
      user: user._id,
      isDefault: true,
    });

    return res.json({
      success: true,
      message: MESSAGES.AUTH.SUCCESS.SIGNUP_SUCCESSFUL,
      user,
    });
  } catch (err) {
    console.error("An error occured in signup function", err.message);
    return res.json({ success: false, message: MESSAGES.AUTH.ERROR.SOMETHING_WENT_WRONG });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: MESSAGES.AUTH.VALIDATION.EMAIL_PASSWORD_REQUIRED,
    });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.json({ success: false, message: MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS });
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
      return res.json({ success: false, message: MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS });
    }

    const token = generateToken({
      _id: user._id,
      email: user.email,
      name: user.name,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      maxAge: TOKEN_EXPIRY,
      sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
    });

    return res.json({
      success: true,
      message: MESSAGES.AUTH.SUCCESS.LOGIN_SUCCESS,
      user,
    });
  } catch (err) {
    console.error("An error occured in login function", err.message);
    return res.json({ success: false, message: MESSAGES.AUTH.ERROR.SOMETHING_WENT_WRONG });
  }
};

const logout = async (_, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("google_oauth_state");
    res.clearCookie("google_code_verifier");

    return res.json({
      success: true,
      message: MESSAGES.AUTH.SUCCESS.LOGOUT_SUCCESS,
    });
  } catch (err) {
    console.error("An error occurred in logout function: ", err.message);
    return res.json({
      success: false,
      message: MESSAGES.AUTH.ERROR.LOGOUT_FAILED,
    });
  }
};

export { redirectToGoogle, handleGoogleCallback, signup, login, logout };
