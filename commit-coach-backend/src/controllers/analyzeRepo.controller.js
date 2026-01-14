// controllers/analyzeRepo.controller.js
import RepoAnalysis from "../models/RepoAnalysis.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { fetchAllCommits } from "../services/githubService.js";
import { analyzeRepoWithAI } from "../services/aiAnalysis.service.js";
import { calculateRepoMetrics } from "../utils/repoMetrics.js";
import { evaluateRepoHealth } from "../utils/repoHealth.js";

const analyzeRepo = asyncHandler(async (req, res) => {
  const { repoUrl } = req.body;
  const { owner, repo } = req.repo;


  const metrics = calculateRepoMetrics(commits, contributors);
  const healthReport = evaluateRepoHealth(metrics);


  const commits = await fetchAllCommits(owner, repo);

  // ---- existing stats logic ----
  const contributorsMap = {};
  commits.forEach((commit) => {
    const name = commit.commit.author.name;
    contributorsMap[name] = (contributorsMap[name] || 0) + 1;
  });

  const contributors = Object.entries(contributorsMap).map(
    ([name, commits]) => ({ name, commits })
  );

  const commitStatsMap = {};
  commits.forEach((commit) => {
    const date = commit.commit.author.date.slice(0, 10);
    commitStatsMap[date] = (commitStatsMap[date] || 0) + 1;
  });

  const commitStats = Object.entries(commitStatsMap).map(
    ([date, count]) => ({ date, count })
  );

  const analysis = await RepoAnalysis.findOneAndUpdate(
    { repoUrl },
    {
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

  // ---------- AI INTERPRETATION (DAY 8) ----------
  let aiResult = null;

  try {
    aiResult = await analyzeRepoWithAI({
      totalCommits: analysis.totalCommits,
      contributorsCount: analysis.contributors.length,
      commitStats: analysis.commitStats,
    });
  } catch (err) {
    console.error("AI analysis failed:", err.message);
  }

  // ---------- RESPONSE ----------
  res.status(200).json({
    status: "success",
    data: analysis,
    aiInsights: aiResult || {
      message: "AI analysis unavailable",
    },
  });
});

export default analyzeRepo;
