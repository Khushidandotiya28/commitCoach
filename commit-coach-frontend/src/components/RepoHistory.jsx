import React from "react";

const RepoStatsCard = ({ repo }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border border-gray-100">
    <h3 className="text-xl font-semibold text-indigo-600 mb-4">
      {repo?.repoName || "Unknown Repository"}
    </h3>

    <div className="space-y-2 text-gray-700 text-sm">
      <p>
        <span className="font-medium">Total Commits:</span>{" "}
        {repo?.totalCommits ?? 0}
      </p>
      <p>
        <span className="font-medium">Avg Commits/Day:</span>{" "}
        {repo?.avgCommitsPerDay ?? 0}
      </p>
      <p>
        <span className="font-medium">Repo Health:</span>{" "}
        <span className="text-green-600 font-semibold">
          {repo?.repoHealth || "N/A"}
        </span>
      </p>
      <p>
        <span className="font-medium">Technical Debt:</span>{" "}
        <span className="text-yellow-600 font-semibold">
          {repo?.technicalDebt || "N/A"}
        </span>
      </p>
      <p>
        <span className="font-medium">Risks:</span>{" "}
        <span className="text-red-600">
          {/* Safe check for risks array before joining */}
          {repo?.risks?.length > 0 ? repo.risks.join(", ") : "None detected"}
        </span>
      </p>
    </div>
  </div>
);

const RepoHistory = ({ repos = [] }) => {
  
  if (!repos || repos?.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No repositories analyzed yet.
      </p>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        repo && <RepoStatsCard key={repo._id || Math.random()} repo={repo} />
      ))}
    </div>
  );
};

export default RepoHistory;