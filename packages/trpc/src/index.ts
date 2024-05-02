import { mapsRouter } from './routers/maps';
import { spotsRouter } from './routers/spots';
import { router } from './trpc';

export * from './context';

export const appRouter = router({
    spots: spotsRouter,
    maps: mapsRouter,
});

export type AppRouter = typeof appRouter;
