import React, { useState } from "react";

const RepoForm = ({ onAnalyze }) => {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl) return;
    onAnalyze(repoUrl);
    setRepoUrl("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 bg-white p-6 rounded-xl shadow-md"
    >
      <input
        type="text"
        placeholder="GitHub Repository URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition"
      >
        Analyze
      </button>
    </form>
  );
};

export default RepoForm;
