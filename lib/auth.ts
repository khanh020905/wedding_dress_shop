import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined in environment variables.");
}
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7 d")
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(username: string) {
  const user = { username };

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  const cookieStore = await cookies();
  cookieStore.set(process.env.SESSION_COOKIE_NAME || "dd_admin_session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set(process.env.SESSION_COOKIE_NAME || "dd_admin_session", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(process.env.SESSION_COOKIE_NAME || "dd_admin_session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function verifyAuth() {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return null;
    }
    return session.user;
  } catch (error) {
    return null;
  }
}
