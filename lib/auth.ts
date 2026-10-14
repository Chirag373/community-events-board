import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";
import { ApiError } from "./http";
function secretKey() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
    throw new Error("Set JWT_SECRET to at least 32 characters.");
  return new TextEncoder().encode(process.env.JWT_SECRET);
}
export async function createToken(id: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuer("community-events")
    .setAudience("community-events-api")
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}
export async function getCurrentUser(request?: Request) {
  // Web browsers send the cookie. Mobile clients can send a Bearer token.
  const cookieStore = await cookies();
  let token = cookieStore.get("session")?.value;
  const authorization = request?.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    token = authorization.slice(7);
  }
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
      issuer: "community-events",
      audience: "community-events-api",
    });
    return await db.user.findUnique({
      where: { id: payload.sub || "" },
      select: { id: true, email: true, role: true },
    });
  } catch {
    return null;
  }
}
// Only admins may use the event-management APIs.
export async function requireAdmin(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) throw new ApiError(401, "Please log in to continue.");
  if (user.role !== "ADMIN") throw new ApiError(403, "Admin access required.");
  return user;
}

export async function setSession(token: string) {
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 604800,
  });
}
