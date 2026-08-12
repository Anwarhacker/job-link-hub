import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import VisitorStats from "@/models/VisitorStats";

let memoryStats = {
  totalVisits: 1,
  uniqueVisitors: 1,
  lastVisitedAt: new Date().toISOString(),
};

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json(memoryStats, { headers: { "X-Demo-Mode": "true" } });
    }

    let stats = await VisitorStats.findOne();
    if (!stats) {
      stats = await VisitorStats.create({ totalVisits: 0, uniqueVisitors: 0, lastVisitedAt: new Date() });
    }

    return NextResponse.json(
      {
        totalVisits: stats.totalVisits,
        uniqueVisitors: stats.uniqueVisitors,
        lastVisitedAt: stats.lastVisitedAt ? stats.lastVisitedAt.toISOString() : new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/stats/visitor error:", error);
    return NextResponse.json({ error: "Failed to fetch visitor stats" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const isNewVisitor = Boolean(body.isNewVisitor);

    const db = await connectToDatabase();

    if (!db) {
      memoryStats.totalVisits += 1;
      if (isNewVisitor) memoryStats.uniqueVisitors += 1;
      memoryStats.lastVisitedAt = new Date().toISOString();
      return NextResponse.json(memoryStats, { status: 200, headers: { "X-Demo-Mode": "true" } });
    }

    let stats = await VisitorStats.findOne();
    if (!stats) {
      stats = new VisitorStats({ totalVisits: 0, uniqueVisitors: 0 });
    }

    stats.totalVisits += 1;
    if (isNewVisitor) {
      stats.uniqueVisitors += 1;
    }
    stats.lastVisitedAt = new Date();
    await stats.save();

    return NextResponse.json(
      {
        totalVisits: stats.totalVisits,
        uniqueVisitors: stats.uniqueVisitors,
        lastVisitedAt: stats.lastVisitedAt.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/stats/visitor error:", error);
    return NextResponse.json({ error: "Failed to update visitor stats" }, { status: 500 });
  }
}
