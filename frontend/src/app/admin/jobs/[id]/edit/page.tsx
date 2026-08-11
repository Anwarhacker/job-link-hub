"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminNavbar } from "@/components/AdminNavbar";
import { ArrowLeft, Plus, X, Sparkles, Rocket, AlertCircle } from "lucide-react";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditJobPage({ params }: EditPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [workType, setWorkType] = useState("On-site");
  const [experience, setExperience] = useState("0-1 Years");

  const [postedDate, setPostedDate] = useState("");
  const [deadline, setDeadline] = useState("");

  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const [sourceName, setSourceName] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) throw new Error("Failed to load job details");
        const job = await res.json();

        setTitle(job.title || "");
        setCompanyName(job.companyName || "");
        setLocation(job.location || "");
        setJobType(job.jobType || "Full Time");
        setWorkType(job.workType || "On-site");
        setExperience(job.experience || "0-1 Years");

        if (job.postedDate) {
          setPostedDate(new Date(job.postedDate).toISOString().split("T")[0]);
        }
        if (job.deadline) {
          setDeadline(new Date(job.deadline).toISOString().split("T")[0]);
        }

        setSalary(job.salary || "");
        setDescription(job.description || "");

        setResponsibilities(
          Array.isArray(job.responsibilities) && job.responsibilities.length > 0
            ? job.responsibilities
            : [""]
        );
        setEligibility(
          Array.isArray(job.eligibility) && job.eligibility.length > 0
            ? job.eligibility
            : [""]
        );
        setSkills(
          Array.isArray(job.skills) && job.skills.length > 0 ? job.skills : [""]
        );

        setSourceName(job.sourceName || "");
        setApplicationUrl(job.applicationUrl || "");
        setInstagramUrl(job.instagramUrl || "");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading job");
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id]);

  const handleAddResponsibility = () => setResponsibilities([...responsibilities, ""]);
  const handleRemoveResponsibility = (i: number) =>
    setResponsibilities(responsibilities.filter((_, idx) => idx !== i));
  const handleResponsibilityChange = (i: number, val: string) => {
    const updated = [...responsibilities];
    updated[i] = val;
    setResponsibilities(updated);
  };

  const handleAddEligibility = () => setEligibility([...eligibility, ""]);
  const handleRemoveEligibility = (i: number) =>
    setEligibility(eligibility.filter((_, idx) => idx !== i));
  const handleEligibilityChange = (i: number, val: string) => {
    const updated = [...eligibility];
    updated[i] = val;
    setEligibility(updated);
  };

  const handleAddSkill = () => setSkills([...skills, ""]);
  const handleRemoveSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));
  const handleSkillChange = (i: number, val: string) => {
    const updated = [...skills];
    updated[i] = val;
    setSkills(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Job Title is required");
    if (!companyName.trim()) return setError("Company Name is required");
    if (!location.trim()) return setError("Location is required");
    if (!sourceName.trim()) return setError("Source Name is required");
    if (!applicationUrl.trim()) return setError("Application URL is required");

    try {
      new URL(applicationUrl.trim());
    } catch {
      return setError("Please enter a valid Application URL (e.g. https://example.com/apply)");
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          companyName: companyName.trim(),
          location: location.trim(),
          jobType,
          workType,
          experience: experience.trim(),
          postedDate,
          deadline: deadline ? deadline : undefined,
          salary: salary.trim(),
          description: description.trim(),
          responsibilities: responsibilities.filter((r) => r.trim().length > 0),
          eligibility: eligibility.filter((e) => e.trim().length > 0),
          skills: skills.filter((s) => s.trim().length > 0),
          sourceName: sourceName.trim(),
          applicationUrl: applicationUrl.trim(),
          instagramUrl: instagramUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update job opportunity");
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update job opportunity");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center p-6 text-slate-400 text-sm animate-pulse">
          Loading opportunity details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNavbar />

      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <Link
            href="/admin/jobs"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        <div className="space-y-1 border-b border-slate-800 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            Edit Job Opportunity <Sparkles className="w-5 h-5 text-blue-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Update opportunity details or modify the application link.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
              1. Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Junior AI Research Associate"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rooman Technologies"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajaji Nagar, Bengaluru"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Work Type
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Experience
              </label>
              <input
                type="text"
                placeholder="e.g. Fresher / 0–1 Years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Dates & Compensation */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
              2. Dates & Compensation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Posted Date *
                </label>
                <input
                  type="date"
                  value={postedDate}
                  onChange={(e) => setPostedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Salary / Compensation
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹25,000 – ₹30,000 / month"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Role Details */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
              3. Description & Bullet Points
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job Description
              </label>
              <textarea
                rows={4}
                placeholder="Develop AI models and conduct AI research..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Key Responsibilities
              </label>
              {responsibilities.map((resp, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Responsibility #${i + 1}`}
                    value={resp}
                    onChange={(e) => handleResponsibilityChange(i, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                  {responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(i)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Responsibility Item
              </button>
            </div>

            {/* Eligibility */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-300">
                Eligibility Requirements
              </label>
              {eligibility.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Requirement #${i + 1}`}
                    value={item}
                    onChange={(e) => handleEligibilityChange(i, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                  {eligibility.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEligibility(i)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddEligibility}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Eligibility Item
              </button>
            </div>

            {/* Skills */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-300">
                Skills / Keywords
              </label>
              {skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Skill (e.g. Python, AI/ML)`}
                    value={skill}
                    onChange={(e) => handleSkillChange(i, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                  {skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(i)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSkill}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill Tag
              </button>
            </div>
          </div>

          {/* Original Source & Instagram */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
              4. Original Application Source & Instagram Link
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Source Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rooman Technologies / LinkedIn"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Application URL *
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/apply"
                  value={applicationUrl}
                  onChange={(e) => setApplicationUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Instagram Post URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/p/..."
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Rocket className="w-4 h-4" />
              <span>{submitting ? "Saving Changes..." : "Update Job Opportunity"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
