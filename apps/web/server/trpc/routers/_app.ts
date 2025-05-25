import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { analyzeClaimWithGemini } from '../../ai/gemini'; // Import the Gemini utility
import { sql } from '../../db/neon'; // Import the Neon SQL client
import {
  generateEmbedding,
  upsertClaimVector,
  querySimilarClaims,
} from '../../vector/upstash'; // Import Upstash Vector utilities


export const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string().optional() }).optional())
    .query(({ input }) => {
      return {
        text: `Hello ${input?.name ?? 'world'} from FactSpark.io tRPC!`,
      };
    }),
  submitClaim: publicProcedure
    .input(
      z.object({
        text: z.string().min(1, { message: "Claim cannot be empty." }),
      })
    )
    .mutation(async ({ input }) => {
      console.log(`Server received claim to check: "${input.text}"`);
      try {
        // 1. Generate embedding for the input claim
        const embedding = await generateEmbedding(input.text);

        // 2. Query Upstash Vector for similar claims
        const similarClaims = await querySimilarClaims(embedding, 1); // Get top 1 similar

        let analysis: string;
        let source: string = "New analysis from Gemini";
        let neonClaimId: number | null = null;
        let retrievedSimilarClaimText: string | null = null;

        // Define a similarity threshold (e.g., 0.90 for very similar)
        // Upstash Vector query results include a 'score' (cosine similarity, 0 to 1)
        const SIMILARITY_THRESHOLD = 0.90; // Adjust this threshold as needed

        if (similarClaims.length > 0 && similarClaims[0].score >= SIMILARITY_THRESHOLD) {
          const similarClaimIdFromVector = similarClaims[0].id; // This ID should be the Neon claim ID
          console.log(`Found similar claim in vector DB with ID: ${similarClaimIdFromVector} and score: ${similarClaims[0].score}`);

          // Fetch the existing analysis from Neon DB using the ID from Upstash metadata
          const existingNeonClaim = await sql`
            SELECT analysis_text FROM claims WHERE id = ${Number(similarClaimIdFromVector)}
          `;

          if (existingNeonClaim.length > 0 && existingNeonClaim[0].analysis_text) {
            analysis = existingNeonClaim[0].analysis_text as string;
            source = `Retrieved from existing analysis (ID: ${similarClaimIdFromVector})`;
            neonClaimId = Number(similarClaimIdFromVector); // Keep track of the existing Neon ID
            // Store the text of the similar claim that was found
            if (similarClaims[0].metadata && typeof similarClaims[0].metadata.original_claim_text === 'string') {
              retrievedSimilarClaimText = similarClaims[0].metadata.original_claim_text;
            }
            console.log("Using existing analysis from Neon DB.");
          } else {
            // Similar vector found, but no analysis in Neon (should be rare if data is consistent)
            // Or, if you always want to re-analyze for very similar items, adjust logic here.
            console.log("Similar vector found, but no analysis in Neon or re-analysis triggered. Analyzing with Gemini.");
            analysis = await analyzeClaimWithGemini(input.text);
          }
        } else {
          // No sufficiently similar claim found, get new analysis from Gemini
          console.log("No sufficiently similar claim found in vector DB. Analyzing with Gemini.");
          analysis = await analyzeClaimWithGemini(input.text);
        }

        // 3. Save to Neon DB (if it's a new analysis)
        // If neonClaimId is null, it means we generated a new analysis.
        if (source === "New analysis from Gemini") {
          try {
            const result = await sql`
              INSERT INTO claims (claim_text, analysis_text)
              VALUES (${input.text}, ${analysis}) RETURNING id
            `;
            neonClaimId = result[0].id as number;
            console.log(`Claim and new analysis saved to Neon DB with ID: ${neonClaimId}.`);
            
            // 4. Upsert into Upstash Vector with the Neon DB ID
            // Only do this if we have a valid neonClaimId (meaning it was successfully inserted)
            if (neonClaimId) {
              await upsertClaimVector(neonClaimId, input.text, embedding);
              console.log(`Vector upserted into Upstash for Neon ID: ${neonClaimId}.`);
            }
          } catch (dbError) {
            console.error("Database error saving new claim to Neon:", dbError);
            // If DB save fails, we might not want to proceed or return an error
            // For now, we'll let the function continue and return whatever analysis was generated
            // but the claim won't be in Neon or Upstash Vector.
            // Consider throwing an error here to inform the client of the save failure.
          }
        }

        return {
          submittedClaim: input.text,
          status: source,
          analysis: analysis,
          retrievedSimilarClaimText: retrievedSimilarClaimText,
        };
      } catch (error) {
        console.error("Error in submitClaim (Gemini, Embedding, VectorDB, or other):", error);
        // Propagate a user-friendly error message to the client
        throw new Error("Failed to process claim. An internal error occurred. Please try again later.");
      }
    }),
  getHistoricalClaims: publicProcedure
    .query(async () => {
      try {
        const claims = await sql`SELECT id, claim_text, analysis_text, submitted_at FROM claims ORDER BY submitted_at DESC LIMIT 10`;
        return claims;
      } catch (error) {
        console.error("Database error fetching historical claims:", error);
        throw new Error("Failed to fetch historical claims.");
      }
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
