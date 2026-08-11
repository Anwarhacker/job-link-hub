import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, signAdminToken, setAdminCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL || "admin@jobhub.com";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await checkAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signAdminToken(adminEmail);
    await setAdminCookie(token);

    return NextResponse.json({ success: true, message: "Logged in successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
