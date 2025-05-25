import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { analyzeClaimWithGemini } from '../../ai/gemini'; // Import the Gemini utility
import { sql } from '../../db/neon'; // Import the Neon SQL client

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
        // 1. Get analysis from Gemini
        const analysis = await analyzeClaimWithGemini(input.text);

        // 2. Save claim and analysis to the database
        try {
          await sql`
            INSERT INTO claims (claim_text, analysis_text)
            VALUES (${input.text}, ${analysis})
          `;
          console.log("Claim and analysis saved to database.");
        } catch (dbError) {
          console.error("Database error saving claim:", dbError);
          // For now, we log the DB error and continue.
          // In a production app, you might want to inform the client or retry.
        }

        return {
          submittedClaim: input.text,
          status: "Analysis from Gemini:", // Updated status message
          analysis: analysis, // Include the actual analysis from Gemini
        };
      } catch (error) {
        console.error("Error in submitClaim (Gemini or other):", error);
        // Propagate a user-friendly error message to the client
        // Consider creating custom tRPC error codes for more specific client-side handling
        throw new Error("Failed to process claim with AI service. Please try again later.");
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
