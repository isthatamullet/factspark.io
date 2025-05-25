import { Index } from "@upstash/vector";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.UPSTASH_VECTOR_REST_URL) {
  throw new Error("UPSTASH_VECTOR_REST_URL environment variable is not set");
}
if (!process.env.UPSTASH_VECTOR_REST_TOKEN) {
  throw new Error("UPSTASH_VECTOR_REST_TOKEN environment variable is not set");
}
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set for embedding model");
}

export const upstashVectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" }); // Or your preferred Gemini embedding model

/**
 * Generates an embedding for the given text using Gemini.
 * @param text The text to embed.
 * @returns A promise that resolves to the embedding vector.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await embeddingModel.embedContent(text);
    const embedding = result.embedding;
    if (!embedding || !embedding.values) {
      throw new Error("Failed to generate embedding values.");
    }
    return embedding.values;
  } catch (error) {
    console.error("Error generating embedding with Gemini:", error);
    throw new Error("Failed to generate text embedding.");
  }
}

/**
 * Upserts a claim and its embedding into the Upstash Vector index.
 * @param id The unique ID of the claim (e.g., from your Neon database).
 * @param claimText The text of the claim.
 * @param embedding The vector embedding of the claim.
 */
export async function upsertClaimVector(id: string | number, claimText: string, embedding: number[]) {
  await upstashVectorIndex.upsert({
    id: String(id), // Upstash Vector ID needs to be a string
    vector: embedding,
    metadata: { original_claim_text: claimText }, // Store original text for context
  });
}