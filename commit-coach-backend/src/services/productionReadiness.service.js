const WEIGHTS = {
  commitConsistency: 0.25,
  contributorHealth: 0.25,
  commitHygiene: 0.20,
  repoFreshness: 0.20,
  releaseDiscipline: 0.10
};


function calculateWeightedScore(scores) {
  return Math.round(
    scores.commitConsistency * WEIGHTS.commitConsistency +
    scores.contributorHealth * WEIGHTS.contributorHealth +
    scores.commitHygiene * WEIGHTS.commitHygiene +
    scores.repoFreshness * WEIGHTS.repoFreshness +
    scores.releaseDiscipline * WEIGHTS.releaseDiscipline
  );
}


function classifyReadiness(score) {
  if (score >= 80) return "PRODUCTION_READY";
  if (score >= 60) return "NEEDS_IMPROVEMENT";
  return "HIGH_RISK";
}


function generateInsights(metrics) {
  const insights = [];

  if (metrics.commitConsistency < 60)
    insights.push("Irregular commit activity detected");

  if (metrics.contributorHealth < 60)
    insights.push("High bus factor risk");

  if (metrics.commitHygiene < 60)
    insights.push("Poor commit message hygiene");

  if (metrics.repoFreshness < 60)
    insights.push("Repository shows signs of inactivity");

  if (metrics.releaseDiscipline < 60)
    insights.push("Weak release discipline");

  return insights;
}


export function analyzeProductionReadiness({
  commitFrequency,
  contributorHealth,
  commitHygiene,
  repoFreshness,
  releaseDiscipline
}) {
  const scores = {
    commitConsistency: commitFrequency.consistencyScore,
    contributorHealth: contributorHealth.healthScore,
    commitHygiene: commitHygiene.averageScore,
    repoFreshness: repoFreshness.freshnessScore,
    releaseDiscipline: releaseDiscipline.disciplineScore
  };

  const finalScore = calculateWeightedScore(scores);
  const status = classifyReadiness(finalScore);
  const insights = generateInsights(scores);

  return {
    productionReadinessScore: finalScore,
    status,
    insights,
    breakdown: scores
  };
}


