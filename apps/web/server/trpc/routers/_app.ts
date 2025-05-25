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
  // You'll add more procedures here for fact-checking, etc.
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;