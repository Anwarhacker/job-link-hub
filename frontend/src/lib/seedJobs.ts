import { JobOpportunityDTO, slugify } from "@/models/JobOpportunity";

export const SAMPLE_JOBS: JobOpportunityDTO[] = [
  {
    _id: "job-seed-1",
    title: "Junior AI Research Associate",
    slug: slugify("Junior AI Research Associate", "Rooman Technologies"),
    companyName: "Rooman Technologies",
    location: "Rajaji Nagar, Bengaluru",
    jobType: "Full Time",
    workType: "On-site",
    experience: "Fresher / 0–1 Years",
    salary: "₹25,000 – ₹30,000 / month",
    postedDate: "2026-08-11T00:00:00.000Z",
    deadline: "2026-08-21T23:59:59.000Z",
    description:
      "Develop AI models and conduct AI research. Join our team at Rooman Technologies to work on cutting-edge machine learning applications and computer vision algorithms.",
    responsibilities: [
      "Develop AI models",
      "Conduct AI research",
      "Work with AI/ML technologies",
      "Analyze datasets and optimize algorithm performance",
    ],
    eligibility: [
      "Fresh graduates in CSE, AI, IT, or related fields",
      "0–1 years experience",
      "Knowledge of Python programming",
      "Basic understanding of AI/ML concepts and frameworks",
    ],
    skills: ["Python", "Artificial Intelligence", "Machine Learning", "Research"],
    sourceName: "Rooman Technologies",
    applicationUrl: "https://example.com/apply",
    instagramUrl: "https://instagram.com/",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
