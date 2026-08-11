import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://patelanwar647_db_user:UGl4Wf63ERTE47o5@cluster0.6yx6dv3.mongodb.net/linkhub?retryWrites=true&w=majority&appName=Cluster0";

const JobOpportunitySchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    companyName: String,
    location: String,
    jobType: String,
    workType: String,
    experience: String,
    salary: String,
    postedDate: Date,
    deadline: Date,
    description: String,
    responsibilities: [String],
    eligibility: [String],
    skills: [String],
    sourceName: String,
    applicationUrl: String,
    instagramUrl: String,
  },
  { timestamps: true }
);

const JobOpportunity = mongoose.models.JobOpportunity || mongoose.model("JobOpportunity", JobOpportunitySchema, "job_opportunities");

async function seed() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const count = await JobOpportunity.countDocuments();
  if (count === 0) {
    console.log("Seeding initial opportunity...");
    await JobOpportunity.create({
      title: "Junior AI Research Associate",
      slug: "junior-ai-research-associate-rooman-technologies",
      companyName: "Rooman Technologies",
      location: "Rajaji Nagar, Bengaluru",
      jobType: "Full Time",
      workType: "On-site",
      experience: "Fresher / 0–1 Years",
      salary: "₹25,000 – ₹30,000 / month",
      postedDate: new Date("2026-08-11"),
      deadline: new Date("2026-08-21"),
      description: "Develop AI models and conduct AI research. Join our team at Rooman Technologies to work on cutting-edge machine learning applications.",
      responsibilities: [
        "Develop AI models",
        "Conduct AI research",
        "Work with AI/ML technologies",
      ],
      eligibility: [
        "Fresh graduates",
        "0–1 years experience",
        "Knowledge of Python",
        "Basic understanding of AI/ML",
      ],
      skills: ["Python", "Artificial Intelligence", "Machine Learning", "Research"],
      sourceName: "Rooman Technologies",
      applicationUrl: "https://example.com/apply",
      instagramUrl: "https://instagram.com/",
    });
    console.log("Seed job created successfully!");
  } else {
    console.log(`Database already has ${count} opportunities.`);
  }

  await mongoose.disconnect();
  console.log("Disconnected.");
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
