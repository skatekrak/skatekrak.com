import classNames from 'classnames';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';

import Types from 'Types';

import Header from 'components/Header';
import { setDeviceSize } from 'store/settings/actions';

/* tslint:disable:ordered-imports */
import 'static/styles/reset.css';
import 'static/styles/flexbox-grid.css';
import 'static/styles/fonts.styl';
import 'static/styles/helpers.styl';
import 'static/styles/main.styl';
import 'static/styles/styleguide.styl';
import 'static/styles/stylus-mq.styl';
import 'static/styles/form.styl';
import 'static/styles/modal.styl';

import 'static/styles/auth.styl';
import 'static/styles/subscribe.styl';
import 'static/styles/onboarding.styl';
import 'static/styles/club.styl';
import 'static/styles/news.styl';
import 'static/styles/videos.styl';

import 'static/styles/checkbox.styl';
import 'static/styles/icons.styl';
import 'static/styles/ui.styl';

import 'react-datepicker/dist/react-datepicker.css';
import 'static/styles/react-datepicker.css';

type Props = {
    head?: React.ReactNode;
    isMobile: boolean;
    dispatch: (fct: any) => void;
};

class Layout extends React.Component<Props, {}> {
    public componentDidMount() {
        window.addEventListener('resize', this.setWindowsDimensions);
        this.setWindowsDimensions();
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.setWindowsDimensions);
    }

    public render() {
        const { head, children, isMobile } = this.props;
        return (
            <div>
                {head ? (
                    head
                ) : (
                    <Head>
                        <title>Krak Skateboarding</title>
                        <meta name="description" content="" />
                        <meta property="og:title" content="Krak - Dig deeper into skateboarding" />
                        <meta property="og:type" content="website" />
                        <meta property="og:description" content="" />
                        <meta property="og:url" content="https://skatekrak.com" />
                    </Head>
                )}
                <div id="page-container">
                    <Header />
                    <main id="main-container" className={classNames({ 'scroll-container': !isMobile })}>
                        {children}
                    </main>
                </div>
            </div>
        );
    }

    private setWindowsDimensions = () => {
        this.props.dispatch(setDeviceSize(window.innerWidth));
    };
}

// export default Layout;
const mapStateToProps = ({ settings }: Types.RootState) => {
    const { isMobile } = settings;
    return { isMobile };
};
export default connect(mapStateToProps)(Layout);
