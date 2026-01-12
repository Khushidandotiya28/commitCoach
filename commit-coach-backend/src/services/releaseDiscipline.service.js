function analyzeTags(tags) {
  if (!tags || tags.length === 0) {
    return {
      hasReleases: false,
      tagCount: 0
    };
  }

  return {
    hasReleases: true,
    tagCount: tags.length
  };
}

function detectCommitBursts(commits, tags) {
  if (!tags || tags.length === 0) return false;

  const commitDates = commits.map(
    c => new Date(c.commit.author.date)
  );

  let burstDetected = false;

  for (const tag of tags) {
    const tagDate = commitDates.find(
      d => d <= new Date()
    );

    const windowStart = new Date(tagDate);
    windowStart.setDate(windowStart.getDate() - 2);

    const count = commitDates.filter(
      d => d >= windowStart && d <= tagDate
    ).length;

    if (count > 15) {
      burstDetected = true;
      break;
    }
  }

  return burstDetected;
}


export function analyzeReleaseDiscipline(commits, tags) {
  const tagAnalysis = analyzeTags(tags);
  const hasBurst = detectCommitBursts(commits, tags);

  let disciplineLevel = "GOOD";
  let disciplineScore = 100;

  if (!tagAnalysis.hasReleases) {
    disciplineLevel = "POOR";
    disciplineScore = 30;
  } else if (hasBurst) {
    disciplineLevel = "AVERAGE";
    disciplineScore = 60;
  }

  return {
    ...tagAnalysis,
    hasCommitBurst: hasBurst,
    disciplineLevel,
    disciplineScore
  };
}


