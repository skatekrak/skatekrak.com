import classNames from 'classnames';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Types from 'Types';

import Header from 'components/Header';
import HeaderSmall from 'components/Header/HeaderSmall';
import { setDeviceSize } from 'store/settings/actions';

import usePathname from 'lib/use-pathname';

export type LayoutProps = {
    head?: React.ReactElement;
};

const Layout: React.FC<LayoutProps> = ({ head, children }) => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const isMobile = useSelector((state: Types.RootState) => state.settings.isMobile);

    useEffect(() => {
        const setWindowsDimensions = () => {
            dispatch(setDeviceSize(window.innerWidth));
        };

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
