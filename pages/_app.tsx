import React from 'react';
import { AppProps } from 'next/app';
import Bugsnag, { BrowserConfig } from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

import '/public/styles/reset.css';
import '/public/styles/flexbox-grid.css';
import '/public/styles/fonts.styl';
import '/public/styles/helpers.styl';
import 'simplebar/dist/simplebar.min.css';
import '/public/styles/main.styl';
import '/public/styles/styleguide.styl';
import '/public/styles/stylus-mq.styl';
import '/public/styles/header.styl';
import '/public/styles/form.styl';
import 'react-responsive-modal/styles.css';
import '/public/styles/modal.styl';
import '/public/styles/checkbox.styl';
import '/public/styles/icons.styl';
import '/public/styles/ui/ui.styl';

import '/public/styles/home.styl';
import '/public/styles/mag.styl';
import '/public/styles/news.styl';
import '/public/styles/videos.styl';
import '/public/styles/app.styl';
import '/public/styles/feed.styl';
import '/public/styles/map/map.styl';

import 'mapbox-gl/dist/mapbox-gl.css';

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

import { wrapper } from 'store';
import Head from 'next/head';

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const WrappedApp: React.FC<AppProps> = ({ Component, pageProps }) => (
    <ErrorBoundary>
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="with-device-with, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
    </ErrorBoundary>
);

export default wrapper.withRedux(WrappedApp);
