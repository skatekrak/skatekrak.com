import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '@krak/trpc';
import superjson from 'superjson';

function getBaseUrl() {
    if (typeof window === 'undefined') {
        return process.env.KRAK_API_URL ?? process.env.NEXT_PUBLIC_KRAK_API_URL!;
    }
    return process.env.NEXT_PUBLIC_KRAK_API_URL!;
}

/** Vanilla tRPC client for server-side usage (e.g. getServerSideProps) */
export const trpcServer = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: getBaseUrl() + '/trpc',
            transformer: superjson,
        }),
    ],
});

export const trpc = createTRPCNext<AppRouter>({
    config: ({ ctx }) => {
        if (typeof window !== 'undefined') {
            return {
                links: [
                    httpBatchLink({
                        url: getBaseUrl() + '/trpc',
                        transformer: superjson,
                        fetch(url, options) {
                            return fetch(url, {
                                ...options,
                                credentials: 'include',
                            });
                        },
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
