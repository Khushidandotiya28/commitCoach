import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getRepoHistory } from "../api/repoApi";
import DashboardLayout from "../layouts/DashboardLayout";

const History = () => {
  const { token } = useContext(AuthContext);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const res = await getRepoHistory(token);
        setRepos(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Repo Analysis History</h1>
      {repos.length === 0 && <p>No repositories analyzed yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <div
            key={repo._id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{repo.repoName}</h3>
            <p><b>Total Commits:</b> {repo.totalCommits}</p>
            <p><b>Avg Commits/Day:</b> {repo.avgCommitsPerDay.toFixed(2)}</p>
            <p><b>Repo Health:</b> {repo.repoHealth}</p>
            <p><b>Technical Debt:</b> {repo.technicalDebt}</p>
            <p><b>Risks:</b> {repo.risks.join(", ")}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default History;
