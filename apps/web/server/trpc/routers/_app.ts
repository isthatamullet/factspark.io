import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

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
      // Simulate processing and AI call for now
      // In a real app, this is where you'd call Gemini, query Upstash Vector, etc.
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return {
        submittedClaim: input.text,
        status: "Claim received by server. Simulated analysis complete.",
      };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;