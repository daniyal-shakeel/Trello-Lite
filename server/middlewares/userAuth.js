import { verifyToken } from "../utils/jwt.js";

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({
        success: false,
        message: "You must be logged in to access this route.",
      });
    }

    const payload = verifyToken(token, process.env.JWT_SECRET);
    req.payload = payload;
    next();
  } catch (err) {
    console.error("Authentication failed:", err.message);
    return res.json({
      success: false,
      message: "Invalid or expired session. Please log in again",
    });
  }
};

export { userAuth };
