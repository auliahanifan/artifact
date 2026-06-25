import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const SESSION_COOKIE = "artifact_input_session";

const AUTH_USER = process.env.INPUT_AUTH_USER ?? "aulia";
const AUTH_PASSWORD = process.env.INPUT_AUTH_PASSWORD ?? "gantengpokoknya";
const AUTH_SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-me";

export function getAuthCredentials() {
  return { username: AUTH_USER, password: AUTH_PASSWORD };
}

export function createSessionToken() {
  return createHmac("sha256", AUTH_SECRET).update(AUTH_USER).digest("hex");
}

function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const expected = createSessionToken();

  try {
    const tokenBuffer = Buffer.from(token, "hex");
    const expectedBuffer = Buffer.from(expected, "hex");

    return (
      tokenBuffer.length === expectedBuffer.length &&
      timingSafeEqual(tokenBuffer, expectedBuffer)
    );
  } catch {
    return false;
  }
}

export async function setAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function verifyCredentials(username: string, password: string) {
  return username === AUTH_USER && password === AUTH_PASSWORD;
}
