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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdminAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await connectToDatabase();
    const updated = await ReferralApp.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdminAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    await ReferralApp.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
