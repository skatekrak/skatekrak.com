import React, { useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';

import 'simplebar-react/dist/simplebar.min.css';
import 'react-responsive-modal/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import '../../public/styles/tailwind.css';
import '../../public/styles/fonts.css';
import '../../public/styles/flexbox-grid.css';
import '../../public/styles/masonry.css';
import { trpc } from '@/server/trpc/utils';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <NuqsAdapter>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={pageProps.dehydratedState}>
                    <Head>
                        <meta charSet="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                    </Head>
                    <Component {...pageProps} />
                    {process.env.NEXT_PUBLIC_STAGE === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
                </HydrationBoundary>
                <Analytics />
            </QueryClientProvider>
        </NuqsAdapter>
    );
};

export default trpc.withTRPC(App);
