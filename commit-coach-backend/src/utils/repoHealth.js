export function evaluateRepoHealth(metrics) {
  let repoHealth = "Good";
  let technicalDebt = "Low";
  const risks = [];

  if (metrics.avgCommitsPerDay < 0.5) {
    repoHealth = "Moderate";
    risks.push("Low development velocity");
  }

  if (metrics.maxGapDays > 30) {
    technicalDebt = "High";
    risks.push("Long inactive periods");
  }

  if (metrics.busFactor > 0.7) {
    risks.push("High dependency on single contributor");
  }

  if (risks.length >= 2) {
    repoHealth = "Poor";
  }

  return {
    repoHealth,
    technicalDebt,
    risks,
  };
}
