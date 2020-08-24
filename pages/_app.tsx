import React from 'react';
import { AppProps } from 'next/app';

import { wrapper } from 'store';
import Head from 'next/head';

const WrappedApp: React.FC<AppProps> = ({ Component, pageProps }) => (
    <>
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="with-device-with, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
    </>
);

export default wrapper.withRedux(WrappedApp);
