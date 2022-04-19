import client from './client';
import { User } from './types';

type UserChanges = {
    password: string;
    email: string;
};

export const editUser = async (id: string, changes: Partial<UserChanges>) => {
    const res = await client.put<User>(`/users/${id}`, {
        ...changes,
    });

    return res.data;
};

export const getUserMe = async () => {
    const res = await client.get<User>('/users/me');
    return res.data;
};
