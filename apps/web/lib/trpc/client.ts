import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/routers/_app';

/**
 * A set of typesafe hooks for consuming your tRPC API.
 */
export const trpc = createTRPCReact<AppRouter>({
  /**
   * If you need to use SSR, you need to use the server's full URL
   * @link https://trpc.io/docs/v11/ssr
   */
});