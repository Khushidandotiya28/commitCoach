export default {
  testEnvironment: "node",
  clearMocks: true,
  extensionsToTreatAsEsm: [".js"],
  transform: {}
};

await jest.mock("../services/aiAnalysis.service.js");
