import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJobOpportunity extends Document {
  title: string;
  slug: string;
  companyName: string;
  location: string;
  jobType: string;
  workType: string;
  experience: string;
  salary: string;
  postedDate: Date;
  deadline?: Date;
  description: string;
  responsibilities: string[];
  eligibility: string[];
  skills: string[];
  sourceName: string;
  applicationUrl: string;
  instagramUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type JobOpportunityDTO = {
  _id?: string;
  title: string;
  slug: string;
  companyName: string;
  location: string;
  jobType: string;
  workType: string;
  experience: string;
  salary: string;
  postedDate: string | Date;
  deadline?: string | Date;
  description: string;
  responsibilities: string[];
  eligibility: string[];
  skills: string[];
  sourceName: string;
  applicationUrl: string;
  instagramUrl?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export function slugify(title: string, companyName: string): string {
  const combined = `${title} ${companyName}`;
  return combined
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const JobOpportunitySchema: Schema<IJobOpportunity> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    jobType: {
      type: String,
      default: "Full Time",
      trim: true,
    },
    workType: {
      type: String,
      default: "On-site",
      trim: true,
    },
    experience: {
      type: String,
      default: "0-1 Years",
      trim: true,
    },
    salary: {
      type: String,
      default: "Not Disclosed",
      trim: true,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    description: {
      type: String,
      default: "",
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    sourceName: {
      type: String,
      required: [true, "Source name is required"],
      trim: true,
    },
    applicationUrl: {
      type: String,
      required: [true, "Application URL is required"],
      trim: true,
    },
    instagramUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const JobOpportunity: Model<IJobOpportunity> =
  mongoose.models.JobOpportunity ||
  mongoose.model<IJobOpportunity>("JobOpportunity", JobOpportunitySchema, "job_opportunities");

export default JobOpportunity;
