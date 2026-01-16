import RepoAnalysis from "../models/RepoAnalysis.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getUserRepoHistory = asyncHandler(async (req, res) => {
  const repos = await RepoAnalysis.find({
    userId: req.user._id,
  }).sort({ analyzedAt: -1 });

  res.status(200).json({
    status: "success",
    count: repos.length,
    data: repos,
  });
});

