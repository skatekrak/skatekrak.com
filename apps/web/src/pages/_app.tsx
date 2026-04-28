import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';
import React, { useEffect, useState } from 'react';

import { ImgproxyProvider } from '@krak/ui';

import { useSession } from '@/lib/auth';
import 'simplebar-react/dist/simplebar.min.css';
import 'react-responsive-modal/styles.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../../public/styles/tailwind.css';
import '../../public/styles/fonts.css';
import '../../public/styles/flexbox-grid.css';
import '../../public/styles/masonry.css';

const useUmamiIdentify = () => {
    const { data: sessionData } = useSession();

    useEffect(() => {
        if (sessionData?.user && window.umami) {
            window.umami.identify({ userId: sessionData.user.id, username: sessionData.user.username });
        }
    }, [sessionData?.user]);
};

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    const [queryClient] = useState(() => new QueryClient());
    useUmamiIdentify();

    return (
        <NuqsAdapter>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={pageProps.dehydratedState}>
                    <ImgproxyProvider baseUrl={process.env.NEXT_PUBLIC_IMGPROXY_URL ?? ''}>
                        <Head>
                            <meta charSet="utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1" />
                        </Head>
                        <Component {...pageProps} />
                        {process.env.NEXT_PUBLIC_STAGE === 'development' && (
                            <ReactQueryDevtools initialIsOpen={false} />
                        )}
                    </ImgproxyProvider>
                </HydrationBoundary>
                <Script
                    src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
                    data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
                    data-performance="true"
                    strategy="afterInteractive"
                />
            </QueryClientProvider>
        </NuqsAdapter>
    );
};

export default App;
