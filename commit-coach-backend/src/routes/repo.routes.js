import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import analyzeRepo from "../controllers/analyzeRepo.controller.js";
import validateRepoUrl from "../middlewares/validateRepoUrl.js";
import { getUserRepoHistory } from "../controllers/repoHistory.controller.js";

const router = express.Router();


router.post("/analyze", authMiddleware, validateRepoUrl, analyzeRepo);
router.get("/history", authMiddleware, getUserRepoHistory);


export default router;
