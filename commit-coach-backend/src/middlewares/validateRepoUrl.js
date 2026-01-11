import AppError from "../utils/AppError.js";
import parseRepoUrl from "../utils/parseRepoUrl.js";

const validateRepoUrl = (req, res, next) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return next(new AppError("Repository URL is required", 400));
  }

  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) {
    return next(new AppError("Invalid GitHub repository URL", 400));
  }

  // attach parsed data to request object
  req.repo = parsed;

  next();
};

export default validateRepoUrl;
