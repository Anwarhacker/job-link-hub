import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ReferralApp from "@/models/ReferralApp";

function verifyAdminAuth(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return true;
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ") && auth.substring(7) === adminPassword) return true;
  return false;
}

export async function GET(req: NextRequest) {
  try {
    const fetchAll = req.nextUrl.searchParams.get("all") === "true";
    await connectToDatabase();
    const query = fetchAll ? {} : { active: true };
    const apps = await ReferralApp.find(query).sort({ order: 1 });
    return NextResponse.json(apps);
  } catch {
    return NextResponse.json({ error: "Failed to fetch referral apps" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, url, bonus, referralCode = "", order = 0 } = await req.json();
    if (!name || !url || !bonus)
      return NextResponse.json({ error: "name, url and bonus are required" }, { status: 400 });

    await connectToDatabase();
    const app = await ReferralApp.create({ name: name.trim(), url: url.trim(), bonus: bonus.trim(), referralCode: referralCode.trim(), order });
    return NextResponse.json(app, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create referral app" }, { status: 500 });
  }
}
