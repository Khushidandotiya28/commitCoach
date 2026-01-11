import express from "express";
import analyzeRepo from "../controllers/analyzeRepo.controller.js";
import validateRepoUrl from "../middlewares/validateRepoUrl.js";

const router = express.Router();


router.post("/analyze", validateRepoUrl, analyzeRepo);

export default router;
