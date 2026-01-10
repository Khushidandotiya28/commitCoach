import RepoAnalysis from "../models/RepoAnalysis.model.js";
import parseRepoUrl from "../utils/parseRepoUrl.js";

const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ message: "Repo URL required" });
    }

    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) {
      return res.status(400).json({ message: "Invalid GitHub repo URL" });
    }

    const { owner, repo } = parsed;

    // GitHub commits API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits`
    );
    const commits = await response.json();

    const contributorsMap = {};
    commits.forEach((commit) => {
      const name = commit.commit.author.name;
      contributorsMap[name] = (contributorsMap[name] || 0) + 1;
    });

    const contributors = Object.entries(contributorsMap).map(
      ([name, commits]) => ({
        name,
        commits
      })
    );

    const analysis = await RepoAnalysis.create({
      repoUrl,
      owner,
      repoName: repo,
      totalCommits: commits.length,
      contributors,
      lastCommitDate: commits[0]?.commit.author.date
    });

    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: "Repo analysis failed" });
  }
};

export default analyzeRepo;
