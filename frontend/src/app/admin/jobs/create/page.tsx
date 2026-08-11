"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminNavbar } from "@/components/AdminNavbar";
import { ArrowLeft, Plus, X, Sparkles, Rocket, AlertCircle, FileCode2, Copy, Check, FormInput } from "lucide-react";

const SAMPLE_JSON_TEMPLATE = [
  {
    title: "Junior Software Engineer",
    companyName: "TechCorp Global",
    location: "Bengaluru, Karnataka",
    jobType: "Full Time",
    workType: "Hybrid",
    experience: "0-1 Years",
    salary: "₹4.5 LPA",
    postedDate: "2026-08-11",
    deadline: "2026-08-25",
    description: "Looking for enthusiastic Junior Software Engineers to build scalable web applications.",
    responsibilities: [
      "Develop frontend & backend features",
      "Participate in code reviews",
      "Write unit and integration tests"
    ],
    eligibility: [
      "B.E / B.Tech / BCA / MCA (2025/2026 Batch)",
      "Good understanding of JavaScript and Data Structures",
      "0–1 years experience"
    ],
    skills: ["React", "Node.js", "JavaScript", "SQL"],
    sourceName: "TechCorp Careers",
    applicationUrl: "https://example.com/apply/jse-123",
    instagramUrl: "https://instagram.com/p/sample"
  },
  {
    title: "AI Research Intern",
    companyName: "DeepMind Labs",
    location: "Remote",
    jobType: "Internship",
    workType: "Remote",
    experience: "Fresher",
    salary: "₹35,000 / month",
    postedDate: "2026-08-11",
    deadline: "2026-08-30",
    description: "Work with machine learning researchers to train deep neural network models.",
    responsibilities: [
      "Train ML models using PyTorch",
      "Clean and preprocess datasets"
    ],
    eligibility: [
      "Enrolled in CS or AI degree program",
      "Proficiency in Python and PyTorch / TensorFlow"
    ],
    skills: ["Python", "PyTorch", "AI/ML", "Deep Learning"],
    sourceName: "DeepMind Careers",
    applicationUrl: "https://example.com/apply/ai-intern",
    instagramUrl: ""
  }
];

export default function CreateJobPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"form" | "json">("form");

  // Form State
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [workType, setWorkType] = useState("On-site");
  const [experience, setExperience] = useState("0-1 Years");
  const [postedDate, setPostedDate] = useState(new Date().toISOString().split("T")[0]);
  const [deadline, setDeadline] = useState("");
  const [salary, setSalary] = useState("₹25,000 – ₹30,000 / month");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([
    "Develop AI models",
    "Conduct AI research",
    "Work with AI/ML technologies",
  ]);
  const [eligibility, setEligibility] = useState<string[]>([
    "Fresh graduates",
    "0-1 years experience",
    "Knowledge of Python",
    "Basic understanding of AI/ML",
  ]);
  const [skills, setSkills] = useState<string[]>(["Python", "Artificial Intelligence", "Machine Learning", "Research"]);
  const [sourceName, setSourceName] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  // JSON Import State
  const [jsonText, setJsonText] = useState(JSON.stringify(SAMPLE_JSON_TEMPLATE, null, 2));
  const [copied, setCopied] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(JSON.stringify(SAMPLE_JSON_TEMPLATE, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
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
      const res = await fetch("/api/jobs", {
        method: "POST",
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
        throw new Error(data.error || "Failed to create job opportunity");
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save job opportunity");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJsonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let parsedPayload: unknown;
    try {
      parsedPayload = JSON.parse(jsonText);
    } catch (syntaxErr: unknown) {
      return setError(`JSON Syntax Error: ${syntaxErr instanceof Error ? syntaxErr.message : "Invalid JSON string"}`);
    }

    if (!Array.isArray(parsedPayload) && typeof parsedPayload !== "object") {
      return setError("JSON input must be a Job Object or an Array of Job Objects");
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to import jobs from JSON");
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to import jobs from JSON");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNavbar />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <Link
            href="/admin/jobs"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
        </div>

        {/* Top Header & Tab Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              Add Opportunities <Sparkles className="w-5 h-5 text-blue-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Create single jobs or bulk import multiple opportunities via JSON.
            </p>
          </div>

          <div className="flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === "form"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FormInput className="w-4 h-4" /> Form Input
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("json")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === "json"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileCode2 className="w-4 h-4" /> Bulk JSON Import
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: FORM INPUT */}
        {activeTab === "form" ? (
          <form onSubmit={handleFormSubmit} className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-fade-in">
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
                <span>{submitting ? "Publishing..." : "Publish Job Opportunity"}</span>
              </button>
            </div>
          </form>
        ) : (
          /* TAB 2: BULK JSON IMPORT */
          <form onSubmit={handleJsonSubmit} className="space-y-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-blue-400" /> JSON Import Helper
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste an array of job objects in JSON format to create multiple opportunities instantly.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyTemplate}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied Sample JSON!" : "Copy Sample JSON Format"}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Paste JSON Array *
              </label>
              <textarea
                rows={16}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-blue-300 font-mono text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
                placeholder="[ { &quot;title&quot;: &quot;...&quot;, &quot;companyName&quot;: &quot;...&quot; } ]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Rocket className="w-5 h-5" />
                <span>{submitting ? "Importing Opportunities..." : "Import All Jobs from JSON"}</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
