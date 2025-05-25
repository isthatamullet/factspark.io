import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
});

const generationConfig = {
  temperature: 0.7, // Adjust for creativity vs. factuality
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192, // Adjust as needed
  responseMimeType: "text/plain",
};

export async function analyzeClaimWithGemini(claimText: string): Promise<string> {
  try {
    const prompt = `Analyze the following claim for its likely veracity and provide a brief explanation. Claim: "${claimText}"`;

    const result = await model.generateContent(prompt, generationConfig);
    return result.response.text();
  } catch (error) {
    console.error("Error analyzing claim with Gemini:", error);
    throw new Error("Failed to get analysis from AI service.");
  }
}