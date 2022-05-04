import client from './client';
import type { Profile } from './types';

export const getProfile = async (id: string) => {
    const res = await client.get<Profile>(`/profiles/${id}`);
    return res.data;
};

export const getProfileMe = async () => {
    const res = await client.get<Profile>('/profiles/me');
    return res.data;
};
