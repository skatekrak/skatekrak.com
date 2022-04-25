import React, { useMemo } from 'react';
import { NextPage } from 'next';

import Layout from 'components/Layout';
import Typography from 'components/Ui/typography/Typography';
import AuthProjectDescription from 'components/pages/auth/AuthProjectDescription';
import * as S from 'components/pages/auth/Auth.styled';
import * as SS from 'components/pages/auth/Subscribe.styled';

import useSession from 'lib/hook/carrelage/use-session';
import { useCheckoutSession } from 'shared/feudartifice/hooks/payment';
import { useRouter } from 'next/router';
import { useUserMe } from 'shared/feudartifice/hooks/user';
import { SubscriptionStatus } from 'shared/feudartifice/types';

const Subscribe: NextPage = () => {
    const { isSuccess: gotSession } = useSession({ redirectTo: '/auth/login' });
    const router = useRouter();
    const { data: me } = useUserMe();

    const { data: checkoutSession } = useCheckoutSession(null, {
        enabled: gotSession && !!me,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const monthlyPrice = useMemo(() => {
        if (checkoutSession == null) {
            return '';
        }

        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: checkoutSession.currency,
            minimumFractionDigits: 0,
        }).format(5);
    }, [checkoutSession]);

    const yearlyPrice = useMemo(() => {
        if (checkoutSession == null) {
            return '';
        }

        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: checkoutSession.currency,
            minimumFractionDigits: 0,
        }).format(50);
    }, [checkoutSession]);

    if (me?.subscriptionStatus === SubscriptionStatus.Active) {
        router.push('/');
    }

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
                                <li>{monthlyPrice} a month</li>
                                <li>{yearlyPrice} a year [i.e 2 months free]</li>
                            </ul>
                        </SS.SubscribeDescription>
                        <SS.SubscribeQuote>
                            <Typography component="body2">
                                “Skateboarding is not a hobby. And it's not a sport. Skateboarding is way of learning
                                how to redefine the world around you.” Ian Mackaye -
                            </Typography>
                        </SS.SubscribeQuote>
                        <S.AuthButtonPrimaryLink href={checkoutSession?.url ?? '#'}>
                            <Typography component="button">Subscribe</Typography>
                        </S.AuthButtonPrimaryLink>
                    </S.AuthDoubleColumnPageTightColumn>
                </S.AuthDoubleColumnPage>
            </S.AuthPageContainer>
        </Layout>
    );
};

export default Subscribe;
