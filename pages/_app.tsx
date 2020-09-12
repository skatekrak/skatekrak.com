import React from 'react';
import { AppProps } from 'next/app';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

Bugsnag.start({
    apiKey: '4682b68bd8f242f45afba6142adba586',
    plugins: [new BugsnagPluginReact()],
});

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
