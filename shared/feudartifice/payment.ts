import client from './client';

type GetCheckoutSessionResponse = {
    url: string;
};
export const getCheckoutSession = async (currency: 'usd' | 'eur' = 'usd') => {
    const res = await client.get<GetCheckoutSessionResponse>('/payments/getCheckoutSession', {
        params: {
            currency,
        },
    });

    return res.data;
};
