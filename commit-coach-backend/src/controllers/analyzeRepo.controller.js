import RepoAnalysis from "../models/RepoAnalysis.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { fetchAllCommits } from "../services/githubService.js";
import { analyzeRepoWithGemini } from "../services/aiAnalysis.service.js";
import { calculateRepoMetrics } from "../utils/repoMetrics.js";
import { evaluateRepoHealth } from "../utils/repoHealth.js";

export const analyzeRepo = asyncHandler(async (req, res) => {
  const { repoUrl } = req.body;
  const userId = req.user._id;
  const { owner, repo } = req.repo;

  // Fetch commits
  const commits = await fetchAllCommits(owner, repo);

  // Contributors
  const contributorsMap = {};
  commits.forEach((commit) => {
    const name = commit.commit.author.name;
    contributorsMap[name] = (contributorsMap[name] || 0) + 1;
  });

  const contributors = Object.entries(contributorsMap).map(
    ([name, commits]) => ({ name, commits })
  );

  // Commit stats
  const commitStatsMap = {};
  commits.forEach((commit) => {
    const date = commit.commit.author.date.slice(0, 10);
    commitStatsMap[date] = (commitStatsMap[date] || 0) + 1;
  });

  const commitStats = Object.entries(commitStatsMap).map(
    ([date, count]) => ({ date, count })
  );

  // Metrics
  const metrics = calculateRepoMetrics(commits, contributors);

  // Health
  const healthReport = evaluateRepoHealth(metrics);

  // Save analysis
  const analysis = await RepoAnalysis.findOneAndUpdate(
    { repoUrl, userId },
    {
      userId,
      repoUrl,
      owner,
      repoName: repo,
      totalCommits: commits.length,
      contributors,
      commitStats,
      lastCommitDate: commits[0]?.commit.author.date,
      analyzedAt: new Date(),

      avgCommitsPerDay: metrics.avgCommitsPerDay,
      maxGapDays: metrics.maxGapDays,
      busFactor: metrics.busFactor,

      repoHealth: healthReport.repoHealth,
      technicalDebt: healthReport.technicalDebt,
      risks: healthReport.risks,
    },
    { new: true, upsert: true }
  );

  // AI Interpretation 
  let aiInsights = null;

  try {
    aiInsights = await analyzeRepoWithGemini(analysis.toObject());
  } catch (error) {
    console.error("AI analysis failed:", error.message);
    aiInsights = "AI analysis temporarily unavailable";
  }

  // SINGLE RESPONSE 
  res.status(200).json({
    status: "success",
    data: analysis,
    aiInsights,
  });
});

export const deleteRepo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const repo = await RepoAnalysis.findOne({ _id: id, userId });

  if (!repo) {
    return res.status(404).json({
      status: "fail",
      message: "Analysis not found or you do not have permission to delete it.",
    });
  }

  await RepoAnalysis.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "Repository analysis deleted successfully.",
  });
});
