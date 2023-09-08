import React, { useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-next-router';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';

import { wrapper } from 'store';
import { ThemeStore } from 'styles/Theme/ThemeStore';

import '/public/styles/reset.css';
import '/public/styles/flexbox-grid.css';
import '/public/dist/fonts.css';
import '/public/dist/helpers.css';
import 'simplebar-react/dist/simplebar.min.css';
import '/public/dist/main.css';
import '/public/dist/styleguide.css';
import '/public/dist/stylus-mq.css';
import 'react-responsive-modal/styles.css';
import '/public/dist/modal.css';
import '/public/dist/checkbox.css';
import '/public/dist/icons.css';
import '/public/dist/ui/ui.css';

import '/public/dist/home.css';
import '/public/dist/mag.css';
import '/public/dist/news.css';
import '/public/dist/videos.css';
import '/public/dist/feed.css';
import '/public/dist/map/map.css';
import '/public/dist/auth/auth.css';

import 'mapbox-gl/dist/mapbox-gl.css';

import '/public/styles/masonry.css';

const WrappedApp: React.FC<AppProps> = ({ Component, ...rest }) => {
    const { store, props } = wrapper.useWrappedStore(rest);
    const [queryClient] = useState(() => new QueryClient());

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={props.pageProps.dehydratedState}>
                    <Head>
                        <meta charSet="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                    </Head>
                    <ConnectedRouter>
                        <ThemeStore>
                            <Component {...props.pageProps} />
                        </ThemeStore>
                    </ConnectedRouter>
                    {process.env.NEXT_PUBLIC_STAGE === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
                </Hydrate>
            </QueryClientProvider>
            <Analytics />
        </Provider>
    );
};

export default WrappedApp;
