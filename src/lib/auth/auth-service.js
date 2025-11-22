import { UserService } from "./user-service";
import { RateLimiter } from "./rate-limiter";
import { JWTService } from "./jwt-service";
import { CookieService } from "./cookie-service";
import { executeQuery } from "@/lib/db";

export const AuthService = {
  // Login user
  async login(credentials, ipAddress = "unknown") {
    const { username, password } = credentials;

    if (!username || !password) {
      return {
        success: false,
        error: "Username dan password harus diisi",
      };
    }

    // Check rate limiting
    const isLimited = await RateLimiter.isRateLimited(username);
    if (isLimited) {
      return {
        success: false,
        error: "Terlalu banyak percobaan login. Coba lagi nanti.",
      };
    }

    // Find user
    const user = await UserService.findByCredentials(username);
    if (!user) {
      await RateLimiter.recordAttempt(username, ipAddress, false);
      return {
        success: false,
        error: "Username atau password salah",
      };
    }

    // Verify password
    const isValidPassword = await UserService.verifyPassword(
      password,
      user.password,
    );
    if (!isValidPassword) {
      await RateLimiter.recordAttempt(username, ipAddress, false);
      return {
        success: false,
        error: "Username atau password salah",
      };
    }

    // Record successful login
    await RateLimiter.recordAttempt(username, ipAddress, true);

    // Get user with roles and permissions
    const userWithRoles = await UserService.getUserWithRoles(user.id);
    if (!userWithRoles) {
      return {
        success: false,
        error: "Gagal mengambil data user",
      };
    }

    // Create token payload
    const tokenPayload = {
      userId: userWithRoles.unique_id_user,
      username: userWithRoles.username,
      roles: userWithRoles.roles,
      permissions: userWithRoles.permissions,
    };

    // Generate tokens
    const accessToken = JWTService.generateAccessToken(tokenPayload);
    const refreshToken = JWTService.generateRefreshToken({
      userId: userWithRoles.id,
    });

    // Save refresh token to database
    await this.saveRefreshToken(userWithRoles.id, refreshToken);

    // Set cookies (now with await)
    await CookieService.setAccessToken(accessToken);
    await CookieService.setRefreshToken(refreshToken);
    await CookieService.setUserData({
      id: userWithRoles.id,
      username: userWithRoles.username,
      name: userWithRoles.full_name,
      roles: userWithRoles.roles,
      permissions: userWithRoles.permissions,
    });

    return {
      success: true,
      user: {
        id: userWithRoles.id,
        username: userWithRoles.username,
        name: userWithRoles.full_name,
        roles: userWithRoles.roles,
        permissions: userWithRoles.permissions,
      },
    };
  },

  // Logout user
  async logout() {
    const refreshToken = await CookieService.getRefreshToken();

    // Delete refresh token from database
    if (refreshToken) {
      await this.deleteRefreshToken(refreshToken);
    }

    // Clear all cookies
    await CookieService.clearAuthCookies();
    await CookieService.clearUserData();

    return { success: true };
  },

  // Get current user from token
  async getCurrentUser() {
    const accessToken = await CookieService.getAccessToken();

    if (!accessToken) {
      return null;
    }

    const payload = JWTService.verifyAccessToken(accessToken);

    if (!payload) {
      // Token expired or invalid, try to refresh
      return await this.refreshAccessToken();
    }

    return {
      id: payload.userId,
      username: payload.username,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
    };
  },

  // Refresh access token
  async refreshAccessToken() {
    const refreshToken = await CookieService.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    const payload = JWTService.verifyRefreshToken(refreshToken);

    if (!payload) {
      // Refresh token invalid, clear cookies
      await CookieService.clearAuthCookies();
      await CookieService.clearUserData();
      return null;
    }

    // Check if refresh token exists in database
    const isValid = await this.verifyRefreshToken(refreshToken);
    if (!isValid) {
      await CookieService.clearAuthCookies();
      await CookieService.clearUserData();
      return null;
    }

    // Get fresh user data
    const userWithRoles = await UserService.getUserWithRoles(payload.userId);
    if (!userWithRoles) {
      return null;
    }

    // Generate new access token
    const tokenPayload = {
      userId: userWithRoles.id,
      username: userWithRoles.username,
      roles: userWithRoles.roles,
      permissions: userWithRoles.permissions,
    };

    const newAccessToken = JWTService.generateAccessToken(tokenPayload);

    // Set new access token
    await CookieService.setAccessToken(newAccessToken);
    await CookieService.setUserData({
      id: userWithRoles.id,
      username: userWithRoles.username,
      name: userWithRoles.full_name,
      roles: userWithRoles.roles,
      permissions: userWithRoles.permissions,
    });

    return {
      id: userWithRoles.id,
      username: userWithRoles.username,
      name: userWithRoles.full_name,
      roles: userWithRoles.roles,
      permissions: userWithRoles.permissions,
    };
  },

  // Save refresh token to database
  async saveRefreshToken(userId, token) {
    const expiresAt = new Date(
      JWTService.getTokenExpiration(process.env.JWT_REFRESH_EXPIRATION || "7d"),
    );

    const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at)
        VALUES (?, ?, ?)
      `;

    await executeQuery(query, [userId, token, expiresAt]);
  },

  // Verify refresh token exists in database
  //   async verifyRefreshToken(token) {
  //     const query = `
  //       SELECT id FROM refresh_tokens
  //       WHERE token = ? AND expires_at > NOW()
  //       LIMIT 1
  //     `;

  //     const results = await executeQuery(query, [token]);
  //     return results.length > 0;
  //   },

  // Delete refresh token
  async deleteRefreshToken(token) {
    const query = `DELETE FROM refresh_tokens WHERE token = ?`;
    await executeQuery(query, [token]);
  },

  //   // Clean expired refresh tokens (jalankan via cron)
  //   async cleanExpiredTokens() {
  //     const query = `DELETE FROM refresh_tokens WHERE expires_at < NOW()`;
  //     await executeQuery(query);
  //   },
};
