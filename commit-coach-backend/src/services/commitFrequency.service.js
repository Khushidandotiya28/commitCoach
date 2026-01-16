function getDateOnly(isoDate) {
  return isoDate.split("T")[0]; 
}

function groupCommitsByDay(commits) {
  const dailyMap = {};

  for (const commit of commits) {
    const date = getDateOnly(commit.commit.author.date);

    dailyMap[date] = (dailyMap[date] || 0) + 1;
  }

  return dailyMap;
}


function calculateAverages(dailyMap) {
  const days = Object.keys(dailyMap).length;
  const totalCommits = Object.values(dailyMap)
    .reduce((a, b) => a + b, 0);

  return {
    commitsPerDay: +(totalCommits / days).toFixed(2),
    commitsPerWeek: +((totalCommits / days) * 7).toFixed(2)
  };
}


function calculateInactiveDays(dailyMap) {
  const dates = Object.keys(dailyMap).sort();
  let inactiveDays = 0;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);

    const gap =
      (curr - prev) / (1000 * 60 * 60 * 24) - 1;

    if (gap > 0) inactiveDays += gap;
  }

  return inactiveDays;
}


function calculateConsistencyScore(dailyMap) {
  let score = 100;
  const dailyCommits = Object.values(dailyMap);

  const inactiveDays = calculateInactiveDays(dailyMap);
  score -= inactiveDays * 2;

  // burst detection
  for (const count of dailyCommits) {
    if (count > 10) score -= 5;
  }

  return Math.max(score, 0);
}


export function analyzeCommitFrequency(commits) {
  if (!commits || commits.length === 0) {
    return {
      commitsPerDay: 0,
      commitsPerWeek: 0,
      inactiveDays: 0,
      consistencyScore: 0
    };
  }

  const dailyMap = groupCommitsByDay(commits);
  const averages = calculateAverages(dailyMap);
  const inactiveDays = calculateInactiveDays(dailyMap);
  const consistencyScore = calculateConsistencyScore(dailyMap);

  return {
    ...averages,
    inactiveDays,
    consistencyScore,
    activeDays: Object.keys(dailyMap).length
  };
}
