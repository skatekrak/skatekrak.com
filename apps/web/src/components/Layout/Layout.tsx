import React, { useEffect } from 'react';
import Head from 'next/head';

import Header from '@/components/Header';
import * as S from './Layout.styled';

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
            <S.LayoutPageContainer>
                <Header />
                <S.LayoutMainContainer className="scroll-container">{children}</S.LayoutMainContainer>
            </S.LayoutPageContainer>
        </>
    );
};

export default Layout;
