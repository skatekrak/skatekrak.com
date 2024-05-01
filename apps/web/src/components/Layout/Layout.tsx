import React, { useEffect } from 'react';
import Head from 'next/head';

import Header from '@/components/Header';
import * as S from './Layout.styled';

import { setDeviceSize } from '@/store/settings/slice';
import { useAppDispatch } from '@/store/hook';

export type LayoutProps = {
    head?: React.ReactElement;
};

const Layout: React.FC<LayoutProps & { children: React.ReactNode }> = ({ head, children }) => {
    const dispatch = useAppDispatch();

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
