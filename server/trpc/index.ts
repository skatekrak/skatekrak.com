import { spotsRouter } from './routers/spots';
import { router } from './trpc';

export const appRouter = router({
    spots: spotsRouter,
});

export type AppRouter = typeof appRouter;
