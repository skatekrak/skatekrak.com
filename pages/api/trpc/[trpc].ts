import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from 'server/trpc';
import { createContext } from 'server/trpc/context';

export default createNextApiHandler({
    router: appRouter,
    createContext,
    batching: { enabled: true },
});

export const config = {
    api: {
        bodyParser: false,
    },
};
