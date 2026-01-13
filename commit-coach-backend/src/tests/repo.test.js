import { jest } from "@jest/globals";
import request from "supertest";

// ✅ Mock middleware FIRST
await jest.unstable_mockModule(
  "../middlewares/validateRepoUrl.js",
  () => ({
    default: (req, res, next) => next()
  })
);

// ✅ Mock controller
await jest.unstable_mockModule(
  "../controllers/analyzeRepo.controller.js",
  () => ({
    default: (req, res) =>
      res.status(200).json({
        status: "success",
        message: "Repo analyzed (mock)"
      })
  })
);

// ✅ Import app AFTER mocks
const { default: app } = await import("../app.js");

describe("Repo API Integration Test", () => {
  test("POST /api/repo/analyze should return success", async () => {
    const response = await request(app)
      .post("/api/repo/analyze")
      .send({
        repoUrl: "https://github.com/test/repo"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
  });
});
