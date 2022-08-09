import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import Feudartifice from '..';
import { SubscriptionStatus, User } from '../types';

export const useUserMe = (
    options: UseQueryOptions<User> = {
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    },
) => {
    return useQuery(['fetch-self'], Feudartifice.user.getUserMe, options);
};

export const useIsSubscriber = () => {
    const { data: user } = useUserMe();
    return useQuery(['check-if-subscriber', user], () => user.subscriptionStatus === SubscriptionStatus.Active, {
        enabled: !!user,
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });
};
