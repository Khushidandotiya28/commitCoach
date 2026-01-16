import AppError from "../utils/AppError.js";
import { getCache, setCache } from "../utils/cache.js";

const GITHUB_API = "https://api.github.com";

export const fetchAllCommits = async (owner, repo) => {
  const cacheKey = `commits:${owner}/${repo}`;

  // Check cache first
  const cachedCommits = getCache(cacheKey);
  if (cachedCommits) {
    return cachedCommits;
  }

  let page = 1;
  let allCommits = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=100&page=${page}`
    );

    if (!response.ok) {
      const remaining = response.headers.get("x-ratelimit-remaining");

      if (remaining === "0") {
        throw new AppError("GitHub API rate limit exceeded", 429);
      }

      throw new AppError("Failed to fetch commits from GitHub", response.status);
    }

    const commits = await response.json();
    allCommits = allCommits.concat(commits);
    hasMore = commits.length === 100;
    page++;
  }

  // Store in cache
  setCache(cacheKey, allCommits);

  return allCommits;
};
