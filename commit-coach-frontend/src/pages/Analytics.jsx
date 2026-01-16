import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getRepoHistory } from "../api/repoApi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Analytics = () => {
  const { token } = useContext(AuthContext);
  const [repos, setRepos] = useState([]);
  const { repoId } = useParams();


  useEffect(() => {
    if (!token) return;

    const fetchHistory = async () => {
      try {
        const res = await getRepoHistory(token);
        setRepos(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };

    fetchHistory();
  }, [token]);

  /* ---------------- HELPER LOGIC ---------------- */
  const getReasons = (repo) => {
    const reasons = [];
    if (repo.avgCommitsPerDay < 0.5)
      reasons.push("Low commit frequency");
    if (repo.maxGapDays > 30) reasons.push("Long inactive periods");
    if (repo.busFactor < 1.5)
      reasons.push("High dependency on a single contributor");
    return reasons;
  };

  const getRecommendations = (repo) => {
    const actions = [];
    if (repo.avgCommitsPerDay < 1)
      actions.push("Increase commit frequency (target ≥ 1 commit/day)");
    if (repo.busFactor < 2)
      actions.push("Encourage more contributors to reduce risk");
    if (repo.maxGapDays > 30)
      actions.push("Avoid long inactive periods with regular updates");
    return actions;
  };

  /* ---------------- AGGREGATE METRICS ---------------- */
  const totalCommits = repos.reduce((acc, repo) => acc + repo.totalCommits, 0);
  const avgCommitsPerDay = (
    repos.reduce((acc, repo) => acc + repo.avgCommitsPerDay, 0) /
    (repos.length || 1)
  ).toFixed(2);
  const highTechDebtRepos = repos.filter(
    (repo) => repo.technicalDebt === "High"
  ).length;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* -------- TOP STATS -------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Total Commits</h2>
          <p className="text-3xl font-bold">{totalCommits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Avg Commits / Day</h2>
          <p className="text-3xl font-bold">{avgCommitsPerDay}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold mb-2">High Technical Debt</h2>
          <p className="text-3xl font-bold">{highTechDebtRepos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Repo Count</h2>
          <p className="text-3xl font-bold">{repos.length}</p>
        </div>
      </div>

      {/* -------- REPO INSIGHTS -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <div
            key={repo._id}
            className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{repo.repoName}</h3>

            <p>
              <span className="font-bold">Repo Health:</span>{" "}
              <span
                className={
                  repo.repoHealth === "Poor"
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {repo.repoHealth}
              </span>
            </p>

            <p>
              <span className="font-bold">Technical Debt:</span>{" "}
              <span
                className={
                  repo.technicalDebt === "High"
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {repo.technicalDebt}
              </span>
            </p>

            <p>
              <span className="font-bold">Avg Commits / Day:</span>{" "}
              {repo.avgCommitsPerDay}
            </p>

            <p>
              <span className="font-bold">Max Inactive Gap:</span>{" "}
              {repo.maxGapDays} days
            </p>

            <p>
              <span className="font-bold">Active Contributors:</span>{" "}
              {repo.contributors?.length || 0}
            </p>

            <p>
              <span className="font-bold">Bus Factor:</span> {repo.busFactor}
            </p>

            {/* -------- COMMIT CHART -------- */}
            {repo.commitStats?.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold mb-1">Commits Over Time:</p>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={repo.commitStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" hide />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* -------- WHY SECTION -------- */}
            <p className="mt-3 font-semibold text-yellow-700">
              Why this repo needs attention:
            </p>
            <ul className="list-disc ml-5 text-yellow-600">
              {getReasons(repo).map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>

            {/* -------- RECOMMENDATIONS -------- */}
            <p className="mt-3 font-semibold text-green-700">
              Recommended Actions:
            </p>
            <ul className="list-disc ml-5 text-green-600">
              {getRecommendations(repo).map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
