import React, { useEffect } from 'react';
import Head from 'next/head';

import Header from '@/components/Header';

import { useSettingsStore } from '@/store/settings';

export type LayoutProps = {
    head?: React.ReactElement;
};

const Layout: React.FC<LayoutProps & { children: React.ReactNode }> = ({ head, children }) => {
    const setDeviceSize = useSettingsStore((state) => state.setDeviceSize);

    useEffect(() => {
        const setWindowsDimensions = () => {
            setDeviceSize(window.innerWidth);
        };

        window.addEventListener('resize', setWindowsDimensions);
        setDeviceSize(window.innerWidth);
        return () => {
            window.removeEventListener('resize', setWindowsDimensions);
        };
    }, [setDeviceSize]);

    return (
        <>
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
            <div className="absolute flex flex-col left-0 top-0 right-0 bottom-0 overflow-hidden">
                <Header />
                <div className="relative grow flex flex-col text-onLight-highEmphasis overflow-y-auto scroll-smooth z-[1] scroll-container">
                    {children}
                </div>
            </div>
        </>
    );
};

export default Layout;
