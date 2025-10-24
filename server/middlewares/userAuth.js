import { verifyToken } from "../utils/jwt.js";
import { MESSAGES } from "../constants/messages.js";

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Token", token)

    if (!token) {
      return res.json({
        success: false,
        message: MESSAGES.AUTH.ERROR.LOGIN_REQUIRED,
      });
    }

    const payload = verifyToken(token, process.env.JWT_SECRET);
    if (!payload)
      return res.json({ success: false, message: MESSAGES.AUTH.ERROR.TOKEN_VERIFICATION_FAILED });

    req.payload = payload;
    next();
  } catch (err) {
    console.error("Authentication failed:", err.message);
    return res.json({
      success: false,
      message: MESSAGES.AUTH.ERROR.SESSION_EXPIRED,
    });
  }
};

export { userAuth };
