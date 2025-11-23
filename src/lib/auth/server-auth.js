// src/lib/auth/server-auth.js
import { cookies } from "next/headers";
import { verifyAuthToken } from "./jwt-service";

export async function getServerAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return { authenticated: false, user: null };
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return { authenticated: false, user: null };
  }

  return {
    authenticated: true,
    user: {
      id: payload.sub,
      username: payload.username,
      fullName: payload.fullName,
      uniqueIdUser: payload.uniqueId,
      roles: payload.roles || [],
      permissions: payload.permissions || [],
    },
  };
}
