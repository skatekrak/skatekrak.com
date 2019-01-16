import classNames from 'classnames';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';

import Header from 'components/Header';
import { setDeviceSize, State as SettingState } from 'store/reducers/setting';

/* tslint:disable:ordered-imports */
import 'static/styles/reset.css';
import 'static/styles/flexbox-grid.css';
import 'static/styles/fonts.styl';
import 'static/styles/helpers.styl';
import 'static/styles/main.styl';
import 'static/styles/styleguide.styl';
import 'static/styles/stylus-mq.styl';

type Props = {
    head?: React.ReactNode;
    setting: SettingState;
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
        const { head, children } = this.props;
        const { isMobile } = this.props.setting;
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
                <div id="page-container" className={classNames({ 'scroll-container': isMobile })}>
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
export default connect((state: any) => ({ setting: state.setting }))(Layout);
