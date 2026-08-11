import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_job_hub_jwt_key_2026";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AdminPayload {
  email: string;
  isAdmin: boolean;
}

export async function signAdminToken(email: string): Promise<string> {
  return await new SignJWT({ email, isAdmin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyJWTToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload && payload.isAdmin === true) {
      return {
        email: (payload.email as string) || "admin@jobhub.com",
        isAdmin: true,
      };
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function checkAdminPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (password === adminPassword) {
    return true;
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  }

  return false;
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function removeAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
}

export async function getAdminFromRequest(req?: NextRequest): Promise<AdminPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get("admin_token")?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get("admin_token")?.value;
  }

  if (!token) return null;
  return await verifyJWTToken(token);
}
