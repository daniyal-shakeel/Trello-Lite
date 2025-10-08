import jwt from "jsonwebtoken";
import { JWT_EXPIRY, JWT_SECRET } from "./default-values/jwt.js";

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
