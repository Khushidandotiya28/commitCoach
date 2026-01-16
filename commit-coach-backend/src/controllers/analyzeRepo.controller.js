import RepoAnalysis from "../models/RepoAnalysis.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { fetchAllCommits } from "../services/githubService.js";
import { analyzeRepoWithGemini } from "../services/aiAnalysis.service.js";
import { calculateRepoMetrics } from "../utils/repoMetrics.js";
import { evaluateRepoHealth } from "../utils/repoHealth.js";

const analyzeRepo = asyncHandler(async (req, res) => {
  const { repoUrl } = req.body;
  const userId = req.user._id;
  const { owner, repo } = req.repo;

  // 1️⃣ Fetch commits
  const commits = await fetchAllCommits(owner, repo);

  // 2️⃣ Contributors
  const contributorsMap = {};
  commits.forEach((commit) => {
    const name = commit.commit.author.name;
    contributorsMap[name] = (contributorsMap[name] || 0) + 1;
  });

  const contributors = Object.entries(contributorsMap).map(
    ([name, commits]) => ({ name, commits })
  );

  // 3️⃣ Commit stats
  const commitStatsMap = {};
  commits.forEach((commit) => {
    const date = commit.commit.author.date.slice(0, 10);
    commitStatsMap[date] = (commitStatsMap[date] || 0) + 1;
  });

  const commitStats = Object.entries(commitStatsMap).map(
    ([date, count]) => ({ date, count })
  );

  // 4️⃣ Metrics
  const metrics = calculateRepoMetrics(commits, contributors);

  // 5️⃣ Health
  const healthReport = evaluateRepoHealth(metrics);

  // 6️⃣ Save analysis
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

  // 7️⃣ AI Interpretation (SAFE)
  let aiInsights = null;

  try {
    aiInsights = await analyzeRepoWithGemini(analysis.toObject());
  } catch (error) {
    console.error("AI analysis failed:", error.message);
    aiInsights = "AI analysis temporarily unavailable";
  }

  // 8️⃣ SINGLE RESPONSE ✅
  res.status(200).json({
    status: "success",
    data: analysis,
    aiInsights,
  });
});

export default analyzeRepo;
