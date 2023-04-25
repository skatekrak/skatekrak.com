import client from './client';

export type GetStatsResponse = {
    spots: number;
    media: number;
};

export type GetStatsQuery = {
    from: Date;
    to: Date;
};

export const getStats = async (query: GetStatsQuery, adminToken: string) => {
    const res = await client.get<GetStatsResponse>('/admin/stats', {
        params: query,
        headers: {
            Authorization: `Bearer ${adminToken}`,
        },
    });
    return res.data;
};
