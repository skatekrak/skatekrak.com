import { mapsRouter } from './routers/maps';
import { mediaRouter } from './routers/media';
import { profilesRouter } from './routers/profiles';
import { spotsRouter } from './routers/spots';
import { router } from './trpc';

export * from './context';

export const appRouter = router({
    spots: spotsRouter,
    maps: mapsRouter,
    media: mediaRouter,
    profiles: profilesRouter,
});

export type AppRouter = typeof appRouter;
