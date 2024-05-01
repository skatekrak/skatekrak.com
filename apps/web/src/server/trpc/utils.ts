import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '@krak/trpc';
import superjson from 'superjson';

function getBaseUrl() {
    return process.env.NEXT_PUBLIC_KRAK_API_URL!;
}

export const trpc = createTRPCNext<AppRouter>({
    config: ({ ctx }) => {
        if (typeof window !== 'undefined') {
            return {
                links: [
                    httpBatchLink({
                        url: getBaseUrl() + '/trpc',
                        transformer: superjson,
                    }),
                ],
            };
        }

        return {
            links: [
                httpBatchLink({
                    url: getBaseUrl() + '/trpc',
                    transformer: superjson,
                    headers() {
                        if (!ctx?.req?.headers) return {};
                        return {
                            cookie: ctx.req.headers.cookie,
                        };
                    },
                }),
            ],
        };
    },
    transformer: superjson,
    ssr: false,
});
