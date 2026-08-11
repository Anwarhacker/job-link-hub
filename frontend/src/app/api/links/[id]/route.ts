import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Link from "@/models/Link";
import { SAMPLE_LINKS } from "@/lib/seedData";
import mongoose from "mongoose";

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({ error: "Unauthorized: Invalid admin password" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description, url, icon, order, active } = body;

    if (url && !isValidUrl(url.trim())) {
      return NextResponse.json(
        { error: "Valid URL starting with http:// or https:// is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      // Memory fallback mode
      const idx = SAMPLE_LINKS.findIndex((l) => l._id === id);
      if (idx !== -1) {
        SAMPLE_LINKS[idx] = {
          ...SAMPLE_LINKS[idx],
          ...(title && { title: title.trim() }),
          ...(description && { description: description.trim() }),
          ...(url && { url: url.trim() }),
          ...(icon !== undefined && { icon: icon.trim() }),
          ...(order !== undefined && { order: Number(order) }),
          ...(active !== undefined && { active: Boolean(active) }),
          updatedAt: new Date().toISOString(),
        };
        return NextResponse.json(SAMPLE_LINKS[idx], { status: 200 });
      }
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Link ID format" }, { status: 400 });
    }

    const updateFields: Record<string, unknown> = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (url !== undefined) updateFields.url = url.trim();
    if (icon !== undefined) updateFields.icon = icon.trim();
    if (order !== undefined) updateFields.order = Number(order);
    if (active !== undefined) updateFields.active = Boolean(active);

    const updatedLink = await Link.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json(updatedLink, { status: 200 });
  } catch (error: unknown) {
    console.error("PUT /api/links/[id] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update link" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({ error: "Unauthorized: Invalid admin password" }, { status: 401 });
    }

    const { id } = await params;
    const db = await connectToDatabase();

    if (!db) {
      // Memory fallback mode
      const idx = SAMPLE_LINKS.findIndex((l) => l._id === id);
      if (idx !== -1) {
        const deleted = SAMPLE_LINKS.splice(idx, 1)[0];
        return NextResponse.json({ message: "Link deleted", deleted }, { status: 200 });
      }
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Link ID format" }, { status: 400 });
    }

    const deletedLink = await Link.findByIdAndDelete(id);

    if (!deletedLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Link deleted successfully", id }, { status: 200 });
  } catch (error: unknown) {
    console.error("DELETE /api/links/[id] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete link" },
      { status: 500 }
    );
  }
}
