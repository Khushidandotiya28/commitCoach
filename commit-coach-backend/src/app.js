import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import healthRoute from "./routes/health.routes.js";
import repoRoutes from "./routes/repo.routes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoute);
app.use("/api/repo", repoRoutes);
app.use("/api", apiLimiter);


app.use(errorMiddleware);


export default app;
