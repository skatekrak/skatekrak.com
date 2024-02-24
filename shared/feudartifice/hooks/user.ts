import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import Feudartifice from '..';
import { SubscriptionStatus, User } from '../types';

export const useUserMe = (
    options: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'> = {
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    },
) => {
    return useQuery({ queryKey: ['fetch-self'], queryFn: Feudartifice.user.getUserMe, ...options });
};

export const useIsSubscriber = () => {
    const { data: user } = useUserMe();
    return useQuery({
        queryKey: ['check-if-subscriber', user],
        queryFn: () => user?.subscriptionStatus === SubscriptionStatus.Active,
        enabled: !!user,
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });
};
