import OpenAI from "openai";

export const analyzeRepoWithAI = async (stats) => {
  // ✅ Guard clause (very important)
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  // ✅ Create client INSIDE function
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
Analyze this GitHub repository:

Total commits: ${stats.totalCommits}
Contributors: ${stats.contributorsCount}

Return JSON with:
- commitScore (Low | Medium | High)
- aiSuggestions (array)
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(response.choices[0].message.content);
};
