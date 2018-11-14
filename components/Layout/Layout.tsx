import { NextSFC } from 'next';
import Head from 'next/head';
import * as React from 'react';

import Header from 'components/Header';

/* tslint:disable:ordered-imports */
import 'static/styles/reset.css';
import 'static/styles/flexbox-grid.css';
import 'static/styles/fonts.styl';
import 'static/styles/helpers.styl';
import 'static/styles/main.styl';
import 'static/styles/styleguide.styl';
import 'static/styles/stylus-mq.styl';

interface ILayoutProps {
    head?: Head;
}

const Layout: NextSFC<ILayoutProps> = ({ children, head }) => (
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
            <main id="main-container" className="container">
                {children}
            </main>
        </div>
    </div>
);

export default Layout;
