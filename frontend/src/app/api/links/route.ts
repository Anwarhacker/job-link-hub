import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Link from "@/models/Link";
import { SAMPLE_LINKS } from "@/lib/seedData";

// In-memory store for fallback demo mode if DB is not connected
let memoryLinks = [...SAMPLE_LINKS];

function isValidUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function verifyAdminAuth(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return true;

  const authHeader = req.headers.get("authorization");
  const xPassword = req.headers.get("x-admin-password");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (token === adminPassword) return true;
  }

  if (xPassword === adminPassword) return true;

  return false;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const fetchAll = searchParams.get("all") === "true";

    const db = await connectToDatabase();

    if (!db) {
      const filtered = fetchAll ? memoryLinks : memoryLinks.filter((l) => l.active);
      const sorted = [...filtered].sort((a, b) => a.order - b.order);
      return NextResponse.json(sorted, {
        headers: { "X-Demo-Mode": "true" },
      });
    }

    const query = fetchAll ? {} : { active: true };
    const links = await Link.find(query).sort({ order: 1 });

    return NextResponse.json(links, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/links error:", error);
    return NextResponse.json(
      { error: "Failed to fetch links from database." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({ error: "Unauthorized: Invalid admin password" }, { status: 401 });
    }

    const body = await req.json();

    // Check if bulk insertion (array of links)
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ error: "Empty array provided" }, { status: 400 });
      }

      const validLinks = [];
      for (const item of body) {
        const { title, description, url, icon = "link", order = 0, active = true } = item;
        if (!title || !description || !url || !isValidUrl(url.trim())) {
          return NextResponse.json(
            { error: `Invalid item in bulk list: "${title || 'Untitled'}". Valid Title, Description, and URL required.` },
            { status: 400 }
          );
        }
        validLinks.push({
          title: title.trim(),
          description: description.trim(),
          url: url.trim(),
          icon: icon.trim() || "link",
          order: Number(order) || 0,
          active: Boolean(active),
        });
      }

      const db = await connectToDatabase();
      if (!db) {
        const createdInMem = validLinks.map((l, idx) => ({
          ...l,
          _id: `mem-${Date.now()}-${idx}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        memoryLinks.push(...createdInMem);
        return NextResponse.json(createdInMem, { status: 201, headers: { "X-Demo-Mode": "true" } });
      }

      const createdDocs = await Link.insertMany(validLinks);
      return NextResponse.json(createdDocs, { status: 201 });
    }

    // Single link insertion
    const { title, description, url, icon = "link", order = 0, active = true } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    if (!url || typeof url !== "string" || !isValidUrl(url.trim())) {
      return NextResponse.json(
        { error: "Valid URL starting with http:// or https:// is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      const newLink = {
        _id: `mem-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        url: url.trim(),
        icon: icon || "link",
        order: Number(order) || 0,
        active: Boolean(active),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryLinks.push(newLink);
      return NextResponse.json(newLink, { status: 201, headers: { "X-Demo-Mode": "true" } });
    }

    const newLink = await Link.create({
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      icon: icon.trim() || "link",
      order: Number(order) || 0,
      active: Boolean(active),
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/links error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create link" },
      { status: 500 }
    );
  }
}
