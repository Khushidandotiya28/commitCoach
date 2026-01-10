import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Commit-Coach Backend is running 🚀"
  });
});

export default router;
