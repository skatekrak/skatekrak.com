import classNames from 'classnames';
import getConfig from 'next/config';
import Head from 'next/head';
import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import Types from 'Types';

import Header from 'components/Header';
import { setDeviceSize } from 'store/settings/actions';

/* tslint:disable:ordered-imports */
import '/public/styles/reset.css';
import '/public/styles/flexbox-grid.css';
import '/public/styles/fonts.styl';
import '/public/styles/helpers.styl';
import '/public/styles/main.styl';
import '/public/styles/styleguide.styl';
import '/public/styles/stylus-mq.styl';
import '/public/styles/form.styl';
import '/public/styles/modal.styl';
import '/public/styles/checkbox.styl';
import '/public/styles/icons.styl';
import '/public/styles/ui.styl';

import '/public/styles/auth.styl';
import '/public/styles/subscribe.styl';
import '/public/styles/onboarding.styl';
import '/public/styles/club.styl';
import '/public/styles/mag.styl';
import '/public/styles/news.styl';
import '/public/styles/videos.styl';
import '/public/styles/app.styl';
import '/public/styles/shop.styl';
import '/public/styles/feed.styl';
import '/public/styles/map/map.styl';

import 'react-datepicker/dist/react-datepicker.css';
import '/public/styles/react-datepicker.css';

type IComponentOwnProps = {
    head?: React.ReactElement;
    children?: any;
};

type IComponentProps = IComponentOwnProps & IComponentStoreProps & DispatchProp;

class Layout extends React.Component<IComponentProps> {
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
                        <meta property="og:url" content={getConfig().publicRuntimeConfig.WEBSITE_URL} />
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
const mapStateToProps = ({ settings }: Types.RootState) => {
    const { isMobile } = settings;
    return { isMobile };
};

type IComponentStoreProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Layout);
