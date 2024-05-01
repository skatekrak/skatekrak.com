import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import Feudartifice from '..';
import { GetCheckoutSessionResponse, GetPortalResponse } from '../payment';

export const usePortal = (options: Omit<UseQueryOptions<GetPortalResponse>, 'queryKey' | 'queryFn'> = {}) => {
    return useQuery({ queryKey: ['fetch-payment-portal'], queryFn: Feudartifice.payments.getPortal, ...options });
};

export const useCheckoutSession = (
    currency: 'usd' | 'eur' | null = null,
    options: Omit<UseQueryOptions<GetCheckoutSessionResponse>, 'queryKey' | 'queryFn'> = {},
) => {
    return useQuery({
        queryKey: ['fetch-checkout-session', currency],
        queryFn: async () => Feudartifice.payments.getCheckoutSession(currency),
        ...options,
    });
};
