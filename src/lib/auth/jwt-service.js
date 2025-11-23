// src/lib/auth/jwt-service.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m"; // access token 15 menit

export function signAuthToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function buildAuthCookie(token) {
  const isProd = process.env.NODE_ENV === "production";
  const maxAge = 15 * 60;

  const parts = [
    `auth_token=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (isProd) parts.push("Secure");

  return parts.join("; ");
}

export function clearAuthCookie() {
  const isProd = process.env.NODE_ENV === "production";

  const parts = [
    "auth_token=",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (isProd) parts.push("Secure");

  return parts.join("; ");
}
