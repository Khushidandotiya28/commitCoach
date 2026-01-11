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
    repoUrl: {
      type: String,
      required: true,
      unique: true,
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
  },
  { timestamps: true }
);

export default mongoose.model("RepoAnalysis", repoAnalysisSchema);
