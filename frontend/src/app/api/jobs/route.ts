import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import JobOpportunity, { slugify } from "@/models/JobOpportunity";
import { SAMPLE_JOBS } from "@/lib/seedJobs";
import { getAdminFromRequest } from "@/lib/auth";

let memoryJobs = [...SAMPLE_JOBS];

function isValidUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = (searchParams.get("q") || searchParams.get("search") || "").trim().toLowerCase();
    const sort = searchParams.get("sort") || "latest"; // 'latest' | 'oldest'
    const dateFilter = searchParams.get("dateFilter") || "all"; // 'all' | 'today' | '24h' | '7d' | '30d'

    const now = new Date();
    let startDate: Date | null = null;

    if (dateFilter === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateFilter === "24h") {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (dateFilter === "7d") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateFilter === "30d") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const db = await connectToDatabase();

    if (!db) {
      let filtered = [...memoryJobs];
      if (query) {
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(query) ||
            j.companyName.toLowerCase().includes(query) ||
            j.location.toLowerCase().includes(query) ||
            j.skills.some((s) => s.toLowerCase().includes(query))
        );
      }
      if (startDate) {
        filtered = filtered.filter((j) => new Date(j.postedDate) >= startDate);
      }
      filtered.sort((a, b) => {
        const dateA = new Date(a.postedDate).getTime();
        const dateB = new Date(b.postedDate).getTime();
        return sort === "oldest" ? dateA - dateB : dateB - dateA;
      });
      return NextResponse.json(filtered, { headers: { "X-Demo-Mode": "true" } });
    }

    const filterObject: Record<string, unknown> = {};

    if (query) {
      const regex = new RegExp(query, "i");
      filterObject.$or = [
        { title: regex },
        { companyName: regex },
        { location: regex },
        { skills: regex },
        { description: regex },
      ];
    }

    if (startDate) {
      filterObject.postedDate = { $gte: startDate };
    }

    const sortOrder = sort === "oldest" ? 1 : -1;
    const jobs = await JobOpportunity.find(filterObject).sort({ postedDate: sortOrder, createdAt: sortOrder });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ error: "JSON array is empty" }, { status: 400 });
      }

      const formattedJobs = [];
      const db = await connectToDatabase();

      for (let i = 0; i < body.length; i++) {
        const item = body[i];
        const {
          title,
          companyName,
          location = "Remote",
          jobType = "Full Time",
          workType = "On-site",
          experience = "0-1 Years",
          salary = "Not Disclosed",
          postedDate,
          deadline,
          description = "",
          responsibilities = [],
          eligibility = [],
          skills = [],
          sourceName,
          applicationUrl,
          instagramUrl = "",
        } = item;

        if (!title || typeof title !== "string" || !title.trim()) {
          return NextResponse.json(
            { error: `Item #${i + 1}: Job title is required` },
            { status: 400 }
          );
        }
        if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
          return NextResponse.json(
            { error: `Item #${i + 1} ("${title}"): Company name is required` },
            { status: 400 }
          );
        }
        if (!sourceName || typeof sourceName !== "string" || !sourceName.trim()) {
          return NextResponse.json(
            { error: `Item #${i + 1} ("${title}"): Source name is required` },
            { status: 400 }
          );
        }
        if (!applicationUrl || typeof applicationUrl !== "string" || !isValidUrl(applicationUrl.trim())) {
          return NextResponse.json(
            { error: `Item #${i + 1} ("${title}"): Valid application URL starting with http:// or https:// is required` },
            { status: 400 }
          );
        }

        let baseSlug = slugify(title.trim(), companyName.trim());
        let finalSlug = baseSlug;

        if (db) {
          const count = await JobOpportunity.countDocuments({ slug: finalSlug });
          if (count > 0) {
            finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
          }
        } else {
          finalSlug = `${baseSlug}-${Date.now()}-${i}`;
        }

        formattedJobs.push({
          title: title.trim(),
          slug: finalSlug,
          companyName: companyName.trim(),
          location: (location || "Remote").trim(),
          jobType: (jobType || "Full Time").trim(),
          workType: (workType || "On-site").trim(),
          experience: (experience || "0-1 Years").trim(),
          salary: (salary || "Not Disclosed").trim(),
          postedDate: postedDate ? new Date(postedDate) : new Date(),
          deadline: deadline ? new Date(deadline) : undefined,
          description: (description || "").trim(),
          responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
          eligibility: Array.isArray(eligibility) ? eligibility : [],
          skills: Array.isArray(skills) ? skills : [],
          sourceName: sourceName.trim(),
          applicationUrl: applicationUrl.trim(),
          instagramUrl: (instagramUrl || "").trim(),
        });
      }

      if (!db) {
        memoryJobs.unshift(...formattedJobs.map((j, idx) => ({ ...j, _id: `mem-${Date.now()}-${idx}` })));
        return NextResponse.json(formattedJobs, { status: 201, headers: { "X-Demo-Mode": "true" } });
      }

      const createdJobs = await JobOpportunity.insertMany(formattedJobs);
      return NextResponse.json(createdJobs, { status: 201 });
    }

    const {
      title,
      companyName,
      location,
      jobType = "Full Time",
      workType = "On-site",
      experience = "0-1 Years",
      salary = "Not Disclosed",
      postedDate,
      deadline,
      description = "",
      responsibilities = [],
      eligibility = [],
      skills = [],
      sourceName,
      applicationUrl,
      instagramUrl = "",
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    if (!sourceName || typeof sourceName !== "string" || !sourceName.trim()) {
      return NextResponse.json({ error: "Source name is required" }, { status: 400 });
    }

    if (!applicationUrl || typeof applicationUrl !== "string" || !isValidUrl(applicationUrl.trim())) {
      return NextResponse.json(
        { error: "Valid application URL starting with http:// or https:// is required" },
        { status: 400 }
      );
    }

    let baseSlug = slugify(title, companyName);
    let finalSlug = baseSlug;

    const db = await connectToDatabase();

    if (!db) {
      const existing = memoryJobs.find((j) => j.slug === finalSlug);
      if (existing) {
        finalSlug = `${baseSlug}-${Date.now()}`;
      }

      const newJob = {
        _id: `mem-job-${Date.now()}`,
        title: title.trim(),
        slug: finalSlug,
        companyName: companyName.trim(),
        location: (location || "Remote").trim(),
        jobType: jobType.trim(),
        workType: workType.trim(),
        experience: experience.trim(),
        salary: salary.trim(),
        postedDate: postedDate ? new Date(postedDate).toISOString() : new Date().toISOString(),
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        description: description.trim(),
        responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
        eligibility: Array.isArray(eligibility) ? eligibility : [],
        skills: Array.isArray(skills) ? skills : [],
        sourceName: sourceName.trim(),
        applicationUrl: applicationUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryJobs.unshift(newJob);
      return NextResponse.json(newJob, { status: 201, headers: { "X-Demo-Mode": "true" } });
    }

    const count = await JobOpportunity.countDocuments({ slug: finalSlug });
    if (count > 0) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const createdJob = await JobOpportunity.create({
      title: title.trim(),
      slug: finalSlug,
      companyName: companyName.trim(),
      location: (location || "Remote").trim(),
      jobType: jobType.trim(),
      workType: workType.trim(),
      experience: experience.trim(),
      salary: salary.trim(),
      postedDate: postedDate ? new Date(postedDate) : new Date(),
      deadline: deadline ? new Date(deadline) : undefined,
      description: description.trim(),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      eligibility: Array.isArray(eligibility) ? eligibility : [],
      skills: Array.isArray(skills) ? skills : [],
      sourceName: sourceName.trim(),
      applicationUrl: applicationUrl.trim(),
      instagramUrl: instagramUrl.trim(),
    });

    return NextResponse.json(createdJob, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/jobs error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create job opportunity" },
      { status: 500 }
    );
  }
}
