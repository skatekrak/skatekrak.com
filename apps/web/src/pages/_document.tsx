import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

const MyDocument = () => (
    <Html lang="en">
        <Head>
            <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon_32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon_16.png" />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>
);

export default MyDocument;
