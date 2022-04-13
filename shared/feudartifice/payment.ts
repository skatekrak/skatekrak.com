import client from './client';

export type GetCheckoutSessionResponse = {
    url: string;
    currency: 'usd' | 'eur';
};
export const getCheckoutSession = async (currency: 'usd' | 'eur' | null = null) => {
    const res = await client.post<GetCheckoutSessionResponse>('/payments/createCheckoutSession', {
        params: {
            currency,
        },
    });

    return res.data;
};
export type GetPortalResponse = {
    url: string;
};
export const getPortal = async () => {
    const res = await client.get<GetPortalResponse>('/payments/portal');

    return res.data;
};
