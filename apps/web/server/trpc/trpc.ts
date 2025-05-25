/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
import { initTRPC } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients
 * need to know how to generate the context differently.
 */
export const createContext = async (opts: CreateNextContextOptions) => {
  // For now, we'll keep it simple. Later, you can add database connections, session info, etc.
  return {};
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
// Add protectedProcedure here if/when you add authentication