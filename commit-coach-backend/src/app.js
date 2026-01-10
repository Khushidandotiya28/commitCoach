import express from "express";
import cors from "cors";

import healthRoute from "./routes/health.routes.js";
import repoRoutes from "./routes/repo.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoute);
app.use("/api/repo", repoRoutes);

export default app;
