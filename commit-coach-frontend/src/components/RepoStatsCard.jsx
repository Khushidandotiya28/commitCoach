import { useNavigate } from "react-router-dom";

const RepoStatsCard = ({ repo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/analytics/${repo._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm hover:shadow-lg transition cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-indigo-600 mb-4">
        {repo.repoName}
      </h3>

      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Total Commits:</span> {repo.totalCommits}
        </p>
        <p>
          <span className="font-medium">Avg Commits/Day:</span> {repo.avgCommitsPerDay}
        </p>
        <p>
          <span className="font-medium">Repo Health:</span>{" "}
          <span
            className={
              repo.repoHealth === "Poor"
                ? "text-red-600 font-semibold"
                : "text-green-600 font-semibold"
            }
          >
            {repo.repoHealth}
          </span>
        </p>
        <p>
          <span className="font-medium">Technical Debt:</span>{" "}
          <span
            className={
              repo.technicalDebt === "High"
                ? "text-red-600 font-semibold"
                : "text-yellow-600 font-semibold"
            }
          >
            {repo.technicalDebt}
          </span>
        </p>
        <p>
          <span className="font-medium">Risks:</span>{" "}
          <span className="text-red-600">{repo.risks.join(", ")}</span>
        </p>
      </div>
    </div>
  );
};

export default RepoStatsCard;
