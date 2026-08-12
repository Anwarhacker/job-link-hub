import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ReferralApp, { ReferralAppDTO } from "@/models/ReferralApp";
import { getAdminFromRequest } from "@/lib/auth";

let memoryReferrals: ReferralAppDTO[] = [];

export async function GET(req: NextRequest) {
  try {
    const fetchAll = req.nextUrl.searchParams.get("all") === "true";
    const db = await connectToDatabase();

    if (!db) {
      const filtered = fetchAll ? memoryReferrals : memoryReferrals.filter((r) => r.active !== false);
      const sorted = [...filtered].sort((a, b) => a.order - b.order);
      return NextResponse.json(sorted, { headers: { "X-Demo-Mode": "true" } });
    }

    const query = fetchAll ? {} : { active: true };
    const apps = await ReferralApp.find(query).sort({ order: 1 });
    return NextResponse.json(apps, { status: 200 });
  } catch (error) {
    console.error("GET /api/referrals error:", error);
    return NextResponse.json({ error: "Failed to fetch referral apps" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, url, bonus, referralCode = "", order = 0 } = await req.json();
    if (!name || !url || !bonus) {
      return NextResponse.json({ error: "Name, URL and bonus are required" }, { status: 400 });
    }

    const db = await connectToDatabase();

    if (!db) {
      const newRef: ReferralAppDTO = {
        _id: `mem-ref-${Date.now()}`,
        name: name.trim(),
        url: url.trim(),
        bonus: bonus.trim(),
        referralCode: referralCode.trim(),
        order: Number(order) || 0,
        active: true,
      };
      memoryReferrals.push(newRef);
      return NextResponse.json(newRef, { status: 201, headers: { "X-Demo-Mode": "true" } });
    }

    const app = await ReferralApp.create({
      name: name.trim(),
      url: url.trim(),
      bonus: bonus.trim(),
      referralCode: referralCode.trim(),
      order: Number(order) || 0,
      active: true,
    });
    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    console.error("POST /api/referrals error:", error);
    return NextResponse.json({ error: "Failed to create referral app" }, { status: 500 });
  }
}
