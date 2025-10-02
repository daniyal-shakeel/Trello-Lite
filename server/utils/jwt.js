import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";
const JWT_EXPIRY = "1d";

function generateToken(payload, expiresIn = JWT_EXPIRY) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
}

export { generateToken, verifyToken, decodeToken };
