function countCommitsByContributor(commits) {
  const map = {};

  for (const commit of commits) {
    const author = commit.author?.login || "unknown";

    map[author] = (map[author] || 0) + 1;
  }

  return map;
}


function sortContributors(commitMap) {
  return Object.entries(commitMap)
    .sort((a, b) => b[1] - a[1]); // desc
}


function calculateContributionPercentages(sortedContributors) {
  const total = sortedContributors
    .reduce((sum, [, count]) => sum + count, 0);

  return sortedContributors.map(([name, count]) => ({
    contributor: name,
    commits: count,
    percentage: +((count / total) * 100).toFixed(2)
  }));
}


function computeBusFactorMetrics(contributors) {
  const top1 = contributors[0]?.percentage || 0;

  const top3 = contributors
    .slice(0, 3)
    .reduce((sum, c) => sum + c.percentage, 0);

  let riskLevel = "LOW";

  if (top1 > 70) riskLevel = "HIGH";
  else if (top1 > 50) riskLevel = "MEDIUM";

  return {
    top1Contribution: top1,
    top3Contribution: +top3.toFixed(2),
    riskLevel
  };
}


function calculateContributorHealthScore(top1) {
  if (top1 > 70) return 30;
  if (top1 > 50) return 60;
  return 90;
}


export function analyzeContributorHealth(commits) {
  if (!commits || commits.length === 0) {
    return {
      contributors: [],
      top1Contribution: 0,
      top3Contribution: 0,
      riskLevel: "UNKNOWN",
      healthScore: 0
    };
  }

  const commitMap = countCommitsByContributor(commits);
  const sorted = sortContributors(commitMap);
  const contributors = calculateContributionPercentages(sorted);

  const {
    top1Contribution,
    top3Contribution,
    riskLevel
  } = computeBusFactorMetrics(contributors);

  const healthScore = calculateContributorHealthScore(top1Contribution);

  return {
    contributors,
    top1Contribution,
    top3Contribution,
    riskLevel,
    healthScore
  };
}
