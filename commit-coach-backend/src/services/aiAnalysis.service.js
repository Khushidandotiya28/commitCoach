import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeRepoWithGemini = async (repoAnalysis) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    }, { apiVersion: 'v1' });

    const prompt = `
You are a senior software architect.

Analyze the following GitHub repository data and provide:
1. Overall health summary
2. Technical debt assessment
3. Key risks
4. Actionable recommendations

Repository Data:
${JSON.stringify(repoAnalysis, null, 2)}
`;

    const result = await model.generateContent(prompt);

    return result.response.text();

  } catch (error) {
    console.error("Gemini AI error:", error.message);
    throw error;
  }
};
