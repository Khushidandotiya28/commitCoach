
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getRepoHistory, analyzeRepo } from "../api/repoApi";
import DashboardLayout from "../layouts/DashboardLayout";
import RepoForm from "../components/RepoForm";
import RepoStatsCard from "../components/RepoStatsCard";

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Fetch repository history
  const fetchRepos = async () => {
    if (!token) return;
    try {
      const res = await getRepoHistory(token);
      setRepos(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  // Handle repo analysis
  const handleAnalyze = async (repoUrl) => {
    setLoading(true);
    try {
      await analyzeRepo(repoUrl, token);
      await fetchRepos();
      alert("Analysis successful!");
    } catch (err) {
      console.error("Analysis failed:", err);
      alert("Failed to analyze repository.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to detailed analytics page
  const handleCardClick = (repoId) => {
    navigate(`/analytics/${repoId}`);
  };

  // Fetch repos on mount or token change
  useEffect(() => {
    fetchRepos();
  }, [token]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Repo Form */}
      <RepoForm onAnalyze={handleAnalyze} isLoading={loading} />

      {/* Analysis History */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Analysis History</h2>
        {loading && (
          <p className="text-indigo-600 animate-pulse">
            Analyzing repository... please wait.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.length === 0 && !loading && (
            <p className="text-gray-500">No repositories analyzed yet.</p>
          )}

          {repos.map((repo) => (
            <div
              key={repo._id}
              onClick={() => handleCardClick(repo._id)}
              className="cursor-pointer"
            >
              <RepoStatsCard repo={repo} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
