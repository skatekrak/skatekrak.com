import { useQuery, UseQueryOptions } from 'react-query';
import Feudartifice from '..';
import { GetPortalResponse } from '../payment';

export const usePortal = (options: UseQueryOptions<GetPortalResponse> = {}) => {
    return useQuery(['fetch-payment-portal'], Feudartifice.payments.getPortal, options);
};
