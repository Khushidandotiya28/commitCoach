function daysBetween(date1, date2) {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((date2 - date1) / ONE_DAY);
}


function getLastCommitDate(commits) {
  const dates = commits
    .map(c => new Date(c.commit.author.date));

  return new Date(Math.max(...dates));
}


export function analyzeRepoFreshness(commits) {
  if (!commits || commits.length === 0) {
    return {
      lastCommitDate: null,
      daysSinceLastCommit: null,
      freshnessLevel: "UNKNOWN",
      freshnessScore: 0
    };
  }

  const now = new Date();
  const lastCommitDate = getLastCommitDate(commits);
  const daysSinceLastCommit = daysBetween(
    lastCommitDate,
    now
  );

  let freshnessLevel = "FRESH";
  let freshnessScore = 100;

  if (daysSinceLastCommit > 180) {
    freshnessLevel = "STALE";
    freshnessScore = 20;
  } else if (daysSinceLastCommit > 90) {
    freshnessLevel = "AGING";
    freshnessScore = 50;
  } else if (daysSinceLastCommit > 30) {
    freshnessLevel = "WARM";
    freshnessScore = 80;
  }

  return {
    lastCommitDate,
    daysSinceLastCommit,
    freshnessLevel,
    freshnessScore
  };
}
