import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import Feudartifice from '..';
import { GetCheckoutSessionResponse, GetPortalResponse } from '../payment';

export const usePortal = (options: UseQueryOptions<GetPortalResponse> = {}) => {
    return useQuery(['fetch-payment-portal'], Feudartifice.payments.getPortal, options);
};

export const useCheckoutSession = (
    currency: 'usd' | 'eur' | null = null,
    options: UseQueryOptions<GetCheckoutSessionResponse> = {},
) => {
    return useQuery(
        ['fetch-checkout-session', currency],
        async () => Feudartifice.payments.getCheckoutSession(currency),
        options,
    );
};
