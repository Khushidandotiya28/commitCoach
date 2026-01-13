import { calculateScore } from "../utils/commitScore.js";

describe("Commit Score Calculator", () => {
  test("returns Low for commits < 10", () => {
    expect(calculateScore(5)).toBe("Low");
  });

  test("returns Medium for commits < 50", () => {
    expect(calculateScore(30)).toBe("Medium");
  });

  test("returns High for commits >= 50", () => {
    expect(calculateScore(80)).toBe("High");
  });
});
