import client from './client';
import type { Profile } from './types';

export const getProfile = async (id: string) => {
    const res = await client.get<Profile>(`/profiles/${id}`);
    return res.data;
};
