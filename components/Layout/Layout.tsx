import classNames from 'classnames';
import Head from 'next/head';
import React from 'react';

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
    head?: React.ReactNode;
}

type State = {
    isMobile: boolean | null;
};

class Layout extends React.Component<ILayoutProps, State> {
    public state: State = {
        isMobile: null,
    };

    public componentDidMount() {
        window.addEventListener('resize', this.getWindowsDimensions);
        this.getWindowsDimensions();
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.getWindowsDimensions);
    }

    public render() {
        const { head, children } = this.props;
        const { isMobile } = this.state;
        return (
            <div>
                {head ? (
                    head
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
                <div id="page-container" className={classNames({ 'scroll-container': isMobile })}>
                    <Header />
                    <main id="main-container" className={classNames({ 'scroll-container': !isMobile })}>
                        {children}
                    </main>
                </div>
            </div>
        );
    }

    private getWindowsDimensions = () => {
        const viewportWidth = window.innerWidth;

        if (viewportWidth < 1024) {
            this.setState({ isMobile: true });
        } else {
            this.setState({ isMobile: false });
        }
    };
}

export default Layout;
