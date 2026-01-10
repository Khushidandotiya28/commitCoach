import express from "express";
import analyzeRepo from "../controllers/analyzeRepo.controller.js";

const router = express.Router();

router.post("/analyze", analyzeRepo);

export default router;
