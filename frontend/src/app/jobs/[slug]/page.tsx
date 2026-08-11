import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JobDetails } from "@/components/JobDetails";
import { connectToDatabase } from "@/lib/mongodb";
import JobOpportunity from "@/models/JobOpportunity";
import { SAMPLE_JOBS } from "@/lib/seedJobs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getJobData(slug: string) {
  const db = await connectToDatabase();
  if (!db) {
    return SAMPLE_JOBS.find((j) => j.slug === slug || j._id === slug) || null;
  }
  const job = await JobOpportunity.findOne({
    $or: [{ slug: slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
  }).lean();

  if (!job) return null;
  return JSON.parse(JSON.stringify(job));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobData(slug);

  if (!job) {
    return {
      title: "Opportunity Not Found | Job Hub",
      description: "The requested job opportunity could not be found.",
    };
  }

  const title = `${job.title} – ${job.companyName} | Job Opportunity`;
  const description = `Apply for the ${job.title} opportunity at ${job.companyName} in ${job.location}. Check eligibility, skills, salary, deadline and official application link.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://mywebsite.com/jobs/${job.slug || slug}`,
    },
  };
}

export default async function JobSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getJobData(slug);

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-white">Job Opportunity Not Found</h1>
            <p className="text-sm text-slate-400">
              The job posting you are looking for may have expired or been removed.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobDetails job={job} />
      </main>

      <Footer />
    </div>
  );
}
