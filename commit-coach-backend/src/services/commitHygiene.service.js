const GOOD_VERBS = [
  "fix", "add", "update", "refactor", "remove",
  "test", "optimize", "improve", "implement"
];

const BAD_KEYWORDS = [
  "wip", "temp", "tmp", "final", "stuff",
  "changes", "update"
];

function hasTicketId(message) {
  const pattern = /(#[0-9]+|[A-Z]{2,}-[0-9]+)/;
  return pattern.test(message);
}


function analyzeMessage(message) {
  const lower = message.toLowerCase();

  let score = 100;
  const issues = [];

  // Length check
  if (message.length < 10) {
    score -= 15;
    issues.push("Message too short");
  }

  // Bad keywords
  for (const word of BAD_KEYWORDS) {
    if (lower.includes(word)) {
      score -= 20;
      issues.push(`Bad keyword: ${word}`);
      break;
    }
  }

  // Good verbs
  const hasGoodVerb = GOOD_VERBS.some(v => lower.startsWith(v));
  if (!hasGoodVerb) {
    score -= 10;
    issues.push("No clear action verb");
  }

  // Ticket reference bonus
  if (hasTicketId(message)) {
    score += 10;
  }

  return {
    score: Math.max(score, 0),
    issues
  };
}


export function analyzeCommitHygiene(commits) {
  if (!commits || commits.length === 0) {
    return {
      averageScore: 0,
      badCommitPercentage: 0,
      hygieneLevel: "UNKNOWN",
      samples: []
    };
  }

  let totalScore = 0;
  let badCount = 0;
  const samples = [];

  for (const commit of commits) {
    const message = commit.commit?.message || "";
    const result = analyzeMessage(message);

    totalScore += result.score;
    if (result.score < 60) badCount++;

    if (samples.length < 5 && result.issues.length > 0) {
      samples.push({
        message,
        issues: result.issues
      });
    }
  }

  const averageScore = +(totalScore / commits.length).toFixed(2);
  const badCommitPercentage = +(
    (badCount / commits.length) * 100
  ).toFixed(2);

  const hygieneLevel =
    averageScore >= 80 ? "GOOD" :
    averageScore >= 60 ? "AVERAGE" :
    "POOR";

  return {
    averageScore,
    badCommitPercentage,
    hygieneLevel,
    samples
  };
}
