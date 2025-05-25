import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { analyzeClaimWithGemini } from '../../ai/gemini'; // Import the Gemini utility

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
        const analysis = await analyzeClaimWithGemini(input.text);
        return {
          submittedClaim: input.text,
          status: "Analysis from Gemini:", // Updated status message
          analysis: analysis, // Include the actual analysis from Gemini
        };
      } catch (error) {
        console.error("Error in submitClaim calling Gemini:", error);
        // Propagate a user-friendly error message to the client
        // Consider creating custom tRPC error codes for more specific client-side handling
        throw new Error("Failed to process claim with AI service. Please try again later.");
      }
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;