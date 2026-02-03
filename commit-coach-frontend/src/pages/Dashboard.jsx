import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getRepoHistory, analyzeRepo, deleteRepo } from "../api/repoApi"; 
import DashboardLayout from "../layouts/DashboardLayout";
import RepoForm from "../components/RepoForm";
import RepoStatsCard from "../components/RepoStatsCard";

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch repository history
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

  // Handle repo deletion
  const handleDelete = async (e, repoId) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this analysis?")) return;

    try {
      await deleteRepo(repoId, token);
      setRepos((prevRepos) => prevRepos.filter((repo) => repo._id !== repoId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete repository.");
    }
  };

  const handleCardClick = (repoId) => {
    navigate(`/analytics/${repoId}`);
  };

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
          <p className="text-indigo-600 animate-pulse mb-4">
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
              className="relative group cursor-pointer border rounded-lg hover:shadow-md transition-shadow"
            >
              {/* Delete Button*/}
              <button
                onClick={(e) => handleDelete(e, repo._id)}
                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-red-500 hover:text-white text-gray-600 p-1.5 rounded-full transition-colors border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100"
                title="Delete Analysis"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <RepoStatsCard repo={repo} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;