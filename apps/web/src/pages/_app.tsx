import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';
import React, { useState } from 'react';
import 'simplebar-react/dist/simplebar.min.css';
import 'react-responsive-modal/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../public/styles/tailwind.css';
import '../../public/styles/fonts.css';
import '../../public/styles/flexbox-grid.css';
import '../../public/styles/masonry.css';

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
                <Script
                    src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
                    data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
                    strategy="afterInteractive"
                />
            </QueryClientProvider>
        </NuqsAdapter>
    );
};

export default App;
