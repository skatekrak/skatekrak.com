import React from 'react';
import { NextPage } from 'next';

import Layout from 'components/Layout';
import Typography from 'components/Ui/typography/Typography';
import AuthProjectDescription from 'components/pages/auth/AuthProjectDescription';
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
                <S.AuthDoubleColumnPage>
                    <S.AuthDoubleColumnPageColumn>
                        <AuthProjectDescription />
                    </S.AuthDoubleColumnPageColumn>
                    <S.AuthDoubleColumnPageDivider />
                    <S.AuthDoubleColumnPageTightColumn>
                        <S.LoginKrakLikeIcon />
                        <S.AuthFormTitle component="condensedHeading5">Join the Nation</S.AuthFormTitle>
                        <SS.SubscribeDescription>
                            <Typography>
                                We are building the very first decentralized skateboarding Nation. Collectively owned by
                                the community.
                            </Typography>
                            <Typography>
                                ‘All feet on board’ needed. We need your support. It’s time to make the world a huge
                                playground for skateboarders.
                            </Typography>
                            <Typography component="subtitle1">Subscribe to activate your account</Typography>
                            <ul>
                                <li>$5 a month</li>
                                <li>$50 a year [i.e 2 months free]</li>
                            </ul>
                        </SS.SubscribeDescription>
                        <SS.SubscribeQuote>
                            <Typography component="body2">
                                “Skateboarding is not a hobby. And it's not a sport. Skateboarding is way of learning
                                how to redefine the world around you.” Ian Mackaye -
                            </Typography>
                        </SS.SubscribeQuote>
                        <S.AuthButtonPrimaryLink>
                            <Typography component="button">Subscribe</Typography>
                        </S.AuthButtonPrimaryLink>
                    </S.AuthDoubleColumnPageTightColumn>
                </S.AuthDoubleColumnPage>
            </S.AuthPageContainer>
        </Layout>
    );
};

export default Subscribe;
