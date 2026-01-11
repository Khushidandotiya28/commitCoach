import RepoAnalysis from "../models/RepoAnalysis.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { fetchAllCommits } from "../services/githubService.js";

const analyzeRepo = asyncHandler(async (req, res) => {
  const { repoUrl } = req.body; 
  const { owner, repo } = req.repo;

  const commits = await fetchAllCommits(owner, repo);

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
    const date = commit.commit.author.date.slice(0, 10); // YYYY-MM-DD
    commitStatsMap[date] = (commitStatsMap[date] || 0) + 1;
  });

  const commitStats = Object.entries(commitStatsMap).map(
    ([date, count]) => ({ date, count })
  );

  const analysis = await RepoAnalysis.findOneAndUpdate(
    { repoUrl },
   {
    repoUrl: req.body.repoUrl,
    owner,
    repoName: repo,
    totalCommits: commits.length,
    contributors,
    commitStats,
    lastCommitDate: commits[0]?.commit.author.date,
    analyzedAt: new Date(),
    },
    {
    new: true,        // return updated doc
    upsert: true,     // insert if not exists
    }

  );

  res.status(201).json({
    status: "success",
    data: analysis
  });
});

export default analyzeRepo;
