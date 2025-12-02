import { postRouter } from "~/server/api/routers/post";
import { barangayRouter } from "~/server/api/routers/barangay";
import { businessRouter } from "~/server/api/routers/business";
import { categoryRouter } from "~/server/api/routers/category";
import { zoneRouter } from "~/server/api/routers/zone";
import { hazardRouter } from "~/server/api/routers/hazard";
import { analyticsRouter } from "~/server/api/routers/analytics";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  barangay: barangayRouter,
  business: businessRouter,
  category: categoryRouter,
  zone: zoneRouter,
  hazard: hazardRouter,
  analytics: analyticsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
