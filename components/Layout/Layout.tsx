import classNames from 'classnames';
import Head from 'next/head';
import { useRouter, withRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Types from 'Types';

import Header from 'components/Header';
import HeaderSmall from 'components/Header/HeaderSmall';
import { setDeviceSize } from 'store/settings/actions';

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

export type LayoutProps = {
    head?: React.ReactElement;
};

const usePathname = () => {
    const router = useRouter();
    const { pathname } = router;
    return useMemo(() => pathname, [pathname]);
};

const Layout: React.FC<LayoutProps> = ({ head, children }) => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const isMobile = useSelector((state: Types.RootState) => state.settings.isMobile);

    const setWindowsDimensions = () => {
        dispatch(setDeviceSize(window.innerWidth));
    };

    useEffect(() => {
        window.addEventListener('resize', setWindowsDimensions);
        dispatch(setDeviceSize(window.innerWidth));
        return () => {
            window.removeEventListener('resize', setWindowsDimensions);
        };
    }, []);

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
                    <meta property="og:url" content={process.env.NEXT_PUBLIC_WEBSITE_URL} />
                </Head>
            )}
            <div id="page-container" className={classNames({ 'scroll-container': isMobile })}>
                {pathname.startsWith('/map') && !isMobile ? <HeaderSmall /> : <Header pathname={pathname} />}
                <main id="main-container" className={classNames({ 'scroll-container': !isMobile })}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
