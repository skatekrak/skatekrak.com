import React from 'react';
import { NextPage } from 'next';

import Layout from 'components/Layout';
import Typography from 'components/Ui/typography/Typography';
import * as S from 'components/pages/auth/Auth.styled';
import * as SS from 'components/pages/auth/Subscribe.styled';
import { useQuery } from 'react-query';
import Feudartifice from 'shared/feudartifice';
import useSession from 'lib/hook/carrelage/use-session';

const Subscribe: NextPage = () => {
    const { isSuccess: gotSession } = useSession({ redirectTo: '/auth/login' });

    const { data: checkoutURL } = useQuery(
        'get-checkout-session',
        async () => {
            /// TODO: query to get currency of user
            const { url } = await Feudartifice.payments.getCheckoutSession();
            return url;
        },
        {
            enabled: gotSession,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    );

    return (
        <Layout>
            <S.AuthPageContainer>
                <S.AuthUniqueColumnPage>
                    <S.LoginKrakLikeIcon />
                    <S.AuthFormTitle component="condensedHeading5">We need your support</S.AuthFormTitle>
                    <SS.SubscribeDescription>
                        We need your support to develop the most advanced skateboarding map out there.
                        <br />
                        <br />
                        We are building a community of passionate riders, filmers, photographs, archivists and friends.
                        We would love to see you joining us on this journey.
                    </SS.SubscribeDescription>
                    <S.AuthButtonPrimaryLink href={checkoutURL}>
                        <Typography component="button">Subscribe</Typography>
                    </S.AuthButtonPrimaryLink>
                </S.AuthUniqueColumnPage>
            </S.AuthPageContainer>
        </Layout>
    );
};

export default Subscribe;
