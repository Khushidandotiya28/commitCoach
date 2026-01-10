import mongoose from "mongoose";

const repoAnalysisSchema = new mongoose.Schema(
  {
    repoUrl: {
      type: String,
      required: true,
      unique: true
    },
    owner: String,
    repoName: String,
    totalCommits: Number,
    contributors: [
      {
        name: String,
        commits: Number
      }
    ],
    lastCommitDate: Date
  },
  { timestamps: true }
);

export default mongoose.model("RepoAnalysis", repoAnalysisSchema);
