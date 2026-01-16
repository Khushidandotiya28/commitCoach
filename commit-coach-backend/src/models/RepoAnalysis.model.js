import mongoose from "mongoose";

const contributorSchema = new mongoose.Schema({
  name: String,
  commits: Number,
});

const commitStatsSchema = new mongoose.Schema({
  date: String,     // YYYY-MM-DD
  count: Number,
});

const repoAnalysisSchema = new mongoose.Schema(
  {  
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },

    repoUrl: {
      type: String,
      required: true,
      //unique: true, 
    },
    owner: String,
    repoName: String,

    totalCommits: Number,

    contributors: [contributorSchema],

    commitStats: [commitStatsSchema],

    lastCommitDate: Date,

    analyzedAt: {
      type: Date,
      default: Date.now,
    },

    avgCommitsPerDay: Number,
    maxGapDays: Number,
    busFactor: Number,

    repoHealth: String,
    technicalDebt: String,
    risks: [String],
  },

  { timestamps: true },
);
  repoAnalysisSchema.index(
  { userId: 1, repoUrl: 1 },
  { unique: true }
  )
export default mongoose.model("RepoAnalysis", repoAnalysisSchema);
