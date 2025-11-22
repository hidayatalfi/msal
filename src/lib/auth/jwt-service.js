import jwt from "jsonwebtoken";

export const JWTService = {
  // Generate access token
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m",
      algorithm: "HS256",
    });
  },
  // Generate refresh token
  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || "7d",
      algorithm: "HS256",
    });
  },
  // Verify access token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  },
  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  },
  // Decode token without verification (untuk debugging)
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  },
  // Get expiration time
  getTokenExpiration(expiresIn) {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return Date.now() + 15 * 60 * 1000; // default 15 minutes
    const value = parseInt(match[1]);
    const unit = match[2];
    const multipliers = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return Date.now() + value * multipliers[unit];
  },
};
