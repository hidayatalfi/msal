import { cookies } from "next/headers";

export const CookieService = {
  // Set access token cookie
  async setAccessToken(token) {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });
  },
  // Set refresh token cookie
  async setRefreshToken(token) {
    const cookieStore = await cookies();
    cookieStore.set("refreshToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
  },
  // Get access token
  async getAccessToken() {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
  },
  // Get refresh token
  async getRefreshToken() {
    const cookieStore = await cookies();
    return cookieStore.get("refreshToken")?.value;
  },
  // Delete all auth cookies
  async clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  },
  // Set user data cookie (optional, untuk quick access)
  async setUserData(userData) {
    const cookieStore = await cookies();
    cookieStore.set("userData", JSON.stringify(userData), {
      httpOnly: false, // accessible from client
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });
  },
  //   // Get user data
  //   async getUserData() {
  //     const cookieStore = await cookies();
  //     const data = cookieStore.get("userData")?.value;
  //     try {
  //       return data ? JSON.parse(data) : null;
  //     } catch {
  //       return null;
  //     }
  //   },
  // Clear user data
  async clearUserData() {
    const cookieStore = await cookies();
    cookieStore.delete("userData");
  },
};
