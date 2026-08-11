import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import JobOpportunity, { slugify } from "@/models/JobOpportunity";
import { SAMPLE_JOBS } from "@/lib/seedJobs";
import { getAdminFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

function isValidUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (!db) {
      const found = SAMPLE_JOBS.find((j) => j._id === id || j.slug === id);
      if (found) return NextResponse.json(found, { status: 200 });
      return NextResponse.json({ error: "Job opportunity not found" }, { status: 404 });
    }

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { slug: id };
    }

    const job = await JobOpportunity.findOne(query);
    if (!job) {
      return NextResponse.json({ error: "Job opportunity not found" }, { status: 404 });
    }

    return NextResponse.json(job, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/jobs/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch job details" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (body.applicationUrl && !isValidUrl(body.applicationUrl.trim())) {
      return NextResponse.json(
        { error: "Valid application URL starting with http:// or https:// is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      const idx = SAMPLE_JOBS.findIndex((j) => j._id === id || j.slug === id);
      if (idx !== -1) {
        SAMPLE_JOBS[idx] = {
          ...SAMPLE_JOBS[idx],
          ...body,
          updatedAt: new Date().toISOString(),
        };
        return NextResponse.json(SAMPLE_JOBS[idx], { status: 200 });
      }
      return NextResponse.json({ error: "Job opportunity not found" }, { status: 404 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Job ID format" }, { status: 400 });
    }

    const updateFields = { ...body };
    if (body.title && body.companyName) {
      updateFields.slug = slugify(body.title, body.companyName);
    }

    const updatedJob = await JobOpportunity.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return NextResponse.json({ error: "Job opportunity not found" }, { status: 404 });
    }

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error: unknown) {
    console.error("PUT /api/jobs/[id] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update job opportunity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await connectToDatabase();

    if (!db) {
      const idx = SAMPLE_JOBS.findIndex((j) => j._id === id || j.slug === id);
      if (idx !== -1) {
        const deleted = SAMPLE_JOBS.splice(idx, 1)[0];
        return NextResponse.json({ message: "Job opportunity deleted", deleted }, { status: 200 });
      }
      return NextResponse.json({ error: "Job opportunity not found" }, { status: 404 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Job ID format" }, { status: 400 });
    }

    const deletedJob = await JobOpportunity.findByIdAndDelete(id);
    if (!deletedJob) {
      return NextResponse.json({ error: "Job opportunity not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job opportunity deleted successfully", id }, { status: 200 });
  } catch (error: unknown) {
    console.error("DELETE /api/jobs/[id] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete job opportunity" },
      { status: 500 }
    );
  }
}
