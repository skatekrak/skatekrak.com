import Head from 'next/head';
import * as React from 'react';

import Header from '../Header';

import '../../static/styles/reset.css';
import '../../static/styles/stylus-mq.styl';
import '../../static/styles/styleguide.styl';
import '../../static/styles/fonts.styl';
import '../../static/styles/helpers.styl';
import '../../static/styles/main.styl';

type Props = {
    head?: Head;
};

const Layout: React.SFC<Props> = ({ children, head }) => (
    <div>
        {head ? (
            {
                head,
            }
        ) : (
            <Head>
                <title>Krak Skateboarding</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="with-device-with, initial-scale=1" />
                <meta name="description" content="" />
                <meta property="og:title" content="Krak - Dig deeper into skateboarding" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="" />
                <meta property="og:url" content="https://skatekrak.com" />
            </Head>
        )}
        <div id="page-container">
            <Header />
            <main id="main-container">{children}</main>
        </div>
    </div>
);

export default Layout;
