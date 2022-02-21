import React from 'react';
import { AppProps } from 'next/app';
import Bugsnag, { BrowserConfig } from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import Head from 'next/head';
import { ConnectedRouter } from 'connected-next-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { wrapper } from 'store';
import { ThemeStore } from 'styles/Theme/ThemeStore';

import '/public/styles/reset.css';
import '/public/styles/flexbox-grid.css';
import '/public/styles/fonts.styl';
import '/public/styles/helpers.styl';
import 'simplebar/dist/simplebar.min.css';
import '/public/styles/main.styl';
import '/public/styles/styleguide.styl';
import '/public/styles/stylus-mq.styl';
import 'react-responsive-modal/styles.css';
import '/public/styles/modal.styl';
import '/public/styles/checkbox.styl';
import '/public/styles/icons.styl';
import '/public/styles/ui/ui.styl';

import '/public/styles/home.styl';
import '/public/styles/mag.styl';
import '/public/styles/news.styl';
import '/public/styles/videos.styl';
import '/public/styles/feed.styl';
import '/public/styles/map/map.styl';
import '/public/styles/auth/auth.styl';

import 'mapbox-gl/dist/mapbox-gl.css';

import '/public/styles/masonry.css';

const queryClient = new QueryClient();

const config: BrowserConfig = {
    apiKey: process.env.NEXT_PUBLIC_BUGSNAG_KEY,
    plugins: [new BugsnagPluginReact()],
    enabledReleaseStages: ['production', 'staging'],
    releaseStage: process.env.NEXT_PUBLIC_STAGE,
    collectUserIp: false,
};

if (process.env.NEXT_PUBLIC_STAGE === 'development') {
    config.logger = null;
}

Bugsnag.start(config);

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const WrappedApp: React.FC<AppProps> = ({ Component, pageProps }) => (
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <ConnectedRouter>
                <ThemeStore>
                    <Component {...pageProps} />
                </ThemeStore>
            </ConnectedRouter>
        </QueryClientProvider>
    </ErrorBoundary>
);

export default wrapper.withRedux(WrappedApp);
