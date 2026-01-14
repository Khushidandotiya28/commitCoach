export function calculateRepoMetrics(commits, contributors) {
  const totalCommits = commits.length;

  // Average commits per day
  const dates = commits.map(c => new Date(c.commit.author.date));
  const sortedDates = dates.sort((a, b) => a - b);

  const daysActive =
    (sortedDates[sortedDates.length - 1] - sortedDates[0]) /
      (1000 * 60 * 60 * 24) || 1;

  const avgCommitsPerDay = totalCommits / daysActive;

  // Max gap between commits (technical debt signal)
  let maxGapDays = 0;
  for (let i = 1; i < sortedDates.length; i++) {
    const gap =
      (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
    maxGapDays = Math.max(maxGapDays, gap);
  }

  // Contributor concentration (bus factor)
  const totalContributorCommits = contributors.reduce(
    (sum, c) => sum + c.commits,
    0
  );

  const topContributorCommits = Math.max(
    ...contributors.map(c => c.commits)
  );

  const busFactor = topContributorCommits / totalContributorCommits;

  return {
    totalCommits,
    avgCommitsPerDay: avgCommitsPerDay.toFixed(2),
    maxGapDays: Math.round(maxGapDays),
    busFactor: busFactor.toFixed(2),
  };
}
